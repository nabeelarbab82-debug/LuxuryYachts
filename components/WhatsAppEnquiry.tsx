'use client';

import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppEnquiry() {
    const handleWhatsApp = () => {
        const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971XXXXXXXXX';
        const message = encodeURIComponent('Hi, I have a special request for the dinner cruise.');
        window.open(`https://wa.me/${number}?text=${message}`, '_blank');
    };

    return (
        <section className="section-padding bg-gradient-to-br from-navy-800 via-navy-900 to-navy-800">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="card-luxury text-center max-w-3xl mx-auto"
                >
                    <div className="text-6xl text-green-500 mb-6 flex justify-center">
                        <FaWhatsapp />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                        Have a Question or <span className="text-gold-500">Special Request?</span>
                    </h2>

                    <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                        Chat with our team on WhatsApp for instant assistance. Whether you need help with
                        booking, have special requirements, or want to customize your experience, we're
                        here to help!
                    </p>

                    <button
                        onClick={handleWhatsApp}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-10 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto text-lg"
                    >
                        <FaWhatsapp className="text-2xl" />
                        Chat on WhatsApp
                    </button>

                    <p className="text-gray-400 text-sm mt-6">
                        Available 24/7 • Quick Response • Personalized Service
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
