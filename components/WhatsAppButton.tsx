'use client';

import { useState, useEffect } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function WhatsAppButton() {
    const [isVisible, setIsVisible] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        // Show button after scrolling down
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Show tooltip on first load after 3 seconds
        const tooltipTimer = setTimeout(() => {
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 5000);
        }, 3000);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(tooltipTimer);
        };
    }, []);

    const handleWhatsAppClick = () => {
        const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971XXXXXXXXX';
        const message = encodeURIComponent(process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || 'Hi, I would like to inquire about the luxury dinner cruise booking.');
        window.open(`https://wa.me/${number}?text=${message}`, '_blank');
    };

    return (
        <>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="fixed bottom-6 right-6 z-50"
                    >
                        {/* Tooltip */}
                        <AnimatePresence>
                            {showTooltip && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="absolute bottom-full right-0 mb-4 bg-white text-navy-900 px-4 py-2 rounded-lg shadow-lg whitespace-nowrap"
                                >
                                    <div className="relative">
                                        Need help? Chat with us!
                                        <button
                                            onClick={() => setShowTooltip(false)}
                                            className="absolute -top-1 -right-1 bg-navy-900 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                                            aria-label="Close tooltip"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* WhatsApp Button */}
                        <motion.button
                            onClick={handleWhatsAppClick}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-green-500 hover:bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl transition-colors duration-300"
                            aria-label="Contact us on WhatsApp"
                        >
                            <FaWhatsapp className="text-3xl" />
                        </motion.button>

                        {/* Ripple Effect */}
                        <motion.div
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 0, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="absolute inset-0 bg-green-500 rounded-full -z-10"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
