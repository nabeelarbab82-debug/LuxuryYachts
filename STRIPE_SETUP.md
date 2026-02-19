# Stripe Payment Integration - Setup Guide

## Overview
This project now includes full Stripe payment integration for yacht dinner cruise bookings with an orders management system in the admin panel.

## What Was Implemented

### 1. **Stripe Payment System**
   - **Payment Intent Creation**: Creates secure payment intents through `/api/payment/create-intent`
   - **Payment Confirmation**: Confirms successful payments via `/api/payment/confirm`
   - **Webhook Handler**: Processes Stripe webhooks at `/api/payment/webhook`
   - **Secure Checkout**: Stripe Elements integration for card payments

### 2. **Order Management System**
   - **Order Model** (`models/Order.ts`): Comprehensive order schema with:
     - Order tracking (order number, status)
     - Customer information
     - Package and booking details
     - Payment information (Stripe IDs, amounts, VAT)
     - Timestamps for all order lifecycle events
   
### 3. **Admin Panel - Orders Management**
   - **Orders List Page** (`/admin/orders`):
     - View all orders with filtering options
     - Filter by order status (pending, confirmed, cancelled, completed, refunded)
     - Filter by payment status (pending, processing, succeeded, failed, refunded)
     - Search by order number, customer name, or email
     - Color-coded status badges
   
   - **Order Detail Page** (`/admin/orders/[id]`):
     - Complete order information
     - Customer details
     - Booking details
     - Payment information (Stripe IDs, payment method)
     - Order summary with pricing breakdown (subtotal, VAT, total)
     - Timeline of order events

### 4. **Updated Booking Flow**
   - **Step 1**: Customer fills booking form
   - **Step 2**: Secure payment via Stripe
   - **Step 3**: Success confirmation with order details
   - Automatic email receipts from Stripe
   - Order and booking creation before payment
   - Status updates after successful payment

## Environment Variables

The following Stripe keys are configured in `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your_publishable_key>
STRIPE_SECRET_KEY=<your_secret_key>
```

### Optional Webhook Secret
For production webhook verification, add:
```env
STRIPE_WEBHOOK_SECRET=<your_webhook_secret>
```

## API Endpoints

### Payment APIs
- `POST /api/payment/create-intent` - Creates payment intent and order
- `POST /api/payment/confirm` - Confirms payment and updates order
- `POST /api/payment/webhook` - Handles Stripe webhooks

### Order APIs
- `GET /api/orders` - List all orders (with filters)
- `GET /api/orders/[id]` - Get single order details

## Key Features

### Payment Processing
- **Currency**: AED (UAE Dirham)
- **VAT**: 5% automatically calculated
- **Security**: PCI-compliant via Stripe
- **Payment Methods**: Card payments (Visa, Mastercard, Amex)

### Order Tracking
- Unique order numbers (format: ORD-XXXXXXXX)
- Status tracking throughout lifecycle
- Payment status monitoring
- Refund support

### Admin Features
- Real-time order dashboard
- Advanced filtering and search
- Detailed order views
- Direct access from admin dashboard

## Testing

### Test Card Numbers
Use these test cards in development:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

Use any future expiry date and any 3-digit CVC.

## Webhook Setup (Production)

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/payment/webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy webhook signing secret to `.env.local`

## Files Modified/Created

### New Files
- `models/Order.ts` - Order database model
- `app/api/payment/create-intent/route.ts` - Payment intent API
- `app/api/payment/confirm/route.ts` - Payment confirmation API
- `app/api/payment/webhook/route.ts` - Stripe webhook handler
- `app/api/orders/route.ts` - Orders list API
- `app/api/orders/[id]/route.ts` - Single order API
- `app/admin/orders/page.tsx` - Orders list page
- `app/admin/orders/[id]/page.tsx` - Order detail page
- `components/StripeCheckout.tsx` - Stripe payment form component

### Modified Files
- `components/BookingSection.tsx` - Updated booking flow with payment
- `app/admin/page.tsx` - Added Orders quick action link
- `package.json` - Added Stripe dependencies

## NPM Packages Installed
- `stripe` - Stripe Node.js SDK
- `@stripe/stripe-js` - Stripe.js library
- `@stripe/react-stripe-js` - React components for Stripe

## Next Steps

1. **Test the integration**:
   - Try making a test booking
   - Use test card numbers
   - Check order appears in admin panel

2. **Configure webhook** (for production):
   - Set up webhook endpoint in Stripe
   - Add webhook secret to environment variables

3. **Email notifications** (optional):
   - Configure email service for order confirmations
   - Send custom emails beyond Stripe receipts

4. **Refund functionality** (optional):
   - Add refund button in admin order detail page
   - Integrate with Stripe refund API

## Support

- Stripe Dashboard: https://dashboard.stripe.com
- Stripe Docs: https://stripe.com/docs
- Test Mode: All transactions use test keys (no real charges)

---

**Note**: Currently in **TEST MODE**. All payments use test keys and no real charges are made.
