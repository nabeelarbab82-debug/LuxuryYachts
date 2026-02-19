# Admin Credentials

## Default Admin Account

### Login Credentials:
- **Email:** `admin@arbyacht.com`
- **Password:** `Admin@123`
- **Login URL:** `http://localhost:3000/admin/login`

---

## How to Create/Reset Admin Account

### Method 1: Reset Existing Admin (Recommended if login fails)
If you're getting "Invalid credentials" error, run this command to reset:
```bash
node scripts/reset-admin.js
```

This will:
- Delete any existing admin with the email
- Create a fresh admin account
- Display the new credentials

### Method 2: Create New Admin (First time setup)
Run this command in your terminal:
```bash
node scripts/create-admin.js
```

This will:
- Create a new admin account if none exists
- Display the credentials in the terminal
- Show if an admin already exists

---

### Method 3: Direct Database Access
If you need to reset the password or create a new admin manually:

1. **Connect to MongoDB:**
   ```bash
   mongosh "mongodb+srv://hammad:Hammad12345.@e-commerce.y3w9cfo.mongodb.net/dinner_cruise"
   ```

2. **Delete existing admin (optional):**
   ```javascript
   db.admins.deleteOne({ email: "admin@arbyacht.com" })
   ```

3. **Create new admin:**
   ```javascript
   db.admins.insertOne({
     email: "admin@arbyacht.com",
     password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7mY3bPzL82",
     name: "Admin User",
     role: "superadmin",
     active: true,
     createdAt: new Date()
   })
   ```
   This creates an admin with password: `Admin@123`

---

### Method 4: Using Admin Registration API
You can also register a new admin via API:

```bash
curl -X POST http://localhost:3000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@arbyacht.com",
    "password": "Admin@123",
    "name": "Admin User"
  }'
```

Or use Postman/Insomnia with:
- **URL:** `POST http://localhost:3000/api/admin/register`
- **Body (JSON):**
  ```json
  {
    "email": "admin@arbyacht.com",
    "password": "Admin@123",
    "name": "Admin User"
  }
  ```

---

## Admin Panel Features

Once logged in, you can access:

- **Dashboard** - `/admin` - Overview and quick actions
- **Bookings** - `/admin/bookings` - View and manage all bookings
- **Packages** - `/admin/packages` - Manage yacht packages
  - Create new packages: `/admin/packages/create`
- **Orders** - `/admin/orders` - View all orders and payment details
  - Order details: `/admin/orders/[id]`

---

## Security Notes

⚠️ **IMPORTANT:**
1. Change the default password immediately after first login
2. Use strong passwords (mix of uppercase, lowercase, numbers, and symbols)
3. In production, restrict the registration API endpoint
4. Keep database credentials secure and never commit them to version control

---

## Troubleshooting

### "Admin already exists" error
- An admin with this email already exists
- Use Method 2 to reset the password, or
- Use a different email address

### Can't connect to database
- Check MongoDB connection string in `.env.local`
- Verify network access in MongoDB Atlas
- Ensure IP address is whitelisted

### Login not working
- Verify credentials are correct
- Check browser console for errors
- Clear browser cookies/cache
- Verify NextAuth is configured properly

---

**Last Updated:** February 19, 2026
