'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaUpload, FaTrash, FaImage, FaPlus, FaTimes } from 'react-icons/fa';
import Image from 'next/image';

export default function CreatePackagePage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        type: 'shared',
        price: '',
        priceType: 'per_person',
        minimumBookingHours: 2,
        shortDescription: '',
        description: '',
        inclusions: [''],
        active: true,
        featured: false,

        // Yacht Details
        yachtCapacity: '',
        yachtLength: '',
        yachtBrand: '',
        yachtYear: '',
        amenities: [''],
        yachtDescription: '',

        // Pricing
        adultPrice: '',
        childPrice: '',
        infantPrice: '',
        vatPercentage: 5,

        // Availability
        availability: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true,
        },

        // Pickup Points
        pickupPoints: [{ name: '', address: '' }],
        meetingPoints: [{ name: '', address: '', instructions: '' }],
    });

    const [mainImage, setMainImage] = useState<{ url: string; publicId: string } | null>(null);
    const [galleryImages, setGalleryImages] = useState<Array<{ url: string; publicId: string; caption: string }>>([]);

    if (status === 'loading') {
        return <div className="min-h-screen bg-navy-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
        </div>;
    }

    if (status === 'unauthenticated') {
        router.push('/admin/login');
        return null;
    }

    const uploadToCloudinary = async (file: File): Promise<{ url: string; publicId: string }> => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        if (data.success) {
            return { url: data.url, publicId: data.publicId };
        }
        throw new Error('Upload failed');
    };

    const deleteFromCloudinary = async (publicId: string) => {
        await fetch('/api/upload', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicId }),
        });
    };

    const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            // Delete old image if exists
            if (mainImage?.publicId) {
                await deleteFromCloudinary(mainImage.publicId);
            }

            const result = await uploadToCloudinary(file);
            setMainImage(result);
        } catch (error) {
            alert('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setUploadingImage(true);
        try {
            const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
            const results = await Promise.all(uploadPromises);

            const newImages = results.map(result => ({
                ...result,
                caption: '',
            }));

            setGalleryImages([...galleryImages, ...newImages]);
        } catch (error) {
            alert('Failed to upload images');
        } finally {
            setUploadingImage(false);
        }
    };

    const removeGalleryImage = async (index: number) => {
        const image = galleryImages[index];
        if (image.publicId) {
            await deleteFromCloudinary(image.publicId);
        }
        setGalleryImages(galleryImages.filter((_, i) => i !== index));
    };

    const updateGalleryCaption = (index: number, caption: string) => {
        const updated = [...galleryImages];
        updated[index].caption = caption;
        setGalleryImages(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare package data
            const packageData = {
                name: formData.name,
                type: formData.type,
                price: parseFloat(formData.price),
                priceType: formData.priceType,
                minimumBookingHours: parseInt(formData.minimumBookingHours.toString()),
                shortDescription: formData.shortDescription,
                description: formData.description,
                inclusions: formData.inclusions.filter(i => i.trim() !== ''),
                active: formData.active,
                featured: formData.featured,

                mainImage: mainImage,
                images: galleryImages,

                yachtDetails: {
                    capacity: formData.yachtCapacity ? parseInt(formData.yachtCapacity) : undefined,
                    length: formData.yachtLength || undefined,
                    brand: formData.yachtBrand || undefined,
                    year: formData.yachtYear ? parseInt(formData.yachtYear) : undefined,
                    amenities: formData.amenities.filter(a => a.trim() !== ''),
                    description: formData.yachtDescription || undefined,
                },

                pricing: {
                    adultPrice: formData.adultPrice ? parseFloat(formData.adultPrice) : undefined,
                    childPrice: formData.childPrice ? parseFloat(formData.childPrice) : undefined,
                    infantPrice: formData.infantPrice ? parseFloat(formData.infantPrice) : undefined,
                    vatPercentage: parseFloat(formData.vatPercentage.toString()),
                },

                availability: formData.availability,

                pickupPoints: formData.pickupPoints.filter(p => p.name && p.address),
                meetingPoints: formData.meetingPoints.filter(p => p.name && p.address),
            };

            const res = await fetch('/api/packages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(packageData),
            });

            const data = await res.json();

            if (data.success) {
                alert('Package created successfully!');
                router.push('/admin/packages');
            } else {
                alert(data.error || 'Failed to create package');
            }
        } catch (error) {
            alert('Failed to create package');
        } finally {
            setLoading(false);
        }
    };

    const addInclusion = () => setFormData({ ...formData, inclusions: [...formData.inclusions, ''] });
    const removeInclusion = (index: number) => {
        setFormData({ ...formData, inclusions: formData.inclusions.filter((_, i) => i !== index) });
    };
    const updateInclusion = (index: number, value: string) => {
        const updated = [...formData.inclusions];
        updated[index] = value;
        setFormData({ ...formData, inclusions: updated });
    };

    const addAmenity = () => setFormData({ ...formData, amenities: [...formData.amenities, ''] });
    const removeAmenity = (index: number) => {
        setFormData({ ...formData, amenities: formData.amenities.filter((_, i) => i !== index) });
    };
    const updateAmenity = (index: number, value: string) => {
        const updated = [...formData.amenities];
        updated[index] = value;
        setFormData({ ...formData, amenities: updated });
    };

    return (
        <div className="min-h-screen bg-navy-900 text-white">
            <header className="bg-gradient-to-r from-navy-800 to-navy-700 border-b border-ocean-500/30 shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gold-500 to-ocean-500 bg-clip-text text-transparent">
                        Create New Package
                    </h1>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="card-luxury">
                        <h2 className="text-xl font-bold text-gold-500 mb-4">Basic Information</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Package Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-navy-700 border border-ocean-500/30 rounded-md px-4 py-3 text-white"
                                    placeholder="e.g., Sunset Luxury Cruise"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Type *</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full bg-navy-700 border border-ocean-500/30 rounded-md px-4 py-3 text-white"
                                >
                                    <option value="shared">Shared</option>
                                    <option value="premium">Premium</option>
                                    <option value="vip">VIP</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Price (AED) *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full bg-navy-700 border border-ocean-500/30 rounded-md px-4 py-3 text-white"
                                    placeholder="690"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Price Type *</label>
                                <select
                                    value={formData.priceType}
                                    onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                                    className="w-full bg-navy-700 border border-ocean-500/30 rounded-md px-4 py-3 text-white"
                                >
                                    <option value="per_person">Per Person</option>
                                    <option value="per_hour">Per Hour</option>
                                    <option value="flat_rate">Flat Rate</option>
                                </select>
                            </div>

                            {formData.priceType === 'per_hour' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Minimum Booking Hours</label>
                                    <input
                                        type="number"
                                        value={formData.minimumBookingHours}
                                        onChange={(e) => setFormData({ ...formData, minimumBookingHours: parseInt(e.target.value) })}
                                        className="w-full bg-navy-700 border border-ocean-500/30 rounded-md px-4 py-3 text-white"
                                    />
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.active}
                                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                        className="w-5 h-5"
                                    />
                                    <span>Active</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        className="w-5 h-5"
                                    />
                                    <span>Featured</span>
                                </label>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-2">Short Description</label>
                            <input
                                type="text"
                                value={formData.shortDescription}
                                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                className="w-full bg-navy-700 border border-ocean-500/30 rounded-md px-4 py-3 text-white"
                                placeholder="Brief description for card preview"
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-2">Full Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={5}
                                className="w-full bg-navy-700 border border-ocean-500/30 rounded-md px-4 py-3 text-white"
                                placeholder="Detailed package description"
                            />
                        </div>
                    </div>

                    {/* Images */}
                    <div className="card-luxury">
                        <h2 className="text-xl font-bold text-gold-500 mb-4">Images</h2>

                        {/* Main Image */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Main Image</label>
                            {mainImage ? (
                                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                                    <img src={mainImage.url} alt="Main" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            deleteFromCloudinary(mainImage.publicId);
                                            setMainImage(null);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ) : (
                                <label className="block w-full h-64 border-2 border-dashed border-ocean-500/50 rounded-lg hover:border-ocean-500 cursor-pointer transition-colors">
                                    <div className="h-full flex flex-col items-center justify-center">
                                        <FaUpload className="text-4xl text-ocean-500 mb-2" />
                                        <span className="text-gray-400">Click to upload main image</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleMainImageUpload}
                                        className="hidden"
                                        disabled={uploadingImage}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Gallery Images */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Gallery Images</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                {galleryImages.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img src={image.url} alt={`Gallery ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FaTrash className="text-sm" />
                                        </button>
                                        <input
                                            type="text"
                                            placeholder="Caption (optional)"
                                            value={image.caption}
                                            onChange={(e) => updateGalleryCaption(index, e.target.value)}
                                            className="w-full mt-1 bg-navy-700 border border-ocean-500/30 rounded px-2 py-1 text-sm"
                                        />
                                    </div>
                                ))}
                            </div>

                            <label className="block w-full border-2 border-dashed border-ocean-500/50 rounded-lg p-4 hover:border-ocean-500 cursor-pointer transition-colors text-center">
                                <FaImage className="inline text-2xl text-ocean-500 mb-1" />
                                <span className="block text-gray-400 text-sm">Click to add gallery images</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleGalleryUpload}
                                    className="hidden"
                                    disabled={uploadingImage}
                                />
                            </label>
                        </div>

                        {uploadingImage && (
                            <div className="mt-4 text-center text-ocean-500">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-500 mx-auto mb-2"></div>
                                Uploading to Cloudinary...
                            </div>
                        )}
                    </div>

                    {/* Inclusions */}
                    <div className="card-luxury">
                        <h2 className="text-xl font-bold text-gold-500 mb-4">What's Included</h2>
                        {formData.inclusions.map((inclusion, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={inclusion}
                                    onChange={(e) => updateInclusion(index, e.target.value)}
                                    className="flex-1 bg-navy-700 border border-ocean-500/30 rounded-md px-4 py-2 text-white"
                                    placeholder="e.g., Welcome drinks and refreshments"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeInclusion(index)}
                                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addInclusion}
                            className="btn-secondary mt-2 flex items-center gap-2"
                        >
                            <FaPlus /> Add Inclusion
                        </button>
                    </div>

                    {/* Yacht Details */}
                    <div className="card-luxury">
                        <h2 className="text-xl font-bold text-gold-500 mb-4">Yacht Details</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Capacity (guests)</label>
                                <input
                                    type="number"
                                    value={formData.yachtCapacity}
                                    onChange={(e) => setFormData({ ...formData, yachtCapacity: e.target.value })}
                                    className="w-full bg-navy-700 border border-ocean-500/30 rounded-md px-4 py-3 text-white"
                                    placeholder="20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Length</label>
                                <input
                                    type="text"
                                    value={formData.yachtLength}
                                    onChange={(e) => setFormData({ ...formData, yachtLength: e.target.value })}
                                    className="w-full bg-navy-700 border border-ocean-500/30 rounded-md px-4 py-3 text-white"
                                    placeholder="75 feet"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Brand</label>
                                <input
                                    type="text"
                                    value={formData.yachtBrand}
                                    onChange={(e) => setFormData({ ...formData, yachtBrand: e.target.value })}
                                    className="w-full bg-navy-700 border border-ocean-500/30 rounded-md px-4 py-3 text-white"
                                    placeholder="Sunseeker"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Year</label>
                                <input
                                    type="number"
                                    value={formData.yachtYear}
                                    onChange={(e) => setFormData({ ...formData, yachtYear: e.target.value })}
                                    className="w-full bg-navy-700 border border-ocean-500/30 rounded-md px-4 py-3 text-white"
                                    placeholder="2022"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-2">Amenities</label>
                            {formData.amenities.map((amenity, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={amenity}
                                        onChange={(e) => updateAmenity(index, e.target.value)}
                                        className="flex-1 bg-navy-700 border border-ocean-500/30 rounded-md px-4 py-2 text-white"
                                        placeholder="e.g., Air Conditioning"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeAmenity(index)}
                                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addAmenity}
                                className="btn-secondary mt-2 flex items-center gap-2"
                            >
                                <FaPlus /> Add Amenity
                            </button>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="card-luxury">
                        <h2 className="text-xl font-bold text-gold-500 mb-4">Detailed Pricing</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Adult Price (AED)</label>
                                <input
                                    type="number"
                                    value={formData.adultPrice}
                                    onChange={(e) => setFormData({ ...formData, adultPrice: e.target.value })}
                                    className="w-full bg-navy-700 border border-ocean-500/30 rounded-md px-4 py-3 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Child Price (AED)</label>
                                <input
                                    type="number"
                                    value={formData.childPrice}
                                    onChange={(e) => setFormData({ ...formData, childPrice: e.target.value })}
                                    className="w-full bg-navy-700 border border-ocean-500/30 rounded-md px-4 py-3 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Infant Price (AED)</label>
                                <input
                                    type="number"
                                    value={formData.infantPrice}
                                    onChange={(e) => setFormData({ ...formData, infantPrice: e.target.value })}
                                    className="w-full bg-navy-700 border border-ocean-500/30 rounded-md px-4 py-3 text-white"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">VAT Percentage (%)</label>
                                <input
                                    type="number"
                                    value={formData.vatPercentage}
                                    onChange={(e) => setFormData({ ...formData, vatPercentage: parseFloat(e.target.value) })}
                                    className="w-full bg-navy-700 border border-ocean-500/30 rounded-md px-4 py-3 text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading || uploadingImage}
                            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating...' : 'Create Package'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="btn-secondary px-8"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
