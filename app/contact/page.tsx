"use client";
import React, { useState } from 'react';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', date: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);
        try {
            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setSuccess(true);
                setForm({ name: '', email: '', date: '', message: '' });
            } else {
                setError('Failed to send appointment.');
            }
        } catch (err) {
            setError('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-xl mx-auto py-16 px-4">
            <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
            <p className="mb-4 text-lg">Have questions or want to book your next adventure? Reach out to us!</p>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block mb-1 font-medium" htmlFor="contact-name">Name</label>
                    <input
                        id="contact-name"
                        name="name"
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        title="Please enter your name"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium" htmlFor="contact-email">Email</label>
                    <input
                        id="contact-email"
                        name="email"
                        type="email"
                        className="w-full border rounded px-3 py-2"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@email.com"
                        title="Please enter your email address"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium" htmlFor="contact-date">Preferred Date</label>
                    <input
                        id="contact-date"
                        name="date"
                        type="datetime-local"
                        className="w-full border rounded px-3 py-2"
                        required
                        value={form.date}
                        onChange={handleChange}
                        placeholder="Select date and time"
                        title="Please select your preferred date and time"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium" htmlFor="contact-message">Message</label>
                    <textarea
                        id="contact-message"
                        name="message"
                        className="w-full border rounded px-3 py-2"
                        rows={4}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Type your message here"
                        title="Please enter your message"
                    ></textarea>
                </div>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Appointment'}
                </button>
                {success && <p className="text-green-600 mt-2">Appointment sent successfully!</p>}
                {error && <p className="text-red-600 mt-2">{error}</p>}
            </form>
            <div className="mt-8 text-sm text-gray-600">
                Or email us directly at <a href="mailto:info@arbyacht.com" className="underline">info@arbyacht.com</a>
            </div>
        </main>
    );
}
