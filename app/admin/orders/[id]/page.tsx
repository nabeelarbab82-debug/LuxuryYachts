'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaArrowLeft, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendar, 
  FaUsers, 
  FaCreditCard,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaReceipt,
  FaShip
} from 'react-icons/fa';

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  packageName: string;
  packageType: string;
  bookingDate: string;
  numberOfGuests: number;
  specialRequests?: string;
  subtotal: number;
  vat: number;
  vatPercentage: number;
  totalAmount: number;
  currency: string;
  stripePaymentIntentId: string;
  stripePaymentStatus: string;
  stripeChargeId?: string;
  paymentMethod?: string;
  orderStatus: string;
  paidAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { bg: string; text: string; icon: any } } = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', icon: FaClock },
      confirmed: { bg: 'bg-green-500/20', text: 'text-green-300', icon: FaCheckCircle },
      cancelled: { bg: 'bg-red-500/20', text: 'text-red-300', icon: FaTimesCircle },
      completed: { bg: 'bg-blue-500/20', text: 'text-blue-300', icon: FaCheckCircle },
      refunded: { bg: 'bg-purple-500/20', text: 'text-purple-300', icon: FaTimesCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-base ${config.bg} ${config.text} font-semibold`}>
        <Icon className="w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentBadge = (status: string) => {
    const statusConfig: { [key: string]: { bg: string; text: string } } = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-300' },
      processing: { bg: 'bg-blue-500/20', text: 'text-blue-300' },
      succeeded: { bg: 'bg-green-500/20', text: 'text-green-300' },
      failed: { bg: 'bg-red-500/20', text: 'text-red-300' },
      canceled: { bg: 'bg-gray-500/20', text: 'text-gray-300' },
      refunded: { bg: 'bg-purple-500/20', text: 'text-purple-300' },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-base ${config.bg} ${config.text} font-semibold`}>
        <FaCreditCard className="w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-400 py-12">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="text-center text-red-400 py-12">Order not found</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/orders')}
            className="text-gold-500 hover:text-gold-400 transition-colors"
            aria-label="Back to orders list"
          >
            <FaArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Order Details</h1>
            <p className="text-gray-400 text-sm mt-1">
              Order #{order.orderNumber}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {getStatusBadge(order.orderStatus)}
          {getPaymentBadge(order.stripePaymentStatus)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-navy-800 rounded-lg p-6 border border-gold-500/20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaUser className="text-gold-500" />
              Customer Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm">Full Name</label>
                <p className="text-white font-medium">{order.customerName}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Email</label>
                <p className="text-white font-medium">{order.customerEmail}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Phone</label>
                <p className="text-white font-medium">{order.customerPhone}</p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-navy-800 rounded-lg p-6 border border-gold-500/20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaShip className="text-gold-500" />
              Booking Details
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm">Package Type</label>
                <p className="text-white font-medium capitalize">{order.packageType}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Number of Guests</label>
                <p className="text-white font-medium flex items-center gap-2">
                  <FaUsers className="text-gold-500" />
                  {order.numberOfGuests}
                </p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Booking Date</label>
                <p className="text-white font-medium flex items-center gap-2">
                  <FaCalendar className="text-gold-500" />
                  {new Date(order.bookingDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            {order.specialRequests && (
              <div className="mt-4 pt-4 border-t border-gold-500/20">
                <label className="text-gray-400 text-sm">Special Requests</label>
                <p className="text-white mt-1">{order.specialRequests}</p>
              </div>
            )}
          </div>

          {/* Payment Information */}
          <div className="bg-navy-800 rounded-lg p-6 border border-gold-500/20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaCreditCard className="text-gold-500" />
              Payment Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Stripe Payment Intent ID:</span>
                <span className="text-white font-mono text-sm">{order.stripePaymentIntentId}</span>
              </div>
              {order.stripeChargeId && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Charge ID:</span>
                  <span className="text-white font-mono text-sm">{order.stripeChargeId}</span>
                </div>
              )}
              {order.paymentMethod && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Payment Method:</span>
                  <span className="text-white capitalize">{order.paymentMethod}</span>
                </div>
              )}
              {order.paidAt && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Paid At:</span>
                  <span className="text-white">
                    {new Date(order.paidAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-navy-800 rounded-lg p-6 border border-gold-500/20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaReceipt className="text-gold-500" />
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal:</span>
                <span>{order.currency} {order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>VAT ({order.vatPercentage}%):</span>
                <span>{order.currency} {order.vat.toFixed(2)}</span>
              </div>
              <div className="border-t border-gold-500/20 pt-3 mt-3">
                <div className="flex justify-between text-white text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-gold-500">{order.currency} {order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-navy-800 rounded-lg p-6 border border-gold-500/20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaClock className="text-gold-500" />
              Timeline
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-gray-400">Created:</label>
                <p className="text-white">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-gray-400">Last Updated:</label>
                <p className="text-white">
                  {new Date(order.updatedAt).toLocaleString()}
                </p>
              </div>
              {order.paidAt && (
                <div>
                  <label className="text-gray-400">Paid:</label>
                  <p className="text-green-300">
                    {new Date(order.paidAt).toLocaleString()}
                  </p>
                </div>
              )}
              {order.cancelledAt && (
                <div>
                  <label className="text-gray-400">Cancelled:</label>
                  <p className="text-red-300">
                    {new Date(order.cancelledAt).toLocaleString()}
                  </p>
                </div>
              )}
              {order.refundedAt && (
                <div>
                  <label className="text-gray-400">Refunded:</label>
                  <p className="text-purple-300">
                    {new Date(order.refundedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
