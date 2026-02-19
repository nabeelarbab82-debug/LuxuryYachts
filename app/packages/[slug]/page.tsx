'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import StripeCheckout from '@/components/StripeCheckout';
import { motion } from 'framer-motion';
import {
    FaCalendar, FaClock, FaUsers, FaWhatsapp, FaCheck,
    FaMapMarkerAlt, FaShip, FaStar, FaChevronLeft, FaChevronRight,
    FaUserAlt, FaEnvelope, FaPhone, FaCreditCard, FaArrowLeft, FaUser, FaCheckCircle
} from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function PackageDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [package_, setPackage] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
    const [submitting, setSubmitting] = useState(false);

    // Contact information
    const [contactInfo, setContactInfo] = useState({
        name: '',
        email: '',
        phone: '',
    });

    // Booking form state
    const [bookingData, setBookingData] = useState({
        date: null as Date | null,
        startTime: '08:00',
        bookingHours: 2,
        adults: 2,
        children: 0,
        infants: 0,
        pickupPoint: '',
        meetingPoint: '',
        specialRequests: '',
    });

    const [bookingCalculation, setBookingCalculation] = useState({
        subtotal: 0,
        vat: 0,
        total: 0,
    });

    const [paymentData, setPaymentData] = useState<{
        clientSecret: string;
        orderId: string;
        orderNumber: string;
        bookingId: string;
        totalAmount: number;
        subtotal: number;
        vat: number;
    } | null>(null);

    useEffect(() => {
        fetchPackage();
    }, [slug]);

    useEffect(() => {
        calculateTotal();
    }, [bookingData, package_]);

    const fetchPackage = async () => {
        try {
            const res = await fetch(`/api/packages/slug/${slug}`);
            const data = await res.json();
            if (data.success) {
                setPackage(data.package);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        if (!package_) return;

        let subtotal = 0;

        if (package_.priceType === 'per_hour') {
            subtotal = package_.price * bookingData.bookingHours;
        } else if (package_.priceType === 'per_person') {
            const adultPrice = package_.pricing?.adultPrice || package_.price;
            const childPrice = package_.pricing?.childPrice || package_.price * 0.7;
            const infantPrice = package_.pricing?.infantPrice || 0;

            subtotal = (
                adultPrice * bookingData.adults +
                childPrice * bookingData.children +
                infantPrice * bookingData.infants
            );
        } else {
            subtotal = package_.price;
        }

        const vatPercentage = package_.pricing?.vatPercentage || package_.vatPercentage || 5;
        const vat = (subtotal * vatPercentage) / 100;
        const total = subtotal + vat;

        setBookingCalculation({
            subtotal,
            vat,
            total,
        });
    };

    const handleBooking = async () => {
        // Validation
        if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
            alert('Please fill in your contact information');
            return;
        }

        if (!bookingData.date) {
            alert('Please select a date');
            return;
        }

        const totalGuests = bookingData.adults + bookingData.children + bookingData.infants;
        if (totalGuests === 0) {
            alert('Please select at least one guest');
            return;
        }

        setSubmitting(true);

        try {
            // Create payment intent with booking data
            const response = await fetch('/api/payment/create-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingData: {
                        packageId: package_._id,
                        packageName: package_.title || package_.name,
                        name: contactInfo.name,
                        email: contactInfo.email,
                        phone: contactInfo.phone,
                        date: bookingData.date,
                        startTime: bookingData.startTime,
                        bookingHours: bookingData.bookingHours,
                        adults: bookingData.adults,
                        children: bookingData.children,
                        infants: bookingData.infants,
                        package: package_.type || 'custom',
                        guests: totalGuests,
                        specialRequests: `Package: ${package_.title || package_.name}\nPickup: ${bookingData.pickupPoint || 'N/A'}\nMeeting Point: ${bookingData.meetingPoint || 'N/A'}\nStart Time: ${bookingData.startTime}\nHours: ${bookingData.bookingHours}\nAdults: ${bookingData.adults}, Children: ${bookingData.children}, Infants: ${bookingData.infants}\n${bookingData.specialRequests}`,
                    },
                    calculatedAmounts: {
                        subtotal: bookingCalculation.subtotal,
                        vat: bookingCalculation.vat,
                        total: bookingCalculation.total,
                        vatPercentage: package_.pricing?.vatPercentage || package_.vatPercentage || 5,
                    },
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setPaymentData({
                    clientSecret: data.clientSecret,
                    orderId: data.orderId,
                    orderNumber: data.orderNumber,
                    bookingId: data.bookingId,
                    totalAmount: bookingCalculation.total,
                    subtotal: bookingCalculation.subtotal,
                    vat: bookingCalculation.vat,
                });
                setStep('payment');
            } else {
                alert(data.error || 'Failed to create booking. Please try again.');
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('Failed to create booking. Please try again or contact us on WhatsApp.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleWhatsAppBooking = () => {
        if (!bookingData.date) {
            alert('Please select a date');
            return;
        }

        // Open WhatsApp with booking details
        const message = `Hi! I'd like to book:\n\nPackage: ${package_.name}\nDate: ${bookingData.date.toLocaleDateString()}\nTime: ${bookingData.startTime}\nHours: ${bookingData.bookingHours}\nAdults: ${bookingData.adults}\nChildren: ${bookingData.children}\nTotal: AED ${bookingCalculation.total.toFixed(2)}`;

        const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971XXXXXXXXX';
        window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handlePaymentSuccess = () => {
        setStep('success');
    };

    const handlePaymentError = (error: string) => {
        alert(`Payment failed: ${error}`);
    };

    const handleBackToForm = () => {
        setStep('form');
        setPaymentData(null);
    };

    const handleNewBooking = () => {
        setStep('form');
        setPaymentData(null);
        setContactInfo({ name: '', email: '', phone: '' });
        setBookingData({
            date: null,
            startTime: '08:00',
            bookingHours: 2,
            adults: 2,
            children: 0,
            infants: 0,
            pickupPoint: '',
            meetingPoint: '',
            specialRequests: '',
        });
    };

    const timeSlots = [
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
        '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
    ];

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-navy-900 pt-20 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
                </div>
            </>
        );
    }

    if (!package_) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-navy-900 pt-20 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-white mb-4">Package Not Found</h1>
                        <a href="/packages" className="btn-primary">Back to Packages</a>
                    </div>
                </div>
            </>
        );
    }

    const images = package_.images?.length > 0 ? package_.images :
        (package_.mainImage ? [package_.mainImage] : []);

    return (
        <>
            <Header />
            <main className="min-h-screen bg-navy-900 pt-20">
                {/* Hero Gallery */}
                <section className="relative h-[60vh] bg-navy-800">
                    {images.length > 0 ? (
                        <div className="relative h-full">
                            <img
                                src={images[currentImageIndex].url}
                                alt={package_.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent"></div>

                            {/* Image Navigation */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-navy-900/80 hover:bg-navy-900 text-white p-3 rounded-full transition-colors"
                                        aria-label="Previous image"
                                    >
                                        <FaChevronLeft />
                                    </button>
                                    <button
                                        onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-navy-900/80 hover:bg-navy-900 text-white p-3 rounded-full transition-colors"
                                        aria-label="Next image"
                                    >
                                        <FaChevronRight />
                                    </button>

                                    {/* Image Indicators */}
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                        {images.map((_: any, index: number) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-gold-500 w-8' : 'bg-white/50'
                                                    }`}
                                                aria-label={`Go to image ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="h-full bg-gradient-to-br from-navy-800 to-navy-700 flex items-center justify-center">
                            <FaShip className="text-gold-500 text-6xl" />
                        </div>
                    )}
                </section>

                {/* Main Content */}
                <section className="section-padding">
                    <div className="container-custom">
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Left: Package Details */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Package Header */}
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="px-4 py-2 bg-gold-500/20 text-gold-500 rounded-full text-sm font-semibold capitalize">
                                            {package_.type}
                                        </span>
                                        {package_.featured && (
                                            <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold flex items-center gap-2">
                                                <FaStar /> Featured
                                            </span>
                                        )}
                                    </div>

                                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                        {package_.name}
                                    </h1>

                                    {package_.shortDescription && (
                                        <p className="text-xl text-gray-300">{package_.shortDescription}</p>
                                    )}
                                </div>

                                {/* Description */}
                                {package_.description && (
                                    <div className="card-luxury">
                                        <h2 className="text-2xl font-bold text-white mb-4">About This Package</h2>
                                        <p className="text-gray-300 leading-relaxed">{package_.description}</p>
                                    </div>
                                )}

                                {/* Inclusions */}
                                {package_.inclusions && package_.inclusions.length > 0 && (
                                    <div className="card-luxury">
                                        <h2 className="text-2xl font-bold text-white mb-4">What's Included</h2>
                                        <div className="grid md:grid-cols-2 gap-3">
                                            {package_.inclusions.map((item: string, index: number) => (
                                                <div key={index} className="flex items-start gap-3">
                                                    <FaCheck className="text-gold-500 mt-1 flex-shrink-0" />
                                                    <span className="text-gray-300">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Yacht Details */}
                                {package_.yachtDetails && (
                                    <div className="card-luxury">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <FaShip className="text-gold-500" />
                                            Yacht Details
                                        </h2>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {package_.yachtDetails.capacity && (
                                                <div>
                                                    <p className="text-gray-400 text-sm">Capacity</p>
                                                    <p className="text-white font-semibold">{package_.yachtDetails.capacity} guests</p>
                                                </div>
                                            )}
                                            {package_.yachtDetails.length && (
                                                <div>
                                                    <p className="text-gray-400 text-sm">Length</p>
                                                    <p className="text-white font-semibold">{package_.yachtDetails.length}</p>
                                                </div>
                                            )}
                                            {package_.yachtDetails.brand && (
                                                <div>
                                                    <p className="text-gray-400 text-sm">Brand</p>
                                                    <p className="text-white font-semibold">{package_.yachtDetails.brand}</p>
                                                </div>
                                            )}
                                            {package_.yachtDetails.year && (
                                                <div>
                                                    <p className="text-gray-400 text-sm">Year</p>
                                                    <p className="text-white font-semibold">{package_.yachtDetails.year}</p>
                                                </div>
                                            )}
                                        </div>

                                        {package_.yachtDetails.amenities && package_.yachtDetails.amenities.length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-gray-400 text-sm mb-2">Amenities</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {package_.yachtDetails.amenities.map((amenity: string, index: number) => (
                                                        <span key={index} className="px-3 py-1 bg-navy-700 text-gray-300 rounded-full text-sm">
                                                            {amenity}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Pickup & Meeting Points */}
                                {(package_.pickupPoints?.length > 0 || package_.meetingPoints?.length > 0) && (
                                    <div className="card-luxury">
                                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-gold-500" />
                                            Pickup & Meeting Points
                                        </h2>

                                        {package_.pickupPoints?.length > 0 && (
                                            <div className="mb-6">
                                                <h3 className="text-lg font-semibold text-white mb-3">Pickup Points</h3>
                                                <div className="space-y-3">
                                                    {package_.pickupPoints.map((point: any, index: number) => (
                                                        <div key={index} className="bg-navy-700 p-4 rounded-lg">
                                                            <p className="text-white font-medium">{point.name}</p>
                                                            <p className="text-gray-400 text-sm">{point.address}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {package_.meetingPoints?.length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-white mb-3">Meeting Points</h3>
                                                <div className="space-y-3">
                                                    {package_.meetingPoints.map((point: any, index: number) => (
                                                        <div key={index} className="bg-navy-700 p-4 rounded-lg">
                                                            <p className="text-white font-medium">{point.name}</p>
                                                            <p className="text-gray-400 text-sm">{point.address}</p>
                                                            {point.instructions && (
                                                                <p className="text-gray-300 text-sm mt-2">{point.instructions}</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Right: Booking Card */}
                            <div className="lg:col-span-1">
                                <div className="card-luxury sticky top-24">
                                    {/* Price Display */}
                                    <div className="border-b border-gold-500/20 pb-4 mb-6">
                                        <div className="text-4xl font-bold text-gold-500 mb-1">
                                            AED {package_.price}
                                        </div>
                                        <div className="text-gray-400">
                                            {package_.priceType === 'per_hour' && 'per hour'}
                                            {package_.priceType === 'per_person' && 'per person'}
                                            {package_.type === 'private' && ' (Private)'}
                                        </div>
                                    </div>

                                    {/* Booking Form */}
                                    <div className="space-y-4">
                                        {/* Date Selection */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                <FaCalendar className="inline mr-2" />
                                                SELECT DATE:
                                            </label>
                                            <DatePicker
                                                selected={bookingData.date}
                                                onChange={(date: Date | null) => setBookingData({ ...bookingData, date })}
                                                minDate={new Date()}
                                                dateFormat="dd MMM yyyy"
                                                placeholderText="Please select"
                                                className="w-full bg-navy-700 border border-gold-500/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold-500"
                                            />
                                        </div>

                                        {/* Start Time */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                <FaClock className="inline mr-2" />
                                                START TIME
                                            </label>
                                            <select
                                                value={bookingData.startTime}
                                                onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                                                className="w-full bg-navy-700 border border-gold-500/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold-500"
                                                aria-label="Select start time"
                                            >
                                                {timeSlots.map((time) => (
                                                    <option key={time} value={time}>{time}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Booking Hours (if per_hour pricing) */}
                                        {package_.priceType === 'per_hour' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    BOOKING HOURS
                                                </label>
                                                <input
                                                    type="number"
                                                    min={package_.minimumBookingHours || 2}
                                                    value={bookingData.bookingHours}
                                                    onChange={(e) => setBookingData({ ...bookingData, bookingHours: parseInt(e.target.value) })}
                                                    className="w-full bg-navy-700 border border-gold-500/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold-500"
                                                    aria-label="Booking hours"
                                                />
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Minimum booking hour: {package_.minimumBookingHours || 2}
                                                </p>
                                            </div>
                                        )}

                                        {/* Guest Count */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                <FaUsers className="inline mr-2" />
                                                NUMBER OF GUESTS
                                            </label>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between bg-navy-700 px-4 py-3 rounded-md">
                                                    <div>
                                                        <p className="text-white font-medium">Adults</p>
                                                        {package_.pricing?.adultPrice && (
                                                            <p className="text-gray-400 text-sm">AED {package_.pricing.adultPrice}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => setBookingData({ ...bookingData, adults: Math.max(0, bookingData.adults - 1) })}
                                                            className="w-8 h-8 bg-navy-600 hover:bg-navy-500 rounded-full text-white"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-8 text-center text-white font-semibold">{bookingData.adults}</span>
                                                        <button
                                                            onClick={() => setBookingData({ ...bookingData, adults: bookingData.adults + 1 })}
                                                            className="w-8 h-8 bg-gold-500 hover:bg-gold-600 rounded-full text-navy-900"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between bg-navy-700 px-4 py-3 rounded-md">
                                                    <div>
                                                        <p className="text-white font-medium">Children (2-12 years)</p>
                                                        {package_.pricing?.childPrice && (
                                                            <p className="text-gray-400 text-sm">AED {package_.pricing.childPrice}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => setBookingData({ ...bookingData, children: Math.max(0, bookingData.children - 1) })}
                                                            className="w-8 h-8 bg-navy-600 hover:bg-navy-500 rounded-full text-white"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-8 text-center text-white font-semibold">{bookingData.children}</span>
                                                        <button
                                                            onClick={() => setBookingData({ ...bookingData, children: bookingData.children + 1 })}
                                                            className="w-8 h-8 bg-gold-500 hover:bg-gold-600 rounded-full text-navy-900"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between bg-navy-700 px-4 py-3 rounded-md">
                                                    <div>
                                                        <p className="text-white font-medium">Infants (0-2 years)</p>
                                                        {package_.pricing?.infantPrice !== undefined && (
                                                            <p className="text-gray-400 text-sm">
                                                                {package_.pricing.infantPrice === 0 ? 'Free' : `AED ${package_.pricing.infantPrice}`}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => setBookingData({ ...bookingData, infants: Math.max(0, bookingData.infants - 1) })}
                                                            className="w-8 h-8 bg-navy-600 hover:bg-navy-500 rounded-full text-white"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-8 text-center text-white font-semibold">{bookingData.infants}</span>
                                                        <button
                                                            onClick={() => setBookingData({ ...bookingData, infants: bookingData.infants + 1 })}
                                                            className="w-8 h-8 bg-gold-500 hover:bg-gold-600 rounded-full text-navy-900"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Step 1: Booking Form */}
                                        {step === 'form' && (
                                            <>
                                                {/* Contact Information */}
                                                <div className="space-y-4 border-t border-gold-500/20 pt-4">
                                                    <h3 className="text-lg font-semibold text-white">Contact Information</h3>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                                            <FaUser className="inline mr-2" />
                                                            FULL NAME *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={contactInfo.name}
                                                            onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                                                            placeholder="Enter your full name"
                                                            className="w-full bg-navy-700 border border-gold-500/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold-500"
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                                            <FaEnvelope className="inline mr-2" />
                                                            EMAIL *
                                                        </label>
                                                        <input
                                                            type="email"
                                                            value={contactInfo.email}
                                                            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                                            placeholder="your@email.com"
                                                            className="w-full bg-navy-700 border border-gold-500/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold-500"
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                                            <FaPhone className="inline mr-2" />
                                                            PHONE *
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            value={contactInfo.phone}
                                                            onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                                            placeholder="+971 XX XXX XXXX"
                                                            className="w-full bg-navy-700 border border-gold-500/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold-500"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                {/* Price Breakdown */}
                                                <div className="border-t border-gold-500/20 pt-4 space-y-2">
                                                    <div className="flex justify-between text-gray-300">
                                                        <span>Subtotal</span>
                                                        <span>AED {bookingCalculation.subtotal.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-gray-300">
                                                        <span>VAT ({package_.pricing?.vatPercentage || 5}%)</span>
                                                        <span>AED {bookingCalculation.vat.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xl font-bold text-white border-t border-gold-500/20 pt-2">
                                                        <span>Total</span>
                                                        <span className="text-gold-500">AED {bookingCalculation.total.toFixed(2)}</span>
                                                    </div>
                                                </div>

                                                {/* CTA Buttons */}
                                                <button
                                                    onClick={handleBooking}
                                                    disabled={submitting}
                                                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    <FaCreditCard className="text-xl" />
                                                    {submitting ? 'Processing...' : 'PROCEED TO PAYMENT'}
                                                </button>

                                                <button
                                                    onClick={handleWhatsAppBooking}
                                                    className="w-full btn-secondary flex items-center justify-center gap-2"
                                                >
                                                    <FaWhatsapp className="text-xl" />
                                                    BOOK VIA WHATSAPP
                                                </button>

                                                <p className="text-center text-gray-400 text-sm">
                                                    Or call us at{' '}
                                                    <a href="tel:+971XXXXXXXXX" className="text-gold-500 hover:underline">
                                                        +971 XX XXX XXXX
                                                    </a>
                                                </p>
                                            </>
                                        )}

                                        {/* Step 2: Payment */}
                                        {step === 'payment' && paymentData && (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <button
                                                        onClick={handleBackToForm}
                                                        className="text-gold-500 hover:text-gold-400 flex items-center gap-2"
                                                    >
                                                        <FaArrowLeft /> Back
                                                    </button>
                                                    <h3 className="text-lg font-semibold text-white">Complete Payment</h3>
                                                </div>

                                                <div className="bg-navy-700 p-4 rounded-lg mb-4">
                                                    <h4 className="font-semibold text-white mb-2">Booking Summary</h4>
                                                    <div className="space-y-1 text-sm text-gray-300">
                                                        <p><strong>Package:</strong> {package_.title}</p>
                                                        <p><strong>Date:</strong> {bookingData.date?.toLocaleDateString()}</p>
                                                        <p><strong>Time:</strong> {bookingData.startTime}</p>
                                                        <p><strong>Guests:</strong> {bookingData.adults} Adults, {bookingData.children} Children, {bookingData.infants} Infants</p>
                                                        <p className="text-lg font-bold text-gold-500 mt-2">
                                                            Total: AED {bookingCalculation.total.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <StripeCheckout
                                                    clientSecret={paymentData.clientSecret}
                                                    orderId={paymentData.orderId}
                                                    orderNumber={paymentData.orderNumber}
                                                    totalAmount={paymentData.totalAmount}
                                                    onSuccess={handlePaymentSuccess}
                                                    onError={handlePaymentError}
                                                />
                                            </div>
                                        )}

                                        {/* Step 3: Success */}
                                        {step === 'success' && paymentData && (
                                            <div className="space-y-6 text-center py-8">
                                                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                                                    <FaCheckCircle className="text-3xl text-white" />
                                                </div>

                                                <div>
                                                    <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
                                                    <p className="text-gray-300">
                                                        Your payment was successful and your booking has been confirmed.
                                                    </p>
                                                </div>

                                                <div className="bg-navy-700 p-6 rounded-lg text-left">
                                                    <h4 className="font-semibold text-white mb-3">Booking Details</h4>
                                                    <div className="space-y-2 text-sm text-gray-300">
                                                        <p><strong>Order Number:</strong> {paymentData.orderNumber}</p>
                                                        <p><strong>Package:</strong> {package_.title}</p>
                                                        <p><strong>Date:</strong> {bookingData.date?.toLocaleDateString()}</p>
                                                        <p><strong>Time:</strong> {bookingData.startTime}</p>
                                                        <p><strong>Guests:</strong> {bookingData.adults} Adults, {bookingData.children} Children, {bookingData.infants} Infants</p>
                                                        <p className="text-lg font-bold text-gold-500 mt-3 pt-3 border-t border-gold-500/20">
                                                            Amount Paid: AED {bookingCalculation.total.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <p className="text-gray-400 text-sm">
                                                    A confirmation email has been sent to <strong className="text-white">{contactInfo.email}</strong>
                                                </p>

                                                <button
                                                    onClick={handleNewBooking}
                                                    className="w-full btn-primary"
                                                >
                                                    Make Another Booking
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Availability Note */}
                                    <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                        <p className="text-green-400 text-sm text-center">
                                            ✓ Available for booking
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
                <WhatsAppButton />
            </main>
        </>
    );
}
