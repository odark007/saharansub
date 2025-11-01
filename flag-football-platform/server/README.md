# Flag Football Backend Server

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create `.env` file in `server/` folder:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5500
```

**Getting Supabase Keys:**
1. Go to Supabase Dashboard
2. Settings → API
3. Copy `URL`, `anon/public key`, and `service_role key`

### 3. Start Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### 4. Test Server

Open browser and visit:
- http://localhost:3000 - API info
- http://localhost:3000/health - Health check

## API Endpoints

### PDF Routes (`/api/pdf`)

**Upload PDF:**
```bash
POST /api/pdf/upload
Content-Type: multipart/form-data

Fields:
- pdf: PDF file
- name: Rulebook name (e.g., "NFL Flag")
- version: Version number (e.g., "2024")
```

**Check Status:**
```bash
GET /api/pdf/status/:rulebookId
```

### Admin Routes (`/api/admin`)

**List Rulebooks:**
```bash
GET /api/admin/rulebooks
```

**Get Rulebook Details:**
```bash
GET /api/admin/rulebooks/:id
```

**Delete Rulebook:**
```bash
DELETE /api/admin/rulebooks/:id
```

**Add Video:**
```bash
POST /api/admin/videos
Content-Type: application/json

{
  "ruleId": "uuid",
  "youtubeUrl": "https://youtube.com/watch?v=..."
}
```

**Get Error Reports:**
```bash
GET /api/admin/error-reports
```

**Update Error Report:**
```bash
PATCH /api/admin/error-reports/:id
Content-Type: application/json

{
  "status": "reviewed" | "resolved"
}
```

**Get Statistics:**
```bash
GET /api/admin/stats
```

## Testing PDF Upload

Use Postman or curl:

```bash
curl -X POST http://localhost:3000/api/pdf/upload \
  -F "pdf=@/path/to/rulebook.pdf" \
  -F "name=NFL Flag" \
  -F "version=2024"
```

## Project Structure

```
server/
├── index.js              # Main server file
├── package.json          # Dependencies
├── .env                  # Environment variables
├── routes/
│   ├── pdf.js           # PDF upload routes
│   └── admin.js         # Admin routes
├── services/
│   ├── supabase.js      # Supabase client
│   └── pdfParser.js     # PDF parsing logic
└── utils/
    └── helpers.js       # Helper functions
```

## Deployment to Netlify Functions

For production deployment, this server will need to be converted to Netlify Functions or deployed separately.

**Option 1: Deploy as separate service** (Recommended for Phase 1)
- Deploy to Render, Railway, or Heroku
- Update CORS to allow your Netlify frontend URL

**Option 2: Convert to Netlify Functions**
- Restructure as serverless functions
- Move to `/netlify/functions/` folder

## Troubleshooting

**Port already in use:**
```bash
# Change PORT in .env file or kill process
lsof -ti:3000 | xargs kill
```

**Supabase connection error:**
- Verify credentials in .env
- Check Supabase project is active
- Ensure service_role key has proper permissions

**PDF parsing fails:**
- Check PDF is not encrypted
- Verify file size under 10MB
- Check PDF structure is text-based (not scanned image)

## Notes

- Server uses ES modules (`"type": "module"` in package.json)
- All routes return JSON responses
- CORS enabled for development
- File uploads limited to 10MB
- PDF parsing is synchronous (will add async/queue in future phases)