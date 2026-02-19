'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendar, FaUsers, FaUserAlt, FaEnvelope, FaPhone, FaArrowLeft } from 'react-icons/fa';
import StripeCheckout from './StripeCheckout';

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
    const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
    const [paymentData, setPaymentData] = useState<{
        clientSecret: string;
        orderId: string;
        orderNumber: string;
        totalAmount: number;
        subtotal: number;
        vat: number;
    } | null>(null);

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
            // Create payment intent
            const response = await fetch('/api/payment/create-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingData: formData }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setPaymentData({
                    clientSecret: data.clientSecret,
                    orderId: data.orderId,
                    orderNumber: data.orderNumber,
                    totalAmount: data.totalAmount,
                    subtotal: data.subtotal,
                    vat: data.vat,
                });
                setStep('payment');
            } else {
                setMessage(data.error || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            setMessage('Failed to submit booking. Please try again or contact us on WhatsApp.');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = () => {
        setStep('success');
        setMessage('');
    };

    const handlePaymentError = (error: string) => {
        setMessage(error);
    };

    const handleBackToForm = () => {
        setStep('form');
        setPaymentData(null);
        setMessage('');
    };

    const handleNewBooking = () => {
        setStep('form');
        setPaymentData(null);
        setMessage('');
        setFormData({
            name: '',
            email: '',
            phone: '',
            date: new Date(),
            package: 'shared',
            guests: 2,
            specialRequests: '',
        });
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
                        {step === 'success' ? (
                            <>Payment <span className="text-gold-500">Successful!</span></>
                        ) : step === 'payment' ? (
                            <>Complete Your <span className="text-gold-500">Payment</span></>
                        ) : (
                            <>Complete Your <span className="text-gold-500">Booking</span></>
                        )}
                    </h2>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        {step === 'success'
                            ? 'Your booking has been confirmed. Check your email for details.'
                            : step === 'payment'
                            ? 'Secure payment powered by Stripe'
                            : 'Fill in your details and we\'ll confirm your reservation'}
                    </p>
                </motion.div>

                {/* Success Message */}
                {step === 'success' && paymentData && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="card-luxury text-center">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Booking Confirmed!</h3>
                            <p className="text-gray-300 mb-6">
                                Your payment has been processed successfully.
                            </p>
                            <div className="bg-navy-700 rounded-lg p-6 mb-6">
                                <div className="space-y-3 text-left">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Order Number:</span>
                                        <span className="text-gold-500 font-semibold font-mono">{paymentData.orderNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Name:</span>
                                        <span className="text-white">{formData.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Email:</span>
                                        <span className="text-white">{formData.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Package:</span>
                                        <span className="text-white capitalize">{formData.package}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Guests:</span>
                                        <span className="text-white">{formData.guests}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Date:</span>
                                        <span className="text-white">{formData.date.toLocaleDateString()}</span>
                                    </div>
                                    <div className="border-t border-gold-500/20 pt-3 mt-3">
                                        <div className="flex justify-between text-lg">
                                            <span className="text-gray-300">Total Paid:</span>
                                            <span className="text-gold-500 font-bold">AED {paymentData.totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                A confirmation email has been sent to {formData.email}
                            </p>
                            <button onClick={handleNewBooking} className="btn-primary">
                                Make Another Booking
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Payment Step */}
                {step === 'payment' && paymentData && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="mb-6">
                            <button
                                onClick={handleBackToForm}
                                className="text-gold-500 hover:text-gold-400 flex items-center gap-2"
                            >
                                <FaArrowLeft />
                                Back to Booking Details
                            </button>
                        </div>
                        
                        <div className="card-luxury">
                            <StripeCheckout
                                clientSecret={paymentData.clientSecret}
                                orderId={paymentData.orderId}
                                orderNumber={paymentData.orderNumber}
                                totalAmount={paymentData.totalAmount}
                                onSuccess={handlePaymentSuccess}
                                onError={handlePaymentError}
                            />
                            
                            {message && (
                                <div className="mt-6 p-4 rounded-md bg-red-500/20 border border-red-500/50 text-red-300">
                                    {message}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Booking Form */}
                {step === 'form' && (
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
                                    aria-label="Select package"
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
                                    aria-label="Number of guests"
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
                                {loading ? 'Processing...' : 'Proceed to Payment'}
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
                )}
            </div>
        </section>
    );
}
