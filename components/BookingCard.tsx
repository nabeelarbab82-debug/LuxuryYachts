'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendar, FaUsers } from 'react-icons/fa';

export default function BookingCard() {
    const [formData, setFormData] = useState({
        date: new Date(),
        package: 'shared',
        guests: 2,
    });

    const packages = [
        { value: 'shared', label: 'Shared Dinner Cruise', price: 'AED 250' },
        { value: 'premium', label: 'Premium Dinner Cruise', price: 'AED 450' },
        { value: 'vip', label: 'VIP Private Deck', price: 'AED 750' },
        { value: 'buyout', label: 'Full Yacht Buyout', price: 'Contact Us' },
    ];

    const handleQuickBook = () => {
        // Scroll to full booking section
        document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="card-luxury backdrop-blur-sm bg-navy-800/95 shadow-2xl">
            <div className="border-b border-gold-500/30 pb-4 mb-6">
                <h3 className="text-2xl font-bold text-gold-500">Quick Booking</h3>
                <p className="text-gray-300 text-sm mt-1">Reserve your experience now</p>
            </div>

            <div className="space-y-5">
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Package
                    </label>
                    <select
                        value={formData.package}
                        onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                        className="w-full bg-navy-700 border border-gold-500/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold-500"
                    >
                        {packages.map((pkg) => (
                            <option key={pkg.value} value={pkg.value}>
                                {pkg.label} - {pkg.price}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Number of Guests */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        <FaUsers className="inline mr-2" />
                        Number of Guests
                    </label>
                    <input
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
                    Check Availability
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
            </div>
        </div>
    );
}
