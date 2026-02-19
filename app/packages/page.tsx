'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaArrowRight } from 'react-icons/fa';

export default function PackagesPage() {
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const res = await fetch('/api/packages');
            const data = await res.json();
            if (data.success) {
                setPackages(data.packages.filter((p: any) => p.active));
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPackages = packages.filter((pkg) => {
        const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || pkg.type === filterType;
        return matchesSearch && matchesFilter;
    });

    return (
        <>
            <Header />
            <main className="min-h-screen bg-navy-900 pt-20">
                {/* Hero Section */}
                <section className="section-padding bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
                    <div className="container-custom text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                                Our <span className="text-gold-500">Yacht Packages</span>
                            </h1>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                                Discover the perfect yacht experience for your celebration or event
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Filters Section */}
                <section className="section-padding bg-navy-800">
                    <div className="container-custom">
                        <div className="flex flex-col md:flex-row gap-4 mb-12">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search packages..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-navy-700 border border-gold-500/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-gold-500"
                                />
                            </div>

                            {/* Filter */}
                            <div className="md:w-64 relative">
                                <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <label htmlFor="package-type-filter" className="sr-only">Filter by package type</label>
                                <select
                                    id="package-type-filter"
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full bg-navy-700 border border-gold-500/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-gold-500 appearance-none cursor-pointer"
                                >
                                    <option value="all">All Types</option>
                                    <option value="shared">Shared</option>
                                    <option value="premium">Premium</option>
                                    <option value="vip">VIP</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>
                        </div>

                        {/* Packages Grid */}
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
                                <p className="text-gray-400 mt-4">Loading packages...</p>
                            </div>
                        ) : filteredPackages.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredPackages.map((pkg, index) => (
                                    <motion.div
                                        key={pkg._id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link href={`/packages/${pkg.slug}`} className="block group">
                                            <div className="card-luxury h-full transition-transform duration-300 group-hover:scale-105">
                                                {/* Image */}
                                                {pkg.mainImage?.url ? (
                                                    <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                                                        <img
                                                            src={pkg.mainImage.url}
                                                            alt={pkg.name}
                                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                        />
                                                        {pkg.featured && (
                                                            <div className="absolute top-4 right-4 bg-gold-500 text-navy-900 px-3 py-1 rounded-full text-xs font-bold">
                                                                FEATURED
                                                            </div>
                                                        )}
                                                        <div className="absolute bottom-4 left-4 bg-navy-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm capitalize">
                                                            {pkg.type}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="h-64 mb-4 rounded-lg bg-gradient-to-br from-navy-700 to-navy-600 flex items-center justify-center">
                                                        <span className="text-gold-500 text-lg">No Image</span>
                                                    </div>
                                                )}

                                                {/* Content */}
                                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-gold-500 transition-colors">
                                                    {pkg.name}
                                                </h3>

                                                <p className="text-gray-400 mb-4 line-clamp-3">
                                                    {pkg.shortDescription || pkg.description}
                                                </p>

                                                {/* Details */}
                                                {pkg.yachtDetails?.capacity && (
                                                    <p className="text-sm text-gray-500 mb-2">
                                                        Capacity: {pkg.yachtDetails.capacity} guests
                                                    </p>
                                                )}

                                                {/* Price */}
                                                <div className="flex items-end justify-between">
                                                    <div>
                                                        <div className="text-3xl font-bold text-gold-500">
                                                            AED {pkg.price}
                                                        </div>
                                                        <div className="text-gray-400 text-sm">
                                                            {pkg.priceType === 'per_hour' && 'per hour'}
                                                            {pkg.priceType === 'per_person' && 'per person'}
                                                            {pkg.priceType === 'flat_rate' && 'flat rate'}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gold-500 font-semibold">
                                                        Book Now
                                                        <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 card-luxury">
                                <p className="text-gray-400 text-lg">No packages found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </section>

                <Footer />
                <WhatsAppButton />
            </main>
        </>
    );
}
