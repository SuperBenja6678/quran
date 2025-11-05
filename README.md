# Quran Reader App

A minimalistic Quran reader application with AI-powered tafseer (explanation) functionality.

## Features

- 📖 Browse all 114 surahs
- 🔍 Search surahs by name or number
- ✨ Select individual ayahs
- 🤖 AI-powered tafseer using Gemini 2.5 Flash
- 📱 Responsive design

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Usage

1. **Browse Surahs**: On the main page, you'll see all 114 surahs. Use the search bar to find specific surahs.

2. **Select a Surah**: Click on any surah card to view its ayahs.

3. **Select an Ayah**: Click on any ayah to select it. The selected ayah will be highlighted.

4. **Get Tafseer**: After selecting an ayah, click the "Get AI Tafseer" button to receive an AI-generated explanation of the ayah.

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## API Keys

The app uses your Gemini API key stored in `src/utils/geminiApi.js`. Make sure to keep this secure and never commit it to public repositories.

## Technologies Used

- React 18
- Vite
- Al-Quran Cloud API (for Quran text)
- Google Gemini 2.5 Flash API (for AI tafseer)

