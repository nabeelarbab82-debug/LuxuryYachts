'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes, FaPhone, FaWhatsapp } from 'react-icons/fa';
import Image from 'next/image';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Packages', href: '/packages' },
        { name: 'About', href: '#about' },
        { name: 'Gallery', href: '#gallery' },
        { name: 'Contact', href: '#contact' },
    ];

    const openWhatsApp = () => {
        const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971XXXXXXXXX';
        const message = encodeURIComponent('Hi, I would like to inquire about yacht bookings.');
        window.open(`https://wa.me/${number}?text=${message}`, '_blank');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-navy-900/95 via-navy-800/95 to-navy-900/95 backdrop-blur-md border-b border-ocean-500/30 shadow-lg shadow-ocean-500/10">
            <nav className="container-custom px-4 md:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-12 h-12 bg-gradient-to-br from-gold-500 via-gold-400 to-ocean-500 rounded-full flex items-center justify-center shadow-lg shadow-gold-500/50 group-hover:shadow-gold-500/70 transition-all duration-300 group-hover:scale-110">
                            <span className="text-navy-900 font-bold text-2xl">Y</span>
                        </div>
                        <div>
                            <div className="text-xl font-bold bg-gradient-to-r from-gold-500 to-ocean-500 bg-clip-text text-transparent group-hover:from-ocean-500 group-hover:to-gold-500 transition-all duration-300">
                                Luxury Yachts
                            </div>
                            <div className="text-xs text-ocean-400">Dubai Marina</div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-gray-300 hover:text-ocean-400 transition-all duration-300 font-medium relative group"
                            >
                                <span className="relative z-10">{item.name}</span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-500 to-ocean-500 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden lg:flex items-center gap-4">
                        <a
                            href="tel:+971XXXXXXXXX"
                            className="flex items-center gap-2 text-gray-300 hover:text-ocean-400 transition-colors"
                        >
                            <FaPhone className="text-gold-500" />
                            <span>+971 XX XXX XXXX</span>
                        </a>
                        <button
                            onClick={openWhatsApp}
                            className="btn-primary flex items-center gap-2 shadow-lg shadow-ocean-500/30 hover:shadow-ocean-500/50"
                        >
                            <FaWhatsapp />
                            WhatsApp
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden text-ocean-500 hover:text-gold-500 text-2xl transition-colors"
                    >
                        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden py-4 border-t border-gold-500/20">
                        <div className="flex flex-col gap-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-gray-300 hover:text-gold-500 transition-colors font-medium py-2"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <button
                                onClick={() => {
                                    openWhatsApp();
                                    setMobileMenuOpen(false);
                                }}
                                className="btn-primary flex items-center justify-center gap-2 mt-4"
                            >
                                <FaWhatsapp />
                                Contact on WhatsApp
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
