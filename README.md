# Find and Be Found

A minimalist web platform where users can create profiles and find others based on their interests, location, and projects using natural language search powered by Gemini AI.

## Features

- Beautiful, responsive form for profile creation
- Natural language search using Gemini AI
- Clean, modern UI with smooth animations
- Real-time search results
- Easy profile management

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: Supabase
- AI: Gemini API

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000` in your browser

## Project Structure

```
find-and-be-found/
├── backend/
│   ├── config/
│   │   └── supabaseClient.js
│   ├── routes/
│   │   ├── submitProfile.js
│   │   └── search.js
│   ├── utils/
│   │   └── gemini.js
│   ├── server.js
│   └── .env
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── README.md
└── package.json
```

## API Endpoints

- `POST /api/profiles` - Create a new profile
- `POST /api/search` - Search for profiles using natural language

## Contributing

Feel free to submit issues and enhancement requests! 