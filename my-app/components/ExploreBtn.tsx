'use client';
import Image from 'next/image';

const ExploreBtn = () => {
  return (
    <a href="#events" id="explore-btn" className="mt-8 mx-auto flex items-center gap-2" onClick={()=> console.log('Click')}>
            Explore Events
            <Image src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24} />
    </a>
  )
}

export default ExploreBtn