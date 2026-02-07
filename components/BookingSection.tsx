'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendar, FaUsers, FaUserAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

export default function BookingSection() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: new Date(),
        package: 'shared',
        guests: 2,
        specialRequests: '',
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const packages = [
        { value: 'shared', label: 'Shared Dinner Cruise', price: 250 },
        { value: 'premium', label: 'Premium Dinner Cruise', price: 450 },
        { value: 'vip', label: 'VIP Private Deck', price: 750 },
        { value: 'buyout', label: 'Full Yacht Buyout', price: 0 },
    ];

    const addOns = [
        { name: 'Photography Package', price: 200 },
        { name: 'Cake & Decoration', price: 150 },
        { name: 'Premium Beverages', price: 100 },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Booking request submitted successfully! We will contact you shortly.');
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    date: new Date(),
                    package: 'shared',
                    guests: 2,
                    specialRequests: '',
                });
            } else {
                setMessage(data.error || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            setMessage('Failed to submit booking. Please try again or contact us on WhatsApp.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="booking-section" className="section-padding bg-navy-900">
            <div className="container-custom">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                        Complete Your <span className="text-gold-500">Booking</span>
                    </h2>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Fill in your details and we'll confirm your reservation
                    </p>
                </motion.div>

                {/* Booking Form */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <form onSubmit={handleSubmit} className="card-luxury">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <FaUserAlt className="inline mr-2" />
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-navy-700 border border-gold-500/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold-500"
                                    placeholder="John Doe"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <FaEnvelope className="inline mr-2" />
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-navy-700 border border-gold-500/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold-500"
                                    placeholder="john@example.com"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <FaPhone className="inline mr-2" />
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-navy-700 border border-gold-500/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold-500"
                                    placeholder="+971 XX XXX XXXX"
                                />
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <FaCalendar className="inline mr-2" />
                                    Cruise Date *
                                </label>
                                <DatePicker
                                    selected={formData.date}
                                    onChange={(date: Date | null) => setFormData({ ...formData, date: date || new Date() })}
                                    minDate={new Date()}
                                    dateFormat="MMMM d, yyyy"
                                    className="w-full bg-navy-700 border border-gold-500/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold-500"
                                />
                            </div>

                            {/* Package */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Select Package *
                                </label>
                                <select
                                    required
                                    value={formData.package}
                                    onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                                    className="w-full bg-navy-700 border border-gold-500/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold-500"
                                >
                                    {packages.map((pkg) => (
                                        <option key={pkg.value} value={pkg.value}>
                                            {pkg.label} {pkg.price > 0 && `- AED ${pkg.price}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Guests */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <FaUsers className="inline mr-2" />
                                    Number of Guests *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max="135"
                                    value={formData.guests}
                                    onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                                    className="w-full bg-navy-700 border border-gold-500/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold-500"
                                />
                            </div>
                        </div>

                        {/* Special Requests */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Special Requests or Dietary Requirements
                            </label>
                            <textarea
                                value={formData.specialRequests}
                                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                                rows={4}
                                className="w-full bg-navy-700 border border-gold-500/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold-500"
                                placeholder="Let us know about any special requirements..."
                            />
                        </div>

                        {/* Message */}
                        {message && (
                            <div
                                className={`mt-6 p-4 rounded-md ${message.includes('success')
                                    ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                                    : 'bg-red-500/20 border border-red-500/50 text-red-300'
                                    }`}
                            >
                                {message}
                            </div>
                        )}

                        {/* Submit Buttons */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : 'Confirm Booking'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971XXXXXXXXX';
                                    const message = encodeURIComponent(`Hi, I need help with my booking.\n\nName: ${formData.name}\nDate: ${formData.date.toDateString()}\nPackage: ${formData.package}\nGuests: ${formData.guests}`);
                                    window.open(`https://wa.me/${number}?text=${message}`, '_blank');
                                }}
                                className="flex-1 btn-secondary"
                            >
                                Need Help? WhatsApp Us
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}
