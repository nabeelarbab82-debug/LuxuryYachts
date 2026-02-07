'use client';

import { motion } from 'framer-motion';
import { FaShip, FaCouch, FaConciergeBell, FaUsers, FaAnchor } from 'react-icons/fa';

export default function WhyChoose() {
    const reasons = [
        {
            icon: <FaShip />,
            title: 'Largest Dinner Yacht',
            description: 'One of the largest dinner yachts in Dubai with 135-guest capacity',
        },
        {
            icon: <FaCouch />,
            title: 'Elegant Interiors',
            description: 'Luxurious interiors & spacious open deck seating for comfort',
        },
        {
            icon: <FaConciergeBell />,
            title: 'Professional Service',
            description: 'Exceptional hospitality from experienced crew members',
        },
        {
            icon: <FaUsers />,
            title: 'Perfect for Groups',
            description: 'Ideal for large groups, families, and corporate events',
        },
        {
            icon: <FaAnchor />,
            title: 'Prime Location',
            description: 'Smooth boarding & easy marina access from Dubai Marina',
        },
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
                        Why Choose <span className="text-gold-500">This Yacht</span>
                    </h2>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Experience excellence in every detail
                    </p>
                </motion.div>

                {/* Reasons Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reasons.map((reason, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="card-luxury text-center group cursor-pointer"
                        >
                            <div className="text-5xl text-gold-500 mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                                {reason.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">
                                {reason.title}
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                                {reason.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
