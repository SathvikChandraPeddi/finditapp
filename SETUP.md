# FindIt AI - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Frontend Dependencies
```bash
npm install
```

### Step 2: Setup Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Step 3: Run Both Servers

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python app.py
```

### Step 4: Open Application
Visit `http://localhost:3000` in your browser

---

## 📦 What Gets Installed

### Frontend (~500MB)
- React ecosystem
- Animation libraries (GSAP, Framer Motion)
- Tailwind CSS

### Backend (~2GB)
- Flask server
- YOLOv8 model (auto-downloads on first run)
- PyTorch & OpenCV

---

## 🎯 First Time Use

1. **Wait for YOLOv8 download** (~100MB, happens automatically)
2. **Go to "Add Item"** page
3. **Upload a test image** (keys, phone, wallet work well)
4. **See AI detect the object** automatically
5. **Add location** description
6. **Save and test search** on "Find Item" page

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9

# Backend (port 5000)
lsof -ti:5000 | xargs kill -9
```

### Python Virtual Environment Issues
```bash
# Delete and recreate
rm -rf backend/venv
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### YOLOv8 Not Downloading
```bash
# Manual download
cd backend
python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
```

### Module Not Found Errors
```bash
# Ensure you're in virtual environment
cd backend
source venv/bin/activate  # Should see (venv) in terminal
pip install -r requirements.txt --upgrade
```

---

## 📊 System Requirements

- **OS:** macOS, Windows, Linux
- **Node.js:** 18+ (check with `node --version`)
- **Python:** 3.10+ (check with `python3 --version`)
- **RAM:** 4GB minimum, 8GB recommended
- **Storage:** 3GB free space
- **Browser:** Chrome, Firefox, Safari, Edge (latest versions)

---

## 🔥 Quick Commands

```bash
# Start everything (in separate terminals)
npm run dev                          # Frontend
cd backend && python app.py          # Backend

# Build for production
npm run build                        # Frontend
npm run preview                      # Preview production build

# Test backend components
cd backend
python models/object_detector.py     # Test AI detection
python models/nlp_processor.py       # Test NLP

# Clean installation
rm -rf node_modules package-lock.json
npm install

cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## 📖 Next Steps

1. Read full [README.md](README.md) for detailed documentation
2. Check [backend/README.md](backend/README.md) for API details
3. Explore the code structure
4. Test all features
5. Customize for your needs

---

## 💡 Pro Tips

- Use **Chrome DevTools** to see network requests
- Check **Console** for any errors
- Backend logs show AI detection results
- First image upload takes longer (model initialization)
- Voice input only works in Chrome/Edge

---

## 🎓 For Academic Presentation

### Demo Flow
1. Show **homepage scroll experience** (impressive!)
2. Add an item with **image upload** (show AI detection)
3. Search using **natural language**
4. Show **stored items** page
5. Explain **tech stack** and AI models
6. Discuss **future scope**

### Key Talking Points
- Cinematic scroll-driven design
- Real AI integration (not simulated)
- Production-grade code structure
- Privacy-focused local storage
- Scalable architecture

---

**Questions? Check the main README or create an issue!** 🚀
