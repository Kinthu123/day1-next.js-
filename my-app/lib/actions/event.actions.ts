'use server';
import Event from "@/database/event.model"
import dbConnect from "../mongodb";

export const getSimilarEventsBySlug = async (slug: string) =>{
    try{
        await dbConnect();
        const event = await Event.findOne({slug});

        if(!event) {
            console.log('Event not found for slug:', slug);
            return [];
        }
        
        const similarEvents = await Event.find({ _id:{ $ne: event._id }, tags: {$in: event.tags}}).lean();
        console.log('Found similar events:', similarEvents.length);
        return similarEvents;

    }catch(error){
        console.error('Error fetching similar events:', error);
        return[];
    }
}