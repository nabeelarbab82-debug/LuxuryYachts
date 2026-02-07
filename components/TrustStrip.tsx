'use client';

import { FaStar, FaUsers, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function TrustStrip() {
    const items = [
        {
            icon: <FaStar />,
            text: 'Premium Yacht Experience',
        },
        {
            icon: <FaUsers />,
            text: '135 Guest Capacity',
        },
        {
            icon: <FaMapMarkerAlt />,
            text: 'Dubai Marina',
        },
        {
            icon: <FaShieldAlt />,
            text: 'Secure Online Booking',
        },
    ];

    return (
        <section className="bg-navy-800 border-y border-gold-500/20 py-8">
            <div className="container-custom px-4 md:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col items-center text-center gap-3"
                        >
                            <div className="text-4xl text-gold-500">{item.icon}</div>
                            <p className="text-white text-sm md:text-base font-medium">
                                {item.text}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
