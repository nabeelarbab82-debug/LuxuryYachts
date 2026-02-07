# QUICK SETUP GUIDE

## Step 1: Install Dependencies

Open PowerShell in this folder and run:

```powershell
npm install
```

## Step 2: Update WhatsApp Number

Edit `.env.local` file and replace:

```
NEXT_PUBLIC_WHATSAPP_NUMBER=971XXXXXXXXX
```

With your actual WhatsApp business number (e.g., 971501234567)

## Step 3: Seed Database (Optional)

To populate initial packages and FAQs:

```powershell
node scripts/seed.js
```

## Step 4: Add Images

Place your yacht images in the `public` folder:

- `public/hero-yacht.jpg` - Main hero background
- `public/experience-yacht.jpg` - Experience section image
- `public/gallery/*.jpg` - Gallery images (see public/gallery/README.txt)

## Step 5: Run Development Server

```powershell
npm run dev
```

Then open: http://localhost:3000

## Step 6: Access Admin Panel

Navigate to: http://localhost:3000/admin
Here you can manage:

- Bookings
- Packages
- FAQs
- Content

## Step 7: Build for Production

When ready to deploy:

```powershell
npm run build
npm start
```

## Important Notes:

### MongoDB Connection

The connection string is already configured in `.env.local`. If you need to change it:

```
MONGODB_URI=your_connection_string_here
```

### WhatsApp Integration

The sticky WhatsApp button appears after scrolling down 300px. It's fully functional once you add your number.

### Images

If images don't load, the components will show gradient placeholders. This is normal - just add your actual images.

### CMS Usage

The admin panel at `/admin` allows your SEO team to update text content without touching code.

### Customization

- Colors: Edit `tailwind.config.js`
- Text: Use admin panel or edit components directly
- Packages: Manage via admin panel or directly in MongoDB

## Troubleshooting:

### Port already in use?

Run on different port:

```powershell
$env:PORT=3001; npm run dev
```

### MongoDB connection error?

1. Check internet connection
2. Verify connection string in `.env.local`
3. Ensure IP is whitelisted in MongoDB Atlas

### Images not showing?

1. Check file names match exactly
2. Restart development server
3. Clear browser cache

## Need Help?

Check README.md for detailed documentation.
