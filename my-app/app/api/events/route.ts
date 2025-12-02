import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/lib/mongodb";
import Event from "@/database/event.model";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Define expected event parameters for type safety
interface IEventParams {
  title: string;
  description: string;
  overview: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  image: string;
  agenda?: string[];
  tags?: string[];
  [key: string]: any; // Allow other properties temporarily
}

// ----------------------------
// MAIN CREATE EVENT ROUTE
// ----------------------------
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const contentType = req.headers.get("content-type") || "";
    let eventData: Partial<IEventParams> = {};

    // ───────────────────────────────────────────────
    // 1️⃣ MULTIPART FORM-DATA (FILE UPLOAD)
    // ───────────────────────────────────────────────
    if (contentType.startsWith("multipart/form-data")) {
      console.log("Received Content-Type:", contentType); // Debugging

      if (!contentType.includes("boundary=")) {
        return NextResponse.json(
          { 
            message: "Missing boundary in multipart/form-data header", 
            error: "Do not manually set 'Content-Type: multipart/form-data'. Let the browser/client set it automatically with the boundary." 
          },
          { status: 400 }
        );
      }

      try {
        const formData = await req.formData();

        // Convert FormData entries to object
        for (const [key, value] of formData.entries()) {
          // Skip file objects in the loop, handle them separately
          if (value instanceof File) continue;
          eventData[key] = value as string;
        }

        // Parse 'agenda' (expecting JSON string or plain string)
        const agendaRaw = formData.get("agenda");
        if (agendaRaw && typeof agendaRaw === "string") {
          try {
            eventData.agenda = JSON.parse(agendaRaw);
          } catch {
            // If not JSON, assume it's a single item or comma-separated
            eventData.agenda = [agendaRaw];
          }
        }

        // Parse 'tags' (expecting JSON string or plain string)
        const tagsRaw = formData.get("tags");
        if (tagsRaw && typeof tagsRaw === "string") {
          try {
            eventData.tags = JSON.parse(tagsRaw);
          } catch {
            eventData.tags = [tagsRaw];
          }
        }

        // -------------------------
        // Image handling (Cloudinary)
        // -------------------------
        const imageFile = formData.get("image");

        if (imageFile && imageFile instanceof File) {
          const arrayBuffer = await imageFile.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const uploadResult: any = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "DevEvent" },
              (err, res) => {
                if (err) {
                  console.error("Cloudinary Upload Error:", err);
                  reject(err);
                } else {
                  resolve(res);
                }
              }
            );
            uploadStream.end(buffer);
          });

          eventData.image = uploadResult.secure_url;
        }
      } catch (error: any) {
        console.error("Error parsing FormData:", error);
        return NextResponse.json(
          { message: "Failed to parse form data", error: error?.message || String(error) },
          { status: 400 }
        );
      }
    }

    // ───────────────────────────────────────────────
    // 2️⃣ JSON REQUEST (NO FILE)
    // ───────────────────────────────────────────────
    else if (contentType.includes("application/json")) {
      try {
        eventData = await req.json();
      } catch (error) {
        return NextResponse.json(
          { message: "Invalid JSON body" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "Unsupported Content-Type" },
        { status: 415 }
      );
    }

    // ───────────────────────────────────────────────
    // VALIDATE REQUIRED FIELDS
    // ───────────────────────────────────────────────
    const requiredFields = [
      "title",
      "description",
      "overview",
      "location",
      "date",
      "time",
      "mode",
      "audience",
      "image", // Image URL must be present (either from JSON or uploaded)
    ];

    for (const field of requiredFields) {
      if (!eventData[field]) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Save to MongoDB
    const newEvent = await Event.create(eventData);

    return NextResponse.json(
      { message: "Event created successfully", event: newEvent },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ EVENT CREATE ERROR:", error);

    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

// ----------------------------
// GET ALL EVENTS
// ----------------------------
export async function GET() {
  try {
    await dbConnect();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json(
      { message: "Events fetched", events },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Event fetch failed", error: error?.message },
      { status: 500 }
    );
  }
}

