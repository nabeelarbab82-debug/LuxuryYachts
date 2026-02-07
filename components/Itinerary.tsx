'use client';

import { motion } from 'framer-motion';
import { FaClock, FaShip, FaMapMarkerAlt, FaTshirt } from 'react-icons/fa';

export default function Itinerary() {
    const details = [
        {
            icon: <FaClock />,
            label: 'Boarding Time',
            value: '7:00 PM - 7:30 PM',
        },
        {
            icon: <FaShip />,
            label: 'Departure Time',
            value: '7:45 PM',
        },
        {
            icon: <FaClock />,
            label: 'Cruise Duration',
            value: '2.5 - 3 Hours',
        },
        {
            icon: <FaTshirt />,
            label: 'Dress Code',
            value: 'Smart Casual',
        },
    ];

    const routeHighlights = [
        'Dubai Marina Promenade',
        'Ain Dubai (Dubai Eye)',
        'Bluewaters Island',
        'JBR Beach',
        'Marina Skyline',
        'Luxury Yacht Harbor',
    ];

    return (
        <section className="section-padding bg-navy-900">
            <div className="container-custom">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                        Itinerary & <span className="text-gold-500">Details</span>
                    </h2>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Everything you need to know for your cruise
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left: Details Cards */}
                    <div className="space-y-6">
                        {details.map((detail, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="card-luxury flex items-center gap-4"
                            >
                                <div className="text-4xl text-gold-500">{detail.icon}</div>
                                <div>
                                    <p className="text-gray-400 text-sm">{detail.label}</p>
                                    <p className="text-white text-lg font-semibold">
                                        {detail.value}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right: Route Highlights & Map */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        {/* Route Highlights */}
                        <div className="card-luxury">
                            <h3 className="text-2xl font-bold text-gold-500 mb-4">
                                Route Highlights
                            </h3>
                            <ul className="space-y-3">
                                {routeHighlights.map((highlight, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-3 text-gray-300"
                                    >
                                        <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                                        {highlight}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Boarding Location Map */}
                        <div className="card-luxury">
                            <h3 className="text-2xl font-bold text-gold-500 mb-4 flex items-center gap-2">
                                <FaMapMarkerAlt /> Boarding Location
                            </h3>
                            <p className="text-gray-300 mb-4">
                                Dubai Marina Yacht Club
                                <br />
                                Dubai Marina, Dubai, UAE
                            </p>

                            {/* Embedded Map Placeholder */}
                            <div className="bg-navy-700 rounded-lg h-[250px] flex items-center justify-center border border-gold-500/20">
                                <div className="text-center text-gray-400">
                                    <FaMapMarkerAlt className="text-4xl text-gold-500 mx-auto mb-2" />
                                    <p>Google Maps Integration</p>
                                    <p className="text-sm mt-1">Add your map embed code here</p>
                                </div>
                            </div>

                            <button className="mt-4 w-full btn-secondary">
                                Get Directions
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
