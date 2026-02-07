'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye, FaToggleOn, FaToggleOff } from 'react-icons/fa';

export default function ManagePackagesPage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login');
        } else if (status === 'authenticated') {
            fetchPackages();
        }
    }, [status, router]);

    const fetchPackages = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/packages');
            const data = await res.json();
            if (data.success) {
                setPackages(data.packages);
            }
        } catch (error) {
            console.error('Error fetching packages:', error);
        } finally {
            setLoading(false);
        }
    };

    const deletePackage = async (id: string, publicIds: string[]) => {
        if (!confirm('Are you sure you want to delete this package?')) return;

        try {
            // Delete images from Cloudinary
            for (const publicId of publicIds) {
                await fetch('/api/upload', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ publicId }),
                });
            }

            // Delete package from database
            const res = await fetch(`/api/packages/${id}`, {
                method: 'DELETE',
            });

            const data = await res.json();
            if (data.success) {
                alert('Package deleted successfully');
                fetchPackages();
            }
        } catch (error) {
            alert('Failed to delete package');
        }
    };

    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/packages/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !currentStatus }),
            });

            const data = await res.json();
            if (data.success) {
                fetchPackages();
            }
        } catch (error) {
            alert('Failed to update package status');
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-navy-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
            </div>
        );
    }

    const filteredPackages = packages.filter(pkg => {
        const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || pkg.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="min-h-screen bg-navy-900 text-white">
            <header className="bg-gradient-to-r from-navy-800 to-navy-700 border-b border-ocean-500/30 shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-gold-500 to-ocean-500 bg-clip-text text-transparent">
                                Manage Packages
                            </h1>
                            <p className="text-gray-400 text-sm">View, edit, and manage all yacht packages</p>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/admin" className="btn-secondary text-sm px-4 py-2">
                                ← Dashboard
                            </Link>
                            <Link href="/admin/packages/create" className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
                                <FaPlus /> Create Package
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Filters */}
                <div className="card-luxury mb-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Search</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by package name..."
                                className="w-full bg-navy-700 border border-ocean-500/30 rounded-md px-4 py-2 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Filter by Type</label>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-full bg-navy-700 border border-ocean-500/30 rounded-md px-4 py-2 text-white"
                            >
                                <option value="all">All Types</option>
                                <option value="shared">Shared</option>
                                <option value="premium">Premium</option>
                                <option value="vip">VIP</option>
                                <option value="private">Private</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-navy-800 to-navy-700 border border-ocean-500/30 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Total Packages</p>
                        <p className="text-2xl font-bold text-white">{packages.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-navy-800 to-navy-700 border border-green-500/30 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Active</p>
                        <p className="text-2xl font-bold text-green-400">{packages.filter(p => p.active).length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-navy-800 to-navy-700 border border-gold-500/30 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Featured</p>
                        <p className="text-2xl font-bold text-gold-500">{packages.filter(p => p.featured).length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-navy-800 to-navy-700 border border-gray-500/30 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Inactive</p>
                        <p className="text-2xl font-bold text-gray-400">{packages.filter(p => !p.active).length}</p>
                    </div>
                </div>

                {/* Packages Grid */}
                {filteredPackages.length === 0 ? (
                    <div className="card-luxury text-center py-12">
                        <p className="text-gray-400 mb-4">No packages found</p>
                        <Link href="/admin/packages/create" className="btn-primary inline-flex items-center gap-2">
                            <FaPlus /> Create Your First Package
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPackages.map((pkg) => {
                            const allPublicIds = [
                                pkg.mainImage?.publicId,
                                ...(pkg.images || []).map((img: any) => img.publicId)
                            ].filter(Boolean);

                            return (
                                <div key={pkg._id} className="card-luxury group">
                                    {/* Image */}
                                    <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                                        {pkg.mainImage?.url ? (
                                            <img
                                                src={pkg.mainImage.url}
                                                alt={pkg.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-navy-700 flex items-center justify-center">
                                                <FaEye className="text-4xl text-gray-600" />
                                            </div>
                                        )}
                                        {pkg.featured && (
                                            <span className="absolute top-2 right-2 bg-gold-500 text-navy-900 px-2 py-1 rounded text-xs font-bold">
                                                Featured
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-gold-500 transition-colors">
                                                {pkg.name}
                                            </h3>
                                            <p className="text-sm text-gray-400 capitalize">{pkg.type}</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-2xl font-bold text-gold-500">AED {pkg.price}</p>
                                                <p className="text-xs text-gray-400">
                                                    {pkg.priceType === 'per_hour' && 'per hour'}
                                                    {pkg.priceType === 'per_person' && 'per person'}
                                                    {pkg.priceType === 'flat_rate' && 'flat rate'}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => toggleActive(pkg._id, pkg.active)}
                                                className={`text-3xl ${pkg.active ? 'text-green-500' : 'text-gray-500'} hover:scale-110 transition-transform`}
                                                title={pkg.active ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
                                            >
                                                {pkg.active ? <FaToggleOn /> : <FaToggleOff />}
                                            </button>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                                            <div>Images: {(pkg.images?.length || 0) + (pkg.mainImage ? 1 : 0)}</div>
                                            <div>Inclusions: {pkg.inclusions?.length || 0}</div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-3 border-t border-ocean-500/20">
                                            <Link
                                                href={`/packages/${pkg.slug}`}
                                                target="_blank"
                                                className="flex-1 bg-ocean-500/20 hover:bg-ocean-500/30 text-ocean-400 px-4 py-2 rounded-md transition-colors text-center flex items-center justify-center gap-2"
                                            >
                                                <FaEye /> View
                                            </Link>
                                            <Link
                                                href={`/admin/packages/edit/${pkg._id}`}
                                                className="flex-1 bg-gold-500/20 hover:bg-gold-500/30 text-gold-500 px-4 py-2 rounded-md transition-colors text-center flex items-center justify-center gap-2"
                                            >
                                                <FaEdit /> Edit
                                            </Link>
                                            <button
                                                onClick={() => deletePackage(pkg._id, allPublicIds)}
                                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-md transition-colors flex items-center justify-center"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
