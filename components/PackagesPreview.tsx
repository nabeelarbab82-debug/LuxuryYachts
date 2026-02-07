'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

export default function PackagesPreview() {
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const res = await fetch('/api/packages');
            const data = await res.json();
            if (data.success) {
                // Get first 6 active packages
                setPackages(data.packages.filter((p: any) => p.active).slice(0, 6));
            }
        } catch (error) {
            console.error('Error fetching packages:', error);
        } finally {
            setLoading(false);
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
                        Our <span className="text-gold-500">Packages</span>
                    </h2>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Choose from our exclusive selection of luxury yacht experiences
                    </p>
                </motion.div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
                    </div>
                ) : (
                    <>
                        {/* Packages Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {packages.map((pkg, index) => (
                                <motion.div
                                    key={pkg._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link href={`/packages/${pkg.slug}`} className="block group">
                                        <div className="card-luxury h-full transition-transform duration-300 group-hover:scale-105">
                                            {/* Package Image */}
                                            {pkg.mainImage?.url ? (
                                                <div className="relative h-56 mb-4 rounded-lg overflow-hidden">
                                                    <img
                                                        src={pkg.mainImage.url}
                                                        alt={pkg.name}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                    />
                                                    {pkg.featured && (
                                                        <div className="absolute top-4 right-4 bg-gold-500 text-navy-900 px-3 py-1 rounded-full text-sm font-bold">
                                                            FEATURED
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="h-56 mb-4 rounded-lg bg-gradient-to-br from-navy-700 to-navy-600 flex items-center justify-center">
                                                    <span className="text-gold-500 text-lg">No Image</span>
                                                </div>
                                            )}

                                            {/* Package Info */}
                                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-gold-500 transition-colors">
                                                {pkg.name}
                                            </h3>

                                            <p className="text-gray-400 mb-4 line-clamp-2">
                                                {pkg.shortDescription || pkg.description || 'Luxury yacht experience'}
                                            </p>

                                            {/* Price */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <span className="text-3xl font-bold text-gold-500">
                                                        AED {pkg.price}
                                                    </span>
                                                    <span className="text-gray-400 text-sm ml-2">
                                                        {pkg.priceType === 'per_hour' && '/ hour'}
                                                        {pkg.priceType === 'per_person' && '/ person'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* CTA */}
                                            <div className="flex items-center justify-between text-gold-500 font-semibold">
                                                <span>View Details</span>
                                                <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* See All Button */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <Link href="/packages" className="btn-primary inline-flex items-center gap-2">
                                See All Packages
                                <FaArrowRight />
                            </Link>
                        </motion.div>
                    </>
                )}

                {packages.length === 0 && !loading && (
                    <div className="text-center py-12 text-gray-400">
                        <p>No packages available at the moment.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
