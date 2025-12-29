# 🧠 FindIt AI - Never Forget Where You Put Things

<div align="center">

![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Powered-green?style=for-the-badge&logo=supabase)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)
![GSAP](https://img.shields.io/badge/GSAP-Animations-88CE02?style=for-the-badge)

**AI-powered memory assistant with a cinematic UI**

[Features](#-features) • [Quick Start](#-quick-start) • [Deployment](#-deployment) • [Tech Stack](#-tech-stack)

</div>

---

## 🎯 What is FindIt AI?

FindIt AI is a modern web application that helps you remember where you stored your items. Simply add an item with its location, and later ask "Where are my keys?" to find it instantly.

### The Problem
- Average person wastes **2.5 days per year** searching for lost items
- Mental fatigue from remembering hundreds of locations
- Constant "Where did I put it?" stress

### The Solution
- 📸 **Capture** - Take a photo of your item (optional)
- 📍 **Store** - Describe where you put it
- 🔍 **Recall** - Ask naturally and find it instantly

---

## ✨ Features

### 🎬 Cinematic Experience
- **Scroll-reactive animations** powered by GSAP ScrollTrigger
- **Smooth scrolling** with floating elements
- **Glass-morphism design** throughout
- **Responsive** on all devices
- **Mobile-optimized** (heavy effects disabled automatically)

### 🤖 Smart Search
- **Natural language queries** - "Where are my keys?"
- **Keyword extraction** from conversational input
- **Multiple match handling** with clarification UI
- **Voice input support** (browser-dependent)

### 🔐 Secure & Private
- **Row Level Security (RLS)** - Your data is yours alone
- **Supabase Authentication** with JWT tokens
- **Image storage** in secure buckets
- **User-scoped queries** - No data leakage

### 📱 Full-Featured
- Drag & drop image upload
- Image validation (type, size)
- Category tagging (optional)
- Delete with confirmation
- Real-time feedback
- Error handling with clear messages

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- Supabase account (free tier works)
- Git

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd finditapp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details and wait for setup to complete

#### Create Database Table

Run this SQL in Supabase SQL Editor:

```sql
-- Create items table
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_name TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own items"
  ON items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own items"
  ON items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items"
  ON items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own items"
  ON items FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX items_user_id_idx ON items(user_id);
CREATE INDEX items_created_at_idx ON items(created_at DESC);
```

#### Setup Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click **New Bucket**
3. Name it: `item-images`
4. Make it **Public**
5. Click **Create**

#### Add Storage Policies

In Storage > item-images > Policies, add these:

**Policy 1: Allow authenticated users to upload**
```sql
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'item-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**Policy 2: Allow public to view images**
```sql
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'item-images');
```

**Policy 3: Allow users to delete their own images**
```sql
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'item-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**⚠️ IMPORTANT:** 
- Only use the **anon (public) key** - never the service role key
- Get these from: Supabase Dashboard > Project Settings > API

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Deployment to Vercel

### Quick Deploy (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

1. Click the button above or go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click **Deploy**

### Manual Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
```

### Post-Deployment

Add your Vercel URL to Supabase:
1. Go to Supabase Dashboard > Authentication > URL Configuration
2. Add `https://your-app.vercel.app` to "Site URL"
3. Add `https://your-app.vercel.app/**` to "Redirect URLs"

📚 **Detailed deployment guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🏗️ Project Structure

```
finditapp/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Navigation bar
│   │   └── home/                   # Homepage sections
│   │       ├── CinematicHero.jsx
│   │       ├── CinematicProblem.jsx
│   │       ├── CinematicSolution.jsx
│   │       ├── CinematicHowItWorks.jsx
│   │       ├── CinematicFeatures.jsx
│   │       └── CinematicClosing.jsx
│   ├── pages/
│   │   ├── HomePage.jsx            # Landing page
│   │   ├── SignUpPage.jsx          # Registration
│   │   ├── SignInPage.jsx          # Login
│   │   ├── AddItemPage.jsx         # Add new items
│   │   ├── FindItemPage.jsx        # Search interface
│   │   └── StoredItemsPage.jsx     # View all items
│   ├── context/
│   │   └── AuthContext.jsx         # Authentication state
│   ├── lib/
│   │   ├── supabase.js            # Supabase client
│   │   ├── items.js               # Item CRUD operations
│   │   └── storage.js             # Image upload/delete
│   ├── App.jsx                    # Main app component
│   └── main.jsx                   # Entry point
├── .env                           # Environment variables (gitignored)
├── .env.example                   # Template for env vars
├── package.json
├── vite.config.js
├── README.md                      # This file
├── DEPLOYMENT.md                  # Deployment guide
└── SECURITY.md                    # Security guidelines
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **GSAP** - Scroll animations

### Backend
- **Supabase** - PostgreSQL database
- **Supabase Auth** - Authentication
- **Supabase Storage** - Image storage

### Deployment
- **Vercel** - Hosting (automatic deployments)

### Key Features
- JWT authentication
- Row Level Security (RLS)
- Natural language search
- Voice input support
- Drag & drop uploads

---

## 🔒 Security

This app follows Supabase best practices:

✅ **Row Level Security (RLS)** enabled on all tables  
✅ **User-scoped queries** - users only see their own data  
✅ **Anon key in frontend** - safe for public exposure  
✅ **Environment variables** for sensitive data  
✅ **File validation** - type and size checks  
✅ **Input sanitization** - all inputs validated  

❌ **Never use service role key** in frontend  
❌ **Never commit `.env` file** to Git  
❌ **Never disable RLS** on production tables  

📚 **Security guide:** See [SECURITY.md](./SECURITY.md)

---

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key | ✅ Yes |

**Note:** All Vite env variables must be prefixed with `VITE_`

---

## 🐛 Troubleshooting

### Common Issues

**"Invalid API key" error**
- Use **anon key**, not service role key
- Verify `.env` file exists in project root
- Restart dev server after changing `.env`

**Images not uploading**
- Verify bucket named `item-images` exists
- Check storage policies are created
- Ensure bucket is set to **Public**

**Can't see items after adding**
- Verify RLS policies are created correctly
- Check browser console for errors
- Ensure you're signed in

**Build fails on Vercel**
- Check environment variables are set in Vercel
- Verify all dependencies in `package.json`
- Review build logs for specific errors

---

## 📚 Documentation

- [Quick Start](#-quick-start) - Get running in 5 minutes
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [SECURITY.md](./SECURITY.md) - Security best practices
- [Supabase Docs](https://supabase.com/docs) - Database and auth
- [Vercel Docs](https://vercel.com/docs) - Deployment platform

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🙏 Acknowledgments

- Built with [Supabase](https://supabase.com)
- Deployed on [Vercel](https://vercel.com)
- Animations by [GSAP](https://greensock.com/gsap/) and [Framer Motion](https://www.framer.com/motion/)
- Icons from Emoji

---

## 📧 Support

- 📖 Check the [documentation](#-documentation)
- 🐛 [Open an issue](https://github.com/yourusername/finditapp/issues)
- 💬 Review existing issues for solutions

---

<div align="center">

**Made with ❤️ and modern web technologies**

[⬆ Back to top](#-findit-ai---never-forget-where-you-put-things)

</div>
