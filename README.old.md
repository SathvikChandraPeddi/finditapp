# 🧠 FindIt AI - Cinematic Memory Assistant

<div align="center">

![FindIt AI](https://img.shields.io/badge/FindIt-AI-4DD0E1?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![Python](https://img.shields.io/badge/Python-3.10-3776AB?style=for-the-badge&logo=python)
![AI](https://img.shields.io/badge/AI-Powered-FF6F00?style=for-the-badge)

**Never forget where you put things again**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Usage](#-usage)

</div>

---

## 🎯 What is FindIt AI?

FindIt AI is a **full-stack AI-powered web application** that helps you remember where you stored your personal items. It combines cutting-edge computer vision, natural language processing, and a cinematic scroll-driven user interface to create a premium memory assistant experience.

### The Problem
- People waste an average of **2.5 days per year** searching for misplaced items
- Mental exhaustion from remembering hundreds of object locations
- Constant "Where did I put it?" stress

### The Solution
- 📸 **Capture** - Take a photo of your item
- 📍 **Store** - Describe where you put it
- 🔍 **Recall** - Ask in natural language and find it instantly

---

## ✨ Features

### 🎬 Cinematic User Experience
- **Scroll-driven animations** powered by GSAP ScrollTrigger
- **Smooth scrolling** with Lenis
- **Parallax effects** and depth animations
- **Reactive background** that responds to scroll
- **Premium UI** with Framer Motion animations
- **Glassmorphism design** throughout

### 🤖 AI & Machine Learning
- **Object Detection** - YOLOv8 automatically identifies items in photos
- **Natural Language Processing** - Understand queries like "Where are my keys?"
- **Smart Search** - Keyword extraction and fuzzy matching
- **30%+ confidence threshold** for accurate detection

### 💾 Data Management
- **In-memory storage** - Fast access during runtime
- **Image storage** with automatic cleanup
- **Privacy focused** - Data only exists during session

### 📱 Responsive Design
- Works on desktop, tablet, and mobile
- Adaptive animations (lighter on mobile)
- Touch-friendly interface
- Voice input support (where available)

---

## 🎥 Demo

### Homepage Scroll Journey
1. **Hero** - Floating objects in memory space
2. **Problem** - Objects drift away into darkness
3. **Solution** - Scene sharpens, app reveals
4. **How It Works** - 3D interactive cards
5. **Live Demo** - Interactive upload simulation
6. **Features** - Parallax grid with hover effects
7. **Ending** - Calm, organized visualization

### Core Pages
- **Add Item** - Drag & drop image upload with live AI detection
- **Find Item** - Natural language search with voice input
- **Stored Items** - Beautiful card grid with image previews
- **About** - Project information and tech stack

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- 4GB+ RAM (for AI models)

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd findit-ai
```

### 2️⃣ Setup Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 3️⃣ Setup Backend

```bash
# Navigate to backend
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python app.py
```

Backend will run on `http://localhost:5000`

### 4️⃣ Open Application

Visit `http://localhost:3000` in your browser

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Component animations |
| **GSAP + ScrollTrigger** | Scroll-driven animations |
| **Lenis** | Smooth scrolling |
| **Axios** | HTTP client |

### Backend
| Technology | Purpose |
|------------|---------|
| **Python 3.10** | Backend language |
| **Flask** | Web framework |
| **SQLite** | Database |
| **YOLOv8** | Object detection |
| **Ultralytics** | Computer vision |
| **OpenCV** | Image processing |
| **PyTorch** | ML framework |

### AI/ML
- **YOLOv8 Nano** - Fast object detection
- **Custom NLP** - Keyword extraction & synonym matching
- **Fuzzy matching** - Flexible search

---

## 📖 Usage

### Adding an Item

1. Navigate to **Add Item** page
2. **Upload image** (drag & drop or click)
   - AI automatically detects the object
3. **Enter item name** (or use AI suggestion)
4. **Describe location** in natural language
5. Click **Save Item**

Example:
```
Item: House Keys
Location: Kitchen counter, near the coffee maker on the left side
```

### Finding an Item

1. Go to **Find Item** page
2. Type your query naturally:
   - "Where are my keys?"
   - "Find my wallet"
   - "Where did I put my phone charger?"
3. Click **Search** or use voice input 🎤
4. Get instant results with location and image

### Managing Items

1. Visit **Stored Items** page
2. View all saved items in a grid
3. Click **Edit** to modify details
4. Click **Delete** to remove (with confirmation)

---

## 📁 Project Structure

```
findit-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── home/
│   │   │       ├── HeroSection.jsx
│   │   │       ├── ProblemSection.jsx
│   │   │       ├── SolutionSection.jsx
│   │   │       ├── HowItWorksSection.jsx
│   │   │       ├── DemoSection.jsx
│   │   │       ├── FeaturesSection.jsx
│   │   │       └── EndingSection.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── AddItemPage.jsx
│   │   │   ├── FindItemPage.jsx
│   │   │   ├── StoredItemsPage.jsx
│   │   │   └── AboutPage.jsx
│   │   ├── hooks/
│   │   │   └── useSmoothScroll.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── models/
│   │   ├── object_detector.py    # YOLOv8 integration
│   │   └── nlp_processor.py      # NLP & keyword extraction
│   ├── uploads/                   # Stored images
│   ├── app.py                     # Flask server & routes
│   ├── requirements.txt
│   ├── findit.db                  # SQLite database
│   └── README.md
│
└── README.md                      # This file
```

---

## 🔌 API Endpoints

### Health Check
```http
GET /api/health
```

### Add Item
```http
POST /api/add_item
Content-Type: multipart/form-data

item_name: "House Keys"
location: "Kitchen counter"
image: [file]
```

### Find Item
```http
POST /api/find_item
Content-Type: application/json

{
  "query": "Where are my keys?"
}
```

### Get All Items
```http
GET /api/get_all_items
```

### Delete Item
```http
DELETE /api/delete_item/<id>
```

---

## 🎨 Design Philosophy

### Scroll as Memory
Scrolling through the homepage feels like **moving through memory** - from clarity to confusion to solution.

### Animation with Purpose
Every animation **supports meaning**:
- Objects drift away = forgetting
- Scene sharpens = remembering
- Breathing animation = calm organization

### Cinematic Quality
- Smooth transitions (1.2s duration)
- Easing curves that feel natural
- Z-axis depth for immersion
- Parallax for spatial awareness

---

## 🚀 Future Scope

- [ ] **Multi-user authentication** (JWT, OAuth)
- [ ] **Cloud sync** across devices
- [ ] **Mobile apps** (React Native)
- [ ] **Smart reminders** ("You haven't used X in 30 days")
- [ ] **Voice-only mode** for hands-free operation
- [ ] **Smart home integration** (Alexa, Google Home)
- [ ] **AR visualization** of item locations
- [ ] **Collaborative storage** for families
- [ ] **Advanced NLP** with transformers
- [ ] **Category auto-tagging**

---

## 🧪 Testing

### Test Object Detector
```bash
cd backend
python models/object_detector.py
```

### Test NLP Processor
```bash
cd backend
python models/nlp_processor.py
```

### Build for Production
```bash
# Frontend
npm run build
npm run preview

# Backend
# Use gunicorn or similar WSGI server
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

---

## 📝 Database Schema

```sql
CREATE TABLE items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_name TEXT NOT NULL,
    location TEXT NOT NULL,
    image_path TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🤝 Contributing

This is an academic project, but suggestions are welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is for educational purposes.

---

## 🙏 Acknowledgments

- **YOLOv8** by Ultralytics for object detection
- **GSAP** for incredible scroll animations
- **Framer Motion** for smooth React animations
- **Lenis** for buttery smooth scrolling
- **React** team for the amazing framework

---

## 👨‍💻 Author

Built with ❤️ as an academic project demonstrating:
- Full-stack development
- AI/ML integration
- Modern web design
- UX/UI best practices
- Cinematic web experiences

---

## 🐛 Known Issues

- YOLOv8 first load takes ~30 seconds (model download)
- Voice input only works in Chrome/Edge (Web Speech API)
- Large images (>10MB) may cause slow uploads
- Mobile animations are simplified for performance

---

## 💡 Tips

1. **Use descriptive locations** - "Kitchen counter near coffee maker" better than "kitchen"
2. **Take clear photos** - Good lighting = better AI detection
3. **Common items work best** - YOLOv8 trained on COCO dataset
4. **Natural queries** - Ask like you'd ask a person
5. **Regular cleanup** - Delete old items you no longer need

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with 🧠 and ☕

</div>
