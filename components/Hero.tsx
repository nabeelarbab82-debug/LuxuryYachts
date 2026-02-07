'use client';

import { FaClock, FaUtensils, FaMusic, FaMapMarkerAlt } from 'react-icons/fa';
import BookingCard from './BookingCard';
import { motion } from 'framer-motion';

export default function Hero() {
    const highlights = [
        { icon: <FaClock />, text: '2.5-3 hour cruise' },
        { icon: <FaUtensils />, text: 'Buffet & premium dining' },
        { icon: <FaMusic />, text: 'Live music & entertainment' },
        { icon: <FaMapMarkerAlt />, text: 'Dubai Marina departure' },
    ];

    const scrollToBooking = () => {
        document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const openWhatsApp = () => {
        const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971XXXXXXXXX';
        const message = encodeURIComponent(process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || 'Hi, I would like to inquire about the luxury dinner cruise booking.');
        window.open(`https://wa.me/${number}?text=${message}`, '_blank');
    };

    return (
        <section className="relative min-h-screen flex items-center">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <div className="relative w-full h-full overflow-hidden">
                    {/* Video Element */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src="/videos/hero-yacht.mp4" type="video/mp4" />
                        {/* Fallback for browsers that don't support video */}
                    </video>

                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-800/70 to-navy-900/40 z-10"></div>

                    {/* Fallback Image if video doesn't load */}
                    <img
                        src="/hero-yacht.jpg"
                        alt="Luxury Yacht"
                        className="absolute inset-0 w-full h-full object-cover -z-10"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.style.background = 'linear-gradient(135deg, #0a1628 0%, #1a2942 100%)';
                        }}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="container-custom relative z-20 px-4 md:px-8 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Headline + Highlights */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-white"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                            Luxury Dinner Cruise on a{' '}
                            <span className="text-gold-500">135-Seat Yacht</span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
                            An unforgettable evening with dining, live entertainment, and Dubai skyline views.
                        </p>

                        {/* Highlights */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            {highlights.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    className="flex items-center gap-3 text-white"
                                >
                                    <div className="text-2xl text-gold-500">{item.icon}</div>
                                    <span className="text-base">{item.text}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={scrollToBooking} className="btn-primary">
                                Book Now
                            </button>
                            <button onClick={openWhatsApp} className="btn-secondary">
                                WhatsApp Enquiry
                            </button>
                        </div>
                    </motion.div>

                    {/* Right: Booking Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <BookingCard />
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-gold-500 text-3xl"
                >
                    ↓
                </motion.div>
            </div>
        </section>
    );
}
