# 🏏 AI-Powered Sports Celebrity Reels

An AI-driven web application that generates and showcases engaging history reels of famous sports celebrities. Built with Next.js, OpenAI, Amazon Polly, Pexels, FFmpeg, and AWS S3.



---

## 🚀 Features

- 🎬 **AI-Generated Reels**: Generate 60-second videos using OpenAI-generated scripts and Polly-generated voiceovers.
- 🧠 **Script + Audio + Video Automation**: Fully automated pipeline from text → audio → slideshow video using FFmpeg.
- 📸 **Smart Image Fetching**: Uses Pexels API to fetch relevant images for each athlete.
- 🧊 **Video Storage**: Final videos and metadata are stored on AWS S3.
- 📱 **Mobile-First UI**: TikTok-style vertical reels layout with play/pause and scroll.
- ⚡ **Built with Next.js App Router**: Deployed seamlessly on Vercel.

---

## 🧑‍💻 Tech Stack

- **Frontend**: Next.js 13+ (App Router), Tailwind CSS
- **AI & TTS**: OpenAI GPT-4, Amazon Polly
- **Media**: FFmpeg (via fluent-ffmpeg), Pexels API
- **Storage**: AWS S3
- **Deployment**: Vercel

---

## 📂 Folder Structure
```bash
src/ ├── app/ │ ├── page.tsx # Landing page │ ├── reels/page.tsx # Reels view │ └── api/reels/ # API routes (list, generate) ├── components/Reels.tsx # Reels UI component ├── libs/ # Helpers (tts, s3, pexels, video generation) └── data/ # Optional: placeholder data
```

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-sports-reels.git
cd ai-sports-reels
```

### 2. Install dependencies

```bash
npm install
```
### 3. Add .env.local

```bash
OPENAI_API_KEY=your-openai-key
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=ai-celebrity-reels
PEXELS_API_KEY=your-pexels-api-key
```
 ### 4. Run locally
 
```bash
npm run dev
```
## 🧪 API Endpoints

```bash
GET /api/reels
```
Returns all available AI-generated video metadata.
```bash
GET /api/reels/[id]
```
Returns a single video by ID.

```bash
POST /api/reels/generate
```
Triggers the AI → Audio → Video → Upload pipeline.

```bash
{
  "celebrity": "MS Dhoni"
}
```
## 🧾 Deployment Notes
### ✅ Hosted on Vercel

#### ❌ FFmpeg is not available on Vercel — video generation handled locally or on a backend service.

#### Store metadata as JSON files in S3 for serverless-friendly querying.

## 🧠 Future Enhancements
### AI face animation using D-ID or DeepMotion

### Speech-to-subtitle rendering

### Public sharing and reactions

### Admin UI to trigger & moderate reel generation

## 📸 Credits
### OpenAI for script generation

### Amazon Polly for voice synthesis

### Pexels for sports imagery

### AWS S3 for media storage

### FFmpeg for video generation

## 📜 License
MIT License. © 2025 Ashutosh




