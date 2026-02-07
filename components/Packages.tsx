'use client';

import { motion } from 'framer-motion';
import { FaCheck, FaStar } from 'react-icons/fa';

export default function Packages() {
    const packages = [
        {
            name: 'Shared Dinner Cruise',
            price: '250',
            period: 'per person',
            featured: false,
            inclusions: [
                'Buffet dinner',
                'Soft drinks',
                'Live entertainment',
                'Standard seating',
                '2.5-3 hour cruise',
            ],
        },
        {
            name: 'Premium Dinner Cruise',
            price: '450',
            period: 'per person',
            featured: true,
            inclusions: [
                'Plated premium menu',
                'Welcome drink',
                'Priority seating',
                'Live entertainment',
                'Complimentary photos',
            ],
        },
        {
            name: 'VIP Private Deck',
            price: '750',
            period: 'per person',
            featured: false,
            inclusions: [
                'Private seating area',
                'Premium service',
                'Best views',
                'Dedicated host',
                'Premium beverages',
            ],
        },
        {
            name: 'Full Yacht Buyout',
            price: 'Contact',
            period: 'up to 135 guests',
            featured: false,
            inclusions: [
                'Exclusive yacht access',
                'Custom menu & décor',
                'Ideal for events',
                'Dedicated crew',
                'Flexible timing',
            ],
        },
    ];

    const handleBookNow = (packageName: string) => {
        const bookingSection = document.getElementById('booking-section');
        if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth' });
            // You can also pre-select the package here
        }
    };

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
                        Packages & <span className="text-gold-500">Pricing</span>
                    </h2>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Choose the perfect experience for your celebration
                    </p>
                </motion.div>

                {/* Package Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {packages.map((pkg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative ${pkg.featured
                                    ? 'card-luxury ring-2 ring-gold-500 transform lg:-translate-y-4'
                                    : 'card-luxury'
                                }`}
                        >
                            {/* Featured Badge */}
                            {pkg.featured && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <div className="bg-gold-500 text-navy-900 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                        <FaStar /> POPULAR
                                    </div>
                                </div>
                            )}

                            {/* Package Name */}
                            <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-baseline gap-1">
                                    {pkg.price !== 'Contact' && (
                                        <span className="text-gold-500 text-sm">AED</span>
                                    )}
                                    <span className="text-4xl font-bold text-gold-500">
                                        {pkg.price}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm">{pkg.period}</p>
                            </div>

                            {/* Inclusions */}
                            <ul className="space-y-3 mb-6">
                                {pkg.inclusions.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-gray-300">
                                        <FaCheck className="text-gold-500 mt-1 flex-shrink-0" />
                                        <span className="text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Book Button */}
                            <button
                                onClick={() => handleBookNow(pkg.name)}
                                className={`w-full ${pkg.featured ? 'btn-primary' : 'btn-secondary'
                                    } text-center`}
                            >
                                Book Now
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <p className="text-gray-400 text-sm">
                        * All prices are subject to availability. Contact us for group discounts and special offers.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
