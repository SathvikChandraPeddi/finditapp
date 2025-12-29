# 🚀 Deployment Guide for FindIt AI

Complete step-by-step guide to deploy FindIt AI to production.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [x] Completed Supabase setup (database + storage + policies)
- [x] Tested app locally with real Supabase credentials
- [x] Git repository initialized
- [x] GitHub account (or GitLab/Bitbucket)
- [x] Vercel account (free tier works)

## 🔧 Step 1: Prepare Your Code

### 1.1 Verify Environment Variables

Your `.env` file should look like this:

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ CRITICAL:** Never commit the `.env` file to Git!

### 1.2 Check .gitignore

Verify your `.gitignore` includes:

```
.env
.env.local
.env.production
node_modules/
dist/
```

### 1.3 Test Production Build Locally

```bash
# Build the production version
npm run build

# Preview the production build
npm run preview
```

Visit `http://localhost:4173` and test all features.

## 📤 Step 2: Push to GitHub

### 2.1 Initialize Git (if not done)

```bash
git init
git add .
git commit -m "Initial commit - FindIt AI ready for deployment"
```

### 2.2 Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it `findit-ai` (or your preferred name)
3. Keep it public or private (your choice)
4. Do NOT initialize with README (we already have one)
5. Click "Create repository"

### 2.3 Push Code

```bash
git remote add origin https://github.com/yourusername/findit-ai.git
git branch -M main
git push -u origin main
```

## 🌐 Step 3: Deploy to Vercel

### 3.1 Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Click "Import"

### 3.2 Configure Build Settings

Vercel should auto-detect these settings:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**If not auto-detected**, set them manually.

### 3.3 Add Environment Variables

In the "Environment Variables" section:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

**Environment Selection:**
- ✅ Production
- ✅ Preview
- ✅ Development

### 3.4 Deploy

1. Click "Deploy"
2. Wait 1-3 minutes for build
3. Your app is live! 🎉

You'll get a URL like: `https://findit-ai-xxxxx.vercel.app`

## 🔐 Step 4: Configure Supabase for Production

### 4.1 Add Vercel URL to Supabase Auth

1. Go to Supabase Dashboard
2. Navigate to **Authentication > URL Configuration**
3. Add your Vercel URL:
   - **Site URL:** `https://your-app.vercel.app`
   - **Redirect URLs:** 
     - `https://your-app.vercel.app/**`
     - `https://your-app.vercel.app/auth/callback`

### 4.2 Test Authentication Flow

1. Open your Vercel URL
2. Click "Sign Up"
3. Create a test account
4. Verify email (check inbox/spam)
5. Sign in and test all features

## ✅ Step 5: Post-Deployment Testing

### Test Checklist

Run through these tests on your live site:

#### Authentication
- [ ] Sign up with new email
- [ ] Receive verification email
- [ ] Sign in with credentials
- [ ] Sign out
- [ ] Error handling (wrong password, etc.)

#### Add Item
- [ ] Add item without image
- [ ] Add item with image (< 5MB)
- [ ] Try uploading invalid file (should fail gracefully)
- [ ] Try uploading large file (should show error)
- [ ] Verify item appears in Stored Items

#### Find Item
- [ ] Search for item by name
- [ ] Search with natural language ("Where are my keys?")
- [ ] Try voice input (if supported)
- [ ] Search for non-existent item (should show clear message)
- [ ] Test with multiple matches

#### Stored Items
- [ ] View all items
- [ ] Delete item (with confirmation)
- [ ] Verify image is deleted from storage
- [ ] Empty state displays correctly

#### Edge Cases
- [ ] Test on mobile device
- [ ] Test on tablet
- [ ] Test with slow network (throttle in DevTools)
- [ ] Test with network offline (should show errors)

## 🔄 Step 6: Setup Automatic Deployments

Vercel automatically deploys on every Git push!

### Configure Deployment Branches

