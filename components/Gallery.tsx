'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaPlay } from 'react-icons/fa';

export default function Gallery() {
    const [selectedVideo, setSelectedVideo] = useState(false);

    const images = [
        { src: '/gallery/yacht-exterior.jpeg', alt: 'Yacht Exterior at Sunset' },
        { src: '/gallery/dining-setup.jpeg', alt: 'Elegant Dining Setup' },
        { src: '/gallery/guests-dinner.jpeg', alt: 'Guests Enjoying Dinner' },
        { src: '/gallery/marina-skyline.jpeg', alt: 'Dubai Marina Skyline' },
        { src: '/gallery/entertainment.jpeg', alt: 'Live Entertainment' },
        { src: '/gallery/deck-view.jpeg', alt: 'Open Deck View' },
        { src: '/gallery/interior.jpeg', alt: 'Luxury Interior' },
        { src: '/gallery/night-cruise.jpeg', alt: 'Night Cruise Experience' },
    ];

    return (
        <section className="section-padding bg-navy-800">
            <div className="container-custom">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                        Gallery & <span className="text-gold-500">Experience</span>
                    </h2>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        See what awaits you aboard our luxury yacht
                    </p>
                </motion.div>

                {/* Featured Video */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mb-8 relative h-[300px] md:h-[500px] rounded-lg overflow-hidden group cursor-pointer"
                    onClick={() => setSelectedVideo(true)}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent z-10"></div>
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="bg-gold-500 rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                            <FaPlay className="text-navy-900 text-3xl ml-1" />
                        </div>
                    </div>
                    <img
                        src="/gallery/video-thumbnail.jpeg"
                        alt="Experience Video"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.style.background = 'linear-gradient(135deg, #1a2942 0%, #0f1f3a 100%)';
                        }}
                    />
                </motion.div>

                {/* Image Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="relative h-[200px] md:h-[250px] rounded-lg overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-navy-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                                <p className="text-white text-sm font-medium">{image.alt}</p>
                            </div>
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.style.background = 'linear-gradient(135deg, #1a2942 0%, #0f1f3a 100%)';
                                    e.currentTarget.parentElement!.innerHTML += `<div class="absolute inset-0 flex items-center justify-center text-gold-500 text-sm text-center p-4">${image.alt}</div>`;
                                }}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Video Modal */}
                {selectedVideo && (
                    <div
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedVideo(false)}
                    >
                        <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-navy-800 p-4 rounded-lg">
                                <div className="aspect-video bg-navy-700">
                                    <video
                                        className="w-full h-full"
                                        controls
                                        autoPlay
                                        src="https://res.cloudinary.com/dm87rn19g/video/upload/v1771466574/jcsvgrwo16rnvz3ktktf.mp4"
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                                <button
                                    onClick={() => setSelectedVideo(false)}
                                    className="mt-4 w-full btn-secondary py-2"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
