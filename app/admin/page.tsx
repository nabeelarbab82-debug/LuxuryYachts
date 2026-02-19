'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FaShip, FaCalendarCheck, FaDollarSign, FaUsers,
    FaPlus, FaEdit, FaTrash, FaClock, FaChartLine
} from 'react-icons/fa';

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [stats, setStats] = useState({
        totalPackages: 0,
        activePackages: 0,
        totalBookings: 0,
        pendingBookings: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
    });

    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [recentPackages, setRecentPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchDashboardData();
        }
    }, [status]);

    const fetchDashboardData = async () => {
        try {
            // Fetch packages
            const packagesRes = await fetch('/api/packages');
            const packagesData = await packagesRes.json();

            if (packagesData.success) {
                const packages = packagesData.packages;
                setRecentPackages(packages.slice(0, 5));
                setStats(prev => ({
                    ...prev,
                    totalPackages: packages.length,
                    activePackages: packages.filter((p: any) => p.active).length,
                }));
            }

            // Fetch bookings
            const bookingsRes = await fetch('/api/bookings');
            const bookingsData = await bookingsRes.json();

            if (bookingsData.success) {
                const bookings = bookingsData.bookings;
                setRecentBookings(bookings.slice(0, 5));

                const totalRevenue = bookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);
                const currentMonth = new Date().getMonth();
                const monthlyRevenue = bookings
                    .filter((b: any) => new Date(b.createdAt).getMonth() === currentMonth)
                    .reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);

                setStats(prev => ({
                    ...prev,
                    totalBookings: bookings.length,
                    pendingBookings: bookings.filter((b: any) => b.status === 'pending').length,
                    totalRevenue,
                    monthlyRevenue,
                }));
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-navy-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return null;
    }

    return (
        <div className="min-h-screen bg-navy-900 text-white">
            {/* Header */}
            <header className="bg-gradient-to-r from-navy-800 to-navy-700 border-b border-ocean-500/30 shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-gold-500 to-ocean-500 bg-clip-text text-transparent">
                                Admin Dashboard
                            </h1>
                            <p className="text-gray-400 text-sm">Welcome back, {session?.user?.name}</p>
                        </div>
                        <Link href="/" className="btn-secondary text-sm px-4 py-2">
                            View Website
                        </Link>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-navy-800 to-navy-700 border border-ocean-500/30 rounded-lg p-6 shadow-lg shadow-ocean-500/20 hover:shadow-ocean-500/40 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-gray-400 text-sm">Total Packages</p>
                                <p className="text-3xl font-bold text-white">{stats.totalPackages}</p>
                            </div>
                            <div className="w-12 h-12 bg-ocean-500/20 rounded-full flex items-center justify-center">
                                <FaShip className="text-ocean-500 text-xl" />
                            </div>
                        </div>
                        <p className="text-sm text-ocean-400">
                            {stats.activePackages} active packages
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-navy-800 to-navy-700 border border-gold-500/30 rounded-lg p-6 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-gray-400 text-sm">Total Bookings</p>
                                <p className="text-3xl font-bold text-white">{stats.totalBookings}</p>
                            </div>
                            <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center">
                                <FaCalendarCheck className="text-gold-500 text-xl" />
                            </div>
                        </div>
                        <p className="text-sm text-gold-400">
                            {stats.pendingBookings} pending bookings
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-navy-800 to-navy-700 border border-green-500/30 rounded-lg p-6 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-gray-400 text-sm">Total Revenue</p>
                                <p className="text-3xl font-bold text-white">AED {stats.totalRevenue.toFixed(0)}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                                <FaDollarSign className="text-green-500 text-xl" />
                            </div>
                        </div>
                        <p className="text-sm text-green-400">
                            All time revenue
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-navy-800 to-navy-700 border border-sunset-500/30 rounded-lg p-6 shadow-lg shadow-sunset-500/20 hover:shadow-sunset-500/40 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-gray-400 text-sm">Monthly Revenue</p>
                                <p className="text-3xl font-bold text-white">AED {stats.monthlyRevenue.toFixed(0)}</p>
                            </div>
                            <div className="w-12 h-12 bg-sunset-500/20 rounded-full flex items-center justify-center">
                                <FaChartLine className="text-sunset-500 text-xl" />
                            </div>
                        </div>
                        <p className="text-sm text-sunset-400">
                            This month
                        </p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 text-gold-500">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link
                            href="/admin/packages/create"
                            className="bg-gradient-to-br from-ocean-500 to-ocean-600 hover:from-ocean-600 hover:to-ocean-500 text-white p-6 rounded-lg shadow-lg shadow-ocean-500/30 hover:shadow-ocean-500/50 transition-all flex items-center gap-4 group"
                        >
                            <FaPlus className="text-3xl group-hover:scale-110 transition-transform" />
                            <div>
                                <p className="font-bold text-lg">Create Package</p>
                                <p className="text-sm text-ocean-100">Add new yacht package</p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/packages"
                            className="bg-gradient-to-br from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-500 text-navy-900 p-6 rounded-lg shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 transition-all flex items-center gap-4 group"
                        >
                            <FaEdit className="text-3xl group-hover:scale-110 transition-transform" />
                            <div>
                                <p className="font-bold text-lg">Manage Packages</p>
                                <p className="text-sm">Edit & update packages</p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/bookings"
                            className="bg-gradient-to-br from-sunset-500 to-sunset-600 hover:from-sunset-600 hover:to-sunset-500 text-white p-6 rounded-lg shadow-lg shadow-sunset-500/30 hover:shadow-sunset-500/50 transition-all flex items-center gap-4 group"
                        >
                            <FaCalendarCheck className="text-3xl group-hover:scale-110 transition-transform" />
                            <div>
                                <p className="font-bold text-lg">View Bookings</p>
                                <p className="text-sm text-sunset-100">Manage all bookings</p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/orders"
                            className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 text-white p-6 rounded-lg shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all flex items-center gap-4 group"
                        >
                            <FaDollarSign className="text-3xl group-hover:scale-110 transition-transform" />
                            <div>
                                <p className="font-bold text-lg">View Orders</p>
                                <p className="text-sm text-green-100">Manage payments & orders</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Recent Packages */}
                    <div className="bg-gradient-to-br from-navy-800 to-navy-700 border border-ocean-500/30 rounded-lg p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gold-500">Recent Packages</h2>
                            <Link href="/admin/packages" className="text-ocean-400 hover:text-ocean-500 text-sm">
                                View All →
                            </Link>
                        </div>

                        {recentPackages.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No packages yet</p>
                        ) : (
                            <div className="space-y-4">
                                {recentPackages.map((pkg: any) => (
                                    <div
                                        key={pkg._id}
                                        className="bg-navy-900/50 border border-ocean-500/20 rounded-lg p-4 hover:border-ocean-500/40 transition-all"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-white">{pkg.name}</h3>
                                                <p className="text-sm text-gray-400 capitalize">{pkg.type}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gold-500 font-bold">AED {pkg.price}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${pkg.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                                    }`}>
                                                    {pkg.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Bookings */}
                    <div className="bg-gradient-to-br from-navy-800 to-navy-700 border border-ocean-500/30 rounded-lg p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gold-500">Recent Bookings</h2>
                            <Link href="/admin/bookings" className="text-ocean-400 hover:text-ocean-500 text-sm">
                                View All →
                            </Link>
                        </div>

                        {recentBookings.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No bookings yet</p>
                        ) : (
                            <div className="space-y-4">
                                {recentBookings.map((booking: any) => (
                                    <div
                                        key={booking._id}
                                        className="bg-navy-900/50 border border-ocean-500/20 rounded-lg p-4 hover:border-ocean-500/40 transition-all"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-white">{booking.name}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                                                    booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400">{booking.packageName}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-xs text-gray-500">
                                                {booking.date ? new Date(booking.date).toLocaleDateString() : 'No date'}
                                            </p>
                                            <p className="text-gold-500 font-semibold">AED {booking.totalAmount?.toFixed(2) || '0.00'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}