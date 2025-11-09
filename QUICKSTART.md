# ⚡ Quick Start - Beyond Earth

Get up and running in 5 minutes!

## Prerequisites Checklist

Before starting, ensure you have:
- [ ] PHP 8.1+ installed
- [ ] Composer installed
- [ ] Node.js 18+ installed
- [ ] MySQL 8+ installed and running
- [ ] NASA API key (get free at [api.nasa.gov](https://api.nasa.gov))

## 🚀 Quick Setup (Copy & Paste)

### Step 1: Install Dependencies (2 minutes)

```bash
# Navigate to project
cd c:\Users\ronel\OneDrive\Desktop\Final_project_110

# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

### Step 2: Environment Setup (1 minute)

```bash
# Copy environment file
copy .env.example .env

# Generate application key
php artisan key:generate
```

### Step 3: Configure `.env` File

Open `.env` and update these lines:

```env
# Database Configuration
DB_DATABASE=beyond_earth
DB_USERNAME=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD

# NASA API Configuration
NASA_API_KEY=YOUR_NASA_API_KEY
```

### Step 4: Database Setup (1 minute)

```bash
# Create database (run in MySQL)
mysql -u root -p
CREATE DATABASE beyond_earth;
exit;

# Run migrations
php artisan migrate
```

### Step 5: Start Application (1 minute)

Open TWO terminal windows:

**Terminal 1:**
```bash
php artisan serve
```

**Terminal 2:**
```bash
npm run dev
```

### Step 6: Visit the App! 🎉

Open your browser:
```
http://localhost:8000
```

---

## 🎯 What You Should See

1. **Hero Section**: Animated starfield with "Beyond Earth" title
2. **Story Timeline**: Scroll to see timeline animations
3. **Gallery**: NASA images loading from API
4. **Mars Section**: Photos from Curiosity rover
5. **Earth Section**: 3D rotating Earth
6. **Favorites**: Save your favorite images
7. **Feedback**: Submit feedback with star rating

---

## ❌ Common Issues & Quick Fixes

### Database Connection Failed
```bash
# Check MySQL is running
net start MySQL80

# Verify .env credentials match your MySQL setup
```

### NASA API Not Loading
```env
# In .env, you can use DEMO_KEY for testing:
NASA_API_KEY=DEMO_KEY

# But get your own key for production (no rate limits):
# https://api.nasa.gov
```

### Port 8000 Already in Use
```bash
# Use different port
php artisan serve --port=8001
# Then visit: http://localhost:8001
```

### Vite Errors
```bash
# Clear node modules and reinstall
rmdir /s node_modules
npm install
npm run dev
```

---

## 📝 Next Steps

1. ✅ Get your own NASA API key: [api.nasa.gov](https://api.nasa.gov)
2. ✅ Explore all sections of the app
3. ✅ Try adding favorites
4. ✅ Submit feedback
5. ✅ Customize colors/text to make it your own
6. ✅ Deploy to production

---

## 📚 Full Documentation

- **Detailed Setup**: See `SETUP_GUIDE.md`
- **Marketing Strategy**: See `CREATIVE_BRIEF.md`
- **Technical Details**: See `README.md`

---

## 🆘 Need Help?

Check logs:
```bash
# Laravel logs
tail -f storage/logs/laravel.log

# Check browser console (F12) for JavaScript errors
```

---

## 🎨 Customize Your App

### Change Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  cosmic: {
    pink: '#YOUR_COLOR',    // Change these!
    purple: '#YOUR_COLOR',
    blue: '#YOUR_COLOR',
  }
}
```

### Change Text

Edit `resources/js/Components/Hero.jsx`:
```javascript
<h1>Your Custom Title</h1>
<p>Your custom description</p>
```

### Add More NASA APIs

Edit `app/Services/NasaApiService.php` to add more endpoints!

---

## ✅ Deployment Checklist

When ready to deploy:

```bash
# Build for production
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Update .env
APP_ENV=production
APP_DEBUG=false
```

---

**That's it! You're ready to explore the cosmos! 🚀🌌**

Remember to star the repo and share your customizations!
