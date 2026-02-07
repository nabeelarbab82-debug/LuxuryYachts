'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaCalendar, FaUser, FaPhone, FaEnvelope, FaShip, FaUsers, FaDollarSign } from 'react-icons/fa';

export default function ManageBookingsPage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login');
        } else if (status === 'authenticated') {
            fetchBookings();
        }
    }, [status, router]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/bookings');
            const data = await res.json();
            if (data.success) {
                setBookings(data.bookings);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateBookingStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            const data = await res.json();
            if (data.success) {
                fetchBookings();
            }
        } catch (error) {
            alert('Failed to update booking status');
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-navy-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
            </div>
        );
    }

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.bookingNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
        totalRevenue: bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
    };

    return (
        <div className="min-h-screen bg-navy-900 text-white">
            <header className="bg-gradient-to-r from-navy-800 to-navy-700 border-b border-ocean-500/30 shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-gold-500 to-ocean-500 bg-clip-text text-transparent">
                                Manage Bookings
                            </h1>
                            <p className="text-gray-400 text-sm">View and manage all yacht bookings</p>
                        </div>
                        <Link href="/admin" className="btn-secondary text-sm px-4 py-2">
                            ← Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-navy-800 to-navy-700 border border-ocean-500/30 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Total</p>
                        <p className="text-2xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="bg-gradient-to-br from-navy-800 to-navy-700 border border-yellow-500/30 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Pending</p>
                        <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                    </div>
                    <div className="bg-gradient-to-br from-navy-800 to-navy-700 border border-green-500/30 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Confirmed</p>
                        <p className="text-2xl font-bold text-green-400">{stats.confirmed}</p>
                    </div>
                    <div className="bg-gradient-to-br from-navy-800 to-navy-700 border border-blue-500/30 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Completed</p>
                        <p className="text-2xl font-bold text-blue-400">{stats.completed}</p>
                    </div>
                    <div className="bg-gradient-to-br from-navy-800 to-navy-700 border border-red-500/30 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Cancelled</p>
                        <p className="text-2xl font-bold text-red-400">{stats.cancelled}</p>
                    </div>
                    <div className="bg-gradient-to-br from-navy-800 to-navy-700 border border-gold-500/30 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Revenue</p>
                        <p className="text-xl font-bold text-gold-500">AED {stats.totalRevenue.toFixed(0)}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="card-luxury mb-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Search</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, email, or booking number..."
                                className="w-full bg-navy-700 border border-ocean-500/30 rounded-md px-4 py-2 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Filter by Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full bg-navy-700 border border-ocean-500/30 rounded-md px-4 py-2 text-white"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Bookings List */}
                {filteredBookings.length === 0 ? (
                    <div className="card-luxury text-center py-12">
                        <p className="text-gray-400">No bookings found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => (
                            <div key={booking._id} className="card-luxury hover:border-ocean-500/60 transition-all">
                                <div className="grid lg:grid-cols-12 gap-4">
                                    {/* Left: Booking Info */}
                                    <div className="lg:col-span-5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold text-white">{booking.name}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                                                        booking.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                                                            'bg-red-500/20 text-red-400'
                                                }`}>
                                                {booking.status?.toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-sm text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <FaEnvelope className="text-ocean-500" />
                                                <span>{booking.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaPhone className="text-ocean-500" />
                                                <span>{booking.phone || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaShip className="text-gold-500" />
                                                <span className="font-medium">{booking.packageName || 'N/A'}</span>
                                            </div>
                                        </div>

                                        {booking.bookingNumber && (
                                            <div className="bg-navy-700 px-3 py-2 rounded text-xs">
                                                Booking #: <span className="text-gold-500 font-mono">{booking.bookingNumber}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Middle: Booking Details */}
                                    <div className="lg:col-span-4 space-y-2 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Date:</span>
                                            <span className="text-white font-medium">
                                                {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                        {booking.startTime && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">Start Time:</span>
                                                <span className="text-white font-medium">{booking.startTime}</span>
                                            </div>
                                        )}
                                        {booking.bookingHours && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">Hours:</span>
                                                <span className="text-white font-medium">{booking.bookingHours}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400"><FaUsers className="inline mr-1" />Guests:</span>
                                            <span className="text-white font-medium">
                                                {(booking.adults || 0) + (booking.children || 0) + (booking.infants || 0)}
                                                {booking.adults > 0 && ` (${booking.adults}A)`}
                                                {booking.children > 0 && ` (${booking.children}C)`}
                                                {booking.infants > 0 && ` (${booking.infants}I)`}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t border-ocean-500/20">
                                            <span className="text-gray-400">Created:</span>
                                            <span className="text-xs text-gray-500">
                                                {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right: Pricing & Actions */}
                                    <div className="lg:col-span-3 space-y-3">
                                        <div className="bg-navy-700 rounded-lg p-3 space-y-2">
                                            {booking.subtotal && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Subtotal:</span>
                                                    <span className="text-white">AED {booking.subtotal.toFixed(2)}</span>
                                                </div>
                                            )}
                                            {booking.vat && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">VAT:</span>
                                                    <span className="text-white">AED {booking.vat.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-lg font-bold border-t border-ocean-500/20 pt-2">
                                                <span className="text-gray-300">Total:</span>
                                                <span className="text-gold-500">AED {booking.totalAmount?.toFixed(2) || '0.00'}</span>
                                            </div>
                                        </div>

                                        {/* Status Update Buttons */}
                                        <div className="space-y-2">
                                            {booking.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                                                        className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-2 rounded-md text-sm transition-colors"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                                                        className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded-md text-sm transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
                                            {booking.status === 'confirmed' && (
                                                <button
                                                    onClick={() => updateBookingStatus(booking._id, 'completed')}
                                                    className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-2 rounded-md text-sm transition-colors"
                                                >
                                                    Mark Completed
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
