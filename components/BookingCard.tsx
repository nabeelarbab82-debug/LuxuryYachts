'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendar, FaUsers } from 'react-icons/fa';

export default function BookingCard() {
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        date: new Date(),
        package: '',
        guests: 2,
    });

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const res = await fetch('/api/packages');
            const data = await res.json();
            if (data.success) {
                const activePackages = data.packages.filter((p: any) => p.active);
                setPackages(activePackages);
                // Set first package as default
                if (activePackages.length > 0) {
                    setFormData(prev => ({ ...prev, package: activePackages[0]._id }));
                }
            }
        } catch (error) {
            console.error('Error fetching packages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickBook = () => {
        const selectedPkg = packages.find(p => p._id === formData.package);
        if (selectedPkg) {
            // Navigate to package detail page
            window.location.href = `/packages/${selectedPkg.slug}`;
        } else {
            // Fallback to packages page
            window.location.href = '/packages';
        }
    };

    return (
        <div className="card-luxury backdrop-blur-sm bg-navy-800/95 shadow-2xl">
            <div className="border-b border-gold-500/30 pb-4 mb-6">
                <h3 className="text-2xl font-bold text-gold-500">Quick Booking</h3>
                <p className="text-gray-300 text-sm mt-1">Reserve your experience now</p>
            </div>

            <div className="space-y-5">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500 mx-auto"></div>
                        <p className="text-gray-400 text-sm mt-2">Loading packages...</p>
                    </div>
                ) : packages.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-400">No packages available</p>
                    </div>
                ) : (
                    <>
                        {/* Date Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <FaCalendar className="inline mr-2" />
                                Select Date
                            </label>
                            <DatePicker
                                selected={formData.date}
                                onChange={(date: Date | null) => setFormData({ ...formData, date: date || new Date() })}
                            />
                        </div>

                        {/* Package Selection */}
                        <div>
                            <label htmlFor="booking-package" className="block text-sm font-medium text-gray-300 mb-2">
                                Select Package
                            </label>
                            <select
                                id="booking-package"
                                value={formData.package}
                                onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                                className="w-full bg-navy-700 border border-gold-500/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold-500"
                            >
                                {packages.map((pkg) => {
                                    const priceDisplay = pkg.priceType === 'per_hour'
                                        ? `AED ${pkg.price}/hour`
                                        : pkg.priceType === 'per_person'
                                            ? `AED ${pkg.pricing?.adultPrice || pkg.price}/person`
                                            : `AED ${pkg.price}`;

                                    return (
                                        <option key={pkg._id} value={pkg._id}>
                                            {pkg.name} - {priceDisplay}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        {/* Number of Guests */}
                        <div>
                            <label htmlFor="number-of-guests" className="block text-sm font-medium text-gray-300 mb-2">
                                <FaUsers className="inline mr-2" />
                                Number of Guests
                            </label>
                            <input
                                id="number-of-guests"
                                type="number"
                                min="1"
                                max="135"
                                value={formData.guests}
                                onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                                className="w-full bg-navy-700 border border-gold-500/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold-500"
                            />
                        </div>

                        {/* Quick Book Button */}
                        <button
                            onClick={handleQuickBook}
                            className="w-full btn-primary text-center"
                        >
                            View Package Details
                        </button>

                        {/* Help Text */}
                        <p className="text-center text-sm text-gray-400">
                            Need help?{' '}
                            <button
                                onClick={() => {
                                    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971XXXXXXXXX';
                                    const message = encodeURIComponent('Hi, I need help with booking the dinner cruise.');
                                    window.open(`https://wa.me/${number}?text=${message}`, '_blank');
                                }}
                                className="text-gold-500 hover:text-gold-600 underline"
                            >
                                Chat on WhatsApp
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
