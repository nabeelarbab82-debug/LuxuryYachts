# Luxury Dinner Cruise - Next.js Application

A premium, full-stack Next.js application for a luxury dinner cruise business in Dubai Marina. Features a dark, elegant design with booking management, CMS capabilities, and WhatsApp integration.

## Features

### Frontend

- ✨ **Luxury Design**: Dark theme with navy/black/gold accents
- 📱 **Mobile-First**: Fully responsive design
- 🎨 **Modern UI**: Smooth animations with Framer Motion
- 🚢 **Hero Section**: Full-width hero with quick booking card
- 💳 **Booking System**: Complete booking flow with date picker
- 📸 **Gallery**: Image grid with video showcase
- ❓ **FAQ Section**: Accordion-style frequently asked questions
- 📍 **Itinerary**: Cruise details with location map integration
- 💬 **WhatsApp Integration**: Sticky button and inquiry sections

### Backend

- 🗄️ **MongoDB**: Database for bookings, packages, FAQs, and content
- 🔌 **API Routes**: RESTful endpoints for all data management
- 📊 **Admin Dashboard**: CMS panel for content and booking management
- 📦 **Package Management**: Dynamic pricing and package configuration
- 📝 **Content Management**: Editable sections through admin panel

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB
- **ODM**: Mongoose
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Date Picker**: React DatePicker

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (connection string provided or your own)
- Git

### Installation

1. **Clone or navigate to the project directory:**

   ```bash
   cd "d:\Arb yacth"
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Update `.env.local` with your details:

   ```env
   MONGODB_URI=********
   MONGODB_DB=******
   NEXT_PUBLIC_WHATSAPP_NUMBER=971XXXXXXXXX
   NEXT_PUBLIC_WHATSAPP_MESSAGE=Hi, I would like to inquire about the luxury dinner cruise booking.
   ```

   **Important**: Replace the WhatsApp number with your actual business number.

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Main site: [http://localhost:3000](http://localhost:3000)
   - Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## Project Structure

```
d:\Arb yacth\
├── app/
│   ├── api/
│   │   ├── bookings/         # Booking API routes
│   │   ├── packages/         # Package management API
│   │   ├── faqs/            # FAQ management API
│   │   └── content/         # Content management API
│   ├── admin/               # Admin dashboard
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
├── components/
│   ├── Hero.tsx             # Hero section with booking
│   ├── BookingCard.tsx      # Quick booking widget
│   ├── TrustStrip.tsx       # Trust indicators
│   ├── Experience.tsx       # Experience overview
│   ├── Packages.tsx         # Pricing packages
│   ├── WhyChoose.tsx        # USP section
│   ├── Gallery.tsx          # Image/video gallery
│   ├── Itinerary.tsx        # Cruise details
│   ├── BookingSection.tsx   # Main booking form
│   ├── WhatsAppEnquiry.tsx  # WhatsApp CTA
│   ├── FAQ.tsx              # FAQ accordion
│   ├── Footer.tsx           # Footer
│   └── WhatsAppButton.tsx   # Sticky WhatsApp button
├── lib/
│   └── mongodb.ts           # MongoDB connection
├── models/
│   ├── Booking.ts           # Booking schema
│   ├── Package.ts           # Package schema
│   ├── FAQ.ts               # FAQ schema
│   └── Content.ts           # Content schema
└── public/                  # Static assets (images)
```

## Configuration

### Adding Images

Replace placeholder images in the `public` folder:

```
public/
├── hero-yacht.jpg           # Hero background
├── experience-yacht.jpg     # Experience section
└── gallery/
    ├── yacht-exterior.jpg
    ├── dining-setup.jpg
    ├── guests-dinner.jpg
    ├── marina-skyline.jpg
    ├── entertainment.jpg
    ├── deck-view.jpg
    ├── interior.jpg
    └── night-cruise.jpg
```

### WhatsApp Configuration

Update in `.env.local`:

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: Your business WhatsApp number (format: 971XXXXXXXXX)
- `NEXT_PUBLIC_WHATSAPP_MESSAGE`: Default message for quick inquiries

### Customizing Packages

Packages can be managed via:

1. Direct MongoDB updates
2. Admin dashboard at `/admin`
3. API endpoints at `/api/packages`

Default packages in the system:

- Shared Dinner Cruise (AED 250/person)
- Premium Dinner Cruise (AED 450/person)
- VIP Private Deck (AED 750/person)
- Full Yacht Buyout (Contact for pricing)

## Admin Dashboard

Access the admin panel at `/admin` to manage:

- **Bookings**: View all customer bookings, status, and payment info
- **Packages**: Add, edit, or remove cruise packages
- **FAQs**: Manage frequently asked questions
- **Content**: Edit text content across all sections

## API Endpoints

### Bookings

- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings?status=pending` - Filter by status

### Packages

- `GET /api/packages` - Get all active packages
- `POST /api/packages` - Create new package
- `PUT /api/packages` - Update package

### FAQs

- `GET /api/faqs` - Get all active FAQs
- `POST /api/faqs` - Create new FAQ
- `PUT /api/faqs` - Update FAQ
- `DELETE /api/faqs?id=xxx` - Delete FAQ

### Content

- `GET /api/content?section=hero` - Get section content
- `POST /api/content` - Update/create content

## Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Deploy to Other Platforms

Compatible with:

- Vercel (recommended)
- Netlify
- AWS Amplify
- Digital Ocean
- Any Node.js hosting

## SEO Optimization

The application includes:

- Meta tags in layout
- Semantic HTML structure
- Fast loading times
- Mobile optimization
- Structured data ready

To enhance SEO:

1. Add proper meta descriptions
2. Implement structured data (JSON-LD)
3. Add sitemap.xml
4. Configure robots.txt
5. Add Open Graph tags

## Customization Guide

### Colors

Edit in `tailwind.config.js`:

```js
colors: {
  navy: {
    900: '#0a1628',
    800: '#0f1f3a',
    700: '#1a2942',
  },
  gold: {
    500: '#d4af37',
    600: '#c19b2b',
  },
}
```

### Fonts

Current fonts (Google Fonts):

- Headings: Playfair Display
- Body: Inter

Change in `app/globals.css`

### Sections

Add/remove sections by editing `app/page.tsx`

## Troubleshooting

### MongoDB Connection Issues

- Verify connection string in `.env.local`
- Check IP whitelist in MongoDB Atlas
- Ensure database user has proper permissions

### Images Not Loading

- Check file paths in `public` folder
- Verify image names match component references
- Clear Next.js cache: `rm -rf .next`

### WhatsApp Not Opening

- Verify phone number format (no spaces, + or dashes)
- Test on mobile device
- Check browser popup blocker

## Support

For issues or questions:

- Check documentation above
- Review Next.js docs: https://nextjs.org/docs
- MongoDB docs: https://mongoosejs.com/docs

## License

Proprietary - All rights reserved

## Notes for SEO Team

The CMS is fully functional for text updates. To modify content:

1. Access `/admin`
2. Navigate to "Content" tab
3. Select section to edit
4. Update text fields
5. Save changes

Changes are stored in MongoDB and reflect immediately on the frontend.

For image updates, upload new images to the `public` folder and update references in components or use the content API to store image URLs.
