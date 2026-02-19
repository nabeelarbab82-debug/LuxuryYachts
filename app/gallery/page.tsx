import React from 'react';


const galleryItems = [
    {
        src: '/gallery/yacht-exterior.jpeg',
        title: 'Yacht Exterior',
        description: 'Yacht exterior at sunset, showcasing the elegant lines and luxury design.'
    },
    {
        src: '/gallery/dining-setup.jpeg',
        title: 'Dining Setup',
        description: 'Elegant dining setup on deck, perfect for special occasions and celebrations.'
    },
    {
        src: '/gallery/guests-dinner.jpeg',
        title: 'Guests Dinner',
        description: 'Guests enjoying a gourmet dinner with a sea view.'
    },
    {
        src: '/gallery/marina-skyline.jpeg',
        title: 'Marina Skyline',
        description: 'Breathtaking Dubai Marina skyline view from the yacht.'
    },
    {
        src: '/gallery/entertainment.jpeg',
        title: 'Entertainment',
        description: 'Live entertainment moments on board for an unforgettable experience.'
    },
    {
        src: '/gallery/deck-view.jpeg',
        title: 'Deck View',
        description: 'Open deck view for sunbathing and relaxation.'
    },
    {
        src: '/gallery/interior.jpeg',
        title: 'Luxury Interior',
        description: 'Step inside to a world of luxury and comfort.'
    },
    {
        src: '/gallery/night-cruise.jpeg',
        title: 'Night Cruise',
        description: 'Experience the magic of a night cruise under the stars.'
    },
];

export default function GalleryPage() {
    return (
        <main className="max-w-5xl mx-auto py-16 px-4">
            <h1 className="text-4xl font-bold mb-8 text-center">Gallery</h1>
            {/* Video section */}
            <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex justify-center">
                    <video
                        controls
                        poster="/gallery/video-thumbnail.jpeg"
                        className="rounded-lg shadow-lg w-full max-w-2xl"
                    >
                        <source src="/gallery/y-v1.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className="flex flex-col gap-8">
                    <video
                        controls
                        className="rounded-lg shadow-lg w-full max-w-2xl"
                    >
                        <source src="https://res.cloudinary.com/dm87rn19g/video/upload/v1771468054/zgonpdekuwnjlzgvemcf.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <video
                        controls
                        className="rounded-lg shadow-lg w-full max-w-2xl"
                    >
                        <source src="https://res.cloudinary.com/dm87rn19g/video/upload/v1771466574/jcsvgrwo16rnvz3ktktf.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {galleryItems.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                        <img
                            src={item.src}
                            alt={item.title}
                            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-4 flex-1 flex flex-col">
                            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                            <p className="text-gray-600 flex-1">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
