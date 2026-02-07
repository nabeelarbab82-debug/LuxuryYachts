'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: 'Is this cruise suitable for families?',
            answer: 'Yes! Our cruise is perfect for families with children of all ages. We provide a safe, comfortable environment with activities and entertainment suitable for everyone.',
        },
        {
            question: 'Are drinks included in the package?',
            answer: 'Soft drinks are included in the Shared Dinner package. Premium packages include welcome drinks and select beverages. Alcoholic drinks can be purchased separately onboard.',
        },
        {
            question: 'Can we book the entire yacht for a private event?',
            answer: 'Absolutely! We offer full yacht buyout options for up to 135 guests, perfect for corporate events, weddings, anniversaries, and other special celebrations. Contact us for custom packages.',
        },
        {
            question: 'What is the cancellation policy?',
            answer: 'Cancellations made 48 hours or more before the cruise receive a full refund. Cancellations within 24-48 hours receive 50% refund. No refund for cancellations less than 24 hours before departure.',
        },
        {
            question: 'Is live entertainment included in all packages?',
            answer: 'Yes, live entertainment and music are included in all our packages. We feature talented performers to enhance your dining experience.',
        },
        {
            question: 'What should I wear?',
            answer: 'We recommend smart casual attire. Comfortable clothing is fine, but please avoid beachwear, flip-flops, or overly casual clothing. The evening can be breezy, so bringing a light jacket is advisable.',
        },
        {
            question: 'Is parking available at the marina?',
            answer: 'Yes, Dubai Marina has ample parking facilities available. We recommend arriving 30 minutes before boarding time to find parking and check in comfortably.',
        },
        {
            question: 'Can dietary requirements be accommodated?',
            answer: 'Yes, we can accommodate most dietary requirements including vegetarian, vegan, halal, and allergies. Please inform us of any special requirements when booking.',
        },
    ];

    return (
        <section className="section-padding bg-navy-800">
            <div className="container-custom">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                        Frequently Asked <span className="text-gold-500">Questions</span>
                    </h2>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Everything you need to know about your cruise experience
                    </p>
                </motion.div>

                {/* FAQ Accordion */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="card-luxury"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between text-left"
                            >
                                <h3 className="text-lg font-semibold text-white pr-4">
                                    {faq.question}
                                </h3>
                                <FaChevronDown
                                    className={`text-gold-500 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'transform rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {openIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-4 pt-4 border-t border-gold-500/20"
                                >
                                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <p className="text-gray-300 mb-4">
                        Still have questions? We're here to help!
                    </p>
                    <button
                        onClick={() => {
                            const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971XXXXXXXXX';
                            const message = encodeURIComponent('Hi, I have a question about the dinner cruise.');
                            window.open(`https://wa.me/${number}?text=${message}`, '_blank');
                        }}
                        className="btn-primary"
                    >
                        Contact Us on WhatsApp
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
