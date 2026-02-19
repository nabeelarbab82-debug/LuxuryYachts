'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FaLock, FaCreditCard } from 'react-icons/fa';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
  clientSecret: string;
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

function CheckoutForm({ clientSecret, orderId, orderNumber, totalAmount, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setErrorMessage('');

    try {
      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        onError(error.message || 'Payment failed');
        setProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Update order status
        const confirmResponse = await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            paymentIntentId: paymentIntent.id,
          }),
        });

        const confirmData = await confirmResponse.json();

        if (confirmData.success) {
          onSuccess();
        } else {
          onError('Payment confirmed but order update failed');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
      onError(err.message || 'An unexpected error occurred');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-navy-700 border border-gold-500/30 rounded-lg p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">Order Number:</span>
            <span className="text-gold-500 font-semibold font-mono">{orderNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-lg">Total Amount:</span>
            <span className="text-white text-2xl font-bold">AED {totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-navy-700 border border-gold-500/30 rounded-lg p-6">
        <div className="mb-4 flex items-center gap-2 text-white">
          <FaCreditCard className="text-gold-500" />
          <h3 className="font-semibold">Payment Details</h3>
        </div>
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-md">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaLock />
        {processing ? 'Processing Payment...' : `Pay AED ${totalAmount.toFixed(2)}`}
      </button>

      <div className="text-center text-gray-400 text-sm">
        <FaLock className="inline mr-1" />
        Secured by Stripe | Your payment information is encrypted
      </div>
    </form>
  );
}

interface StripeCheckoutProps {
  clientSecret: string;
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function StripeCheckout({
  clientSecret,
  orderId,
  orderNumber,
  totalAmount,
  onSuccess,
  onError,
}: StripeCheckoutProps) {
  const options = {
    clientSecret,
    appearance: {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#D4AF37',
        colorBackground: '#1a2332',
        colorText: '#ffffff',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '8px',
      },
    },
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm
          clientSecret={clientSecret}
          orderId={orderId}
          orderNumber={orderNumber}
          totalAmount={totalAmount}
          onSuccess={onSuccess}
          onError={onError}
        />
      </Elements>
    </div>
  );
}
