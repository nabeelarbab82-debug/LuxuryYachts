'use client';

import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-navy-900 border-t border-gold-500/20 py-12">
            <div className="container-custom px-4 md:px-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-bold text-gold-500 mb-4">
                            Luxury Dinner Cruise
                        </h3>
                        <p className="text-gray-400 mb-4">
                            Experience the finest dinner cruise in Dubai Marina aboard our 135-seat luxury yacht.
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-4">Contact Us</h4>
                        <div className="space-y-3 text-gray-400">
                            <a href="tel:+971XXXXXXXXX" className="flex items-center gap-2 hover:text-gold-500 transition-colors">
                                <FaPhone className="text-gold-500" />
                                +971 XX XXX XXXX
                            </a>
                            <a href="mailto:info@luxurycruise.ae" className="flex items-center gap-2 hover:text-gold-500 transition-colors">
                                <FaEnvelope className="text-gold-500" />
                                info@luxurycruise.ae
                            </a>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971XXXXXXXXX';
                                    window.open(`https://wa.me/${number}`, '_blank');
                                }}
                                className="flex items-center gap-2 hover:text-gold-500 transition-colors"
                            >
                                <FaWhatsapp className="text-gold-500" />
                                WhatsApp Support
                            </a>
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-4">Location</h4>
                        <div className="text-gray-400">
                            <div className="flex items-start gap-2">
                                <FaMapMarkerAlt className="text-gold-500 mt-1" />
                                <div>
                                    <p>Dubai Marina Yacht Club</p>
                                    <p>Dubai Marina</p>
                                    <p>Dubai, UAE</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
                        <div className="space-y-2 text-gray-400">
                            <a href="#" className="block hover:text-gold-500 transition-colors">
                                About Us
                            </a>
                            <a href="#" className="block hover:text-gold-500 transition-colors">
                                Packages
                            </a>
                            <a href="#" className="block hover:text-gold-500 transition-colors">
                                Gallery
                            </a>
                            <a href="#" className="block hover:text-gold-500 transition-colors">
                                FAQ
                            </a>
                            <a href="#" className="block hover:text-gold-500 transition-colors">
                                Terms & Conditions
                            </a>
                            <a href="#" className="block hover:text-gold-500 transition-colors">
                                Privacy Policy
                            </a>
                        </div>
                    </div>
                </div>

                {/* Social Media & Copyright */}
                <div className="border-t border-gold-500/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        © 2026 Luxury Dinner Cruise Dubai. All rights reserved.
                    </p>

                    <div className="flex gap-4">
                        <a
                            href="#"
                            className="text-gray-400 hover:text-gold-500 transition-colors text-2xl"
                        >
                            <FaFacebook />
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-gold-500 transition-colors text-2xl"
                        >
                            <FaInstagram />
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-gold-500 transition-colors text-2xl"
                        >
                            <FaTwitter />
                        </a>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971XXXXXXXXX';
                                window.open(`https://wa.me/${number}`, '_blank');
                            }}
                            className="text-gray-400 hover:text-gold-500 transition-colors text-2xl"
                        >
                            <FaWhatsapp />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
