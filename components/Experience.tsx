'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Experience() {
    return (
        <section className="section-padding bg-navy-900">
            <div className="container-custom">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                            Experience Dubai from the{' '}
                            <span className="text-gold-500">Water</span>
                        </h2>

                        <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                            <p>
                                Step aboard a luxury yacht designed for elegant evenings at sea.
                                Enjoy curated dining, live entertainment, and breathtaking views
                                of Dubai Marina and its skyline.
                            </p>

                            <p>
                                Perfect for couples, families, celebrations, and corporate gatherings,
                                our dinner cruise offers an unparalleled experience that combines
                                sophistication with the stunning beauty of Dubai's coastline.
                            </p>

                            <p>
                                With capacity for up to 135 guests, state-of-the-art facilities,
                                and exceptional service, we ensure every moment aboard is memorable.
                            </p>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <div className="bg-navy-800 border border-gold-500/30 rounded-lg px-6 py-4">
                                <p className="text-gold-500 font-bold text-2xl">2.5-3</p>
                                <p className="text-gray-400 text-sm">Hours</p>
                            </div>
                            <div className="bg-navy-800 border border-gold-500/30 rounded-lg px-6 py-4">
                                <p className="text-gold-500 font-bold text-2xl">135</p>
                                <p className="text-gray-400 text-sm">Capacity</p>
                            </div>
                            <div className="bg-navy-800 border border-gold-500/30 rounded-lg px-6 py-4">
                                <p className="text-gold-500 font-bold text-2xl">5★</p>
                                <p className="text-gray-400 text-sm">Service</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent z-10"></div>
                        <img
                            src="/experience-yacht.jpg"
                            alt="Luxury Yacht Experience"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback with overlay
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.style.background = 'linear-gradient(135deg, #1a2942 0%, #0f1f3a 100%)';
                                e.currentTarget.parentElement!.innerHTML += '<div class="absolute inset-0 flex items-center justify-center text-gold-500 text-xl">Luxury Yacht Experience</div>';
                            }}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
