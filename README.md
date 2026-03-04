# RSSight – RSS Feed Reader with SEO & Growth Analytics

> Built for DevProjects · Tech Stack: React + Vite · Express.js · Python (Flask)

## Features
- Add unlimited RSS feed URLs (RSS 2.0 + Atom supported)
- Auto-parses feed XML using custom parser (no 3rd-party RSS lib on backend)
- Python microservice scores each article's **SEO quality** (readability, keyword density, title length)
- RAKE algorithm extracts **trending keywords** across all feeds
- **Analytics tab**: category breakdown, top keywords, SEO score chart
- **Growth Hacker Insights**: viral coefficient, content velocity, topical authority tips
- Dark mode · responsive · real-time search + filter

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js, fast-xml-parser |
| SEO Service | Python, Flask, textstat, RAKE-NLTK |

## Installation & Run

### 1. Backend (Express.js)
```bash
cd backend
npm install
npm run dev         # runs on http://localhost:4000
```

### 2. SEO Microservice (Python)
```bash
cd seo-service
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m nltk.downloader stopwords punkt
python app.py              # runs on http://localhost:5001
```

### 3. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev         # runs on http://localhost:5173
```

Open http://localhost:5173 and start adding RSS feeds!

## Deployment
- Frontend → Vercel (`vercel --prod` from /frontend)
- Backend → Railway or Render (set `PORT` env var)
- Python service → Railway or Fly.io

## License
MIT