In Vercel project settings:

1. Go to **Settings > Git**
2. Set **Production Branch:** `main`
3. Enable **Preview Deployments** for pull requests
4. Save

Now every push to `main` = instant deployment! 🚀

### Preview Deployments

For testing before production:

```bash
# Create a feature branch
git checkout -b feature/new-feature

# Make changes and push
git push origin feature/new-feature
```

Vercel creates a preview URL for testing.

## 🎯 Step 7: Custom Domain (Optional)

### Add Custom Domain

1. Go to Vercel project **Settings > Domains**
2. Add your domain (e.g., `findit-ai.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-60 minutes)

### Update Supabase URLs

Add custom domain to Supabase Auth:
- Site URL: `https://findit-ai.com`
- Redirect URLs: `https://findit-ai.com/**`

## 📊 Step 8: Monitoring & Analytics

### Vercel Analytics (Free)

1. Go to project **Analytics** tab
2. View page views, performance metrics
3. Monitor Web Vitals

### Supabase Monitoring

1. Go to Supabase **Database > Reports**
2. Monitor:
   - Database size
   - Storage usage
   - API requests
   - Active users

### Set Up Alerts

1. In Vercel: **Settings > Alerts**
2. Configure:
   - Build failure notifications
   - Performance degradation alerts
   - Custom webhooks

## 🔄 Step 9: Continuous Deployment Workflow

### Development Flow

```bash
# 1. Create feature branch
git checkout -b feature/awesome-feature

# 2. Make changes
# ... code ...

# 3. Test locally
npm run dev

# 4. Push to GitHub
git add .
git commit -m "Add awesome feature"
git push origin feature/awesome-feature

# 5. Vercel creates preview deployment automatically

# 6. Test preview URL

# 7. Merge to main via GitHub PR
# 8. Vercel deploys to production automatically!
```

## 🐛 Troubleshooting Deployment Issues

### Build Fails

**Error: "Module not found"**
```bash
# Fix: Ensure all dependencies in package.json
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

**Error: "Environment variable not set"**
- Check Vercel environment variables spelling
- Ensure they're prefixed with `VITE_`
- Redeploy after adding variables

### Runtime Errors

**Images not loading**
- Verify storage bucket is public
- Check storage policies in Supabase
- Ensure CORS is configured

**Authentication fails**
- Verify Vercel URL in Supabase Auth settings
- Check anon key is correct in Vercel env vars
- Clear browser cache and try again

**Database queries fail**
- Verify RLS policies are created
- Check table permissions
- Review Supabase logs

### Performance Issues

**Slow initial load**
```bash
# Analyze bundle size
npm run build

# Check dist folder size
du -sh dist/
```

**Images too large**
- Implement image optimization
- Use WebP format
- Add lazy loading

## 🎓 Best Practices

### Security
- ✅ Never commit `.env` files
- ✅ Use anon key only in frontend
- ✅ Enable RLS on all tables
- ✅ Regularly rotate API keys
- ✅ Monitor Supabase logs for suspicious activity

### Performance
- ✅ Optimize images before upload
- ✅ Implement lazy loading
- ✅ Use Vercel Edge Network (automatic)
- ✅ Monitor Core Web Vitals

### Maintenance
- ✅ Keep dependencies updated
- ✅ Monitor error logs
- ✅ Backup database regularly (Supabase handles this)
- ✅ Test after each deployment

## 🆘 Getting Help

### Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev)

### Support Channels
- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
- GitHub Issues: Your repository issues page

## 📈 Next Steps

After successful deployment:

1. ✅ Share your app with users
2. ✅ Gather feedback
3. ✅ Monitor usage and errors
4. ✅ Plan feature updates
5. ✅ Scale as needed

## 🎉 Congratulations!

Your FindIt AI app is now live and accessible worldwide! 🌍

---

**Remember:** Every push to `main` = instant deployment. Code responsibly! 🚀
