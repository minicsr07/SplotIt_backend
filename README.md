# SpotIt - Civic Issue Tracker

A modern, full-stack civic issue tracking and management platform built with Next.js, React, MongoDB, and Node.js. Report, track, and resolve civic issues in your community with gamification and real-time updates.

## Features

- **Issue Reporting**: Submit civic complaints with photos, location, and category
- **Real-time Tracking**: Track complaint status with unique complaint IDs
- **Gamification**: Earn points and climb the leaderboard
- **Admin Dashboard**: Manage issues and user accounts
- **Multi-language Support**: English, Hindi, Spanish, French, German
- **AI Chatbot**: Get instant answers about civic issues
- **Notifications**: Real-time updates on issue status
- **Authority Routing**: Auto-assign issues to relevant authorities
- **Responsive Design**: Mobile-first, works on all devices

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas cloud)
- npm or yarn

### Installation

1. **Download the app**
   - Click the three dots (⋯) in the top right
   - Select "Download ZIP"
   - Extract the file

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Setup MongoDB**
   - Local: Install MongoDB Community Edition
   - Cloud: Use MongoDB Atlas (free tier available)

4. **Configure environment**
   Create `.env.local`:
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/spotit
   JWT_SECRET=your_secret_key_here
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   \`\`\`

5. **Run the app**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open in browser**
   http://localhost:3000

## Pages & Features

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Landing page with recent issues |
| Report Issue | `/report` | Submit new civic complaints |
| Track Complaint | `/track` | Search and track issues by ID |
| Dashboard | `/dashboard` | View all issues with statistics |
| Leaderboard | `/leaderboard` | Top contributors ranking |
| Chatbot | `/chatbot` | AI assistant for queries |
| Notifications | `/notifications` | Issue updates and alerts |
| Admin | `/admin` | Manage issues and users |

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login

### Issues
- `GET /api/issues` - Get all issues
- `POST /api/issues` - Create issue
- `GET /api/issues/[id]` - Get issue details
- `PATCH /api/issues/[id]` - Update issue
- `POST /api/issues/[id]/comments` - Add comment

### Leaderboard
- `GET /api/leaderboard` - Get top contributors

## Project Structure

\`\`\`
spotit-citizen-tracker/
├── app/
│   ├── api/                    # API routes
│   ├── page.tsx                # Home page
│   ├── report/                 # Report issue page
│   ├── track/                  # Track complaint page
│   ├── dashboard/              # Dashboard page
│   ├── leaderboard/            # Leaderboard page
│   ├── chatbot/                # Chatbot page
│   ├── admin/                  # Admin dashboard
│   └── layout.tsx              # Root layout
├── components/                 # React components
├── lib/
│   ├── db.ts                   # Database connection
│   ├── models/                 # Mongoose models
│   ├── api-client.ts           # API client utility
│   └── i18n.ts                 # Internationalization
├── public/                     # Static assets
├── .env.local                  # Environment variables
├── package.json                # Dependencies
└── README.md                   # This file
\`\`\`

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/spotit` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key_here` |
| `NEXT_PUBLIC_API_URL` | API base URL | `http://localhost:3000/api` |

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Go to vercel.com
3. Import repository
4. Add environment variables
5. Deploy

### Railway
1. Go to railway.app
2. Create new project
3. Connect GitHub
4. Add environment variables
5. Deploy

### Heroku
\`\`\`bash
heroku create your-app-name
heroku addons:create mongolab:sandbox
heroku config:set JWT_SECRET=your_secret_key
git push heroku main
\`\`\`

## Testing

### Test Reporting
1. Go to `/report`
2. Fill in the form
3. Submit and save complaint ID

### Test Tracking
1. Go to `/track`
2. Enter complaint ID
3. View status

### Test Admin
1. Go to `/admin`
2. View and manage issues

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env.local`
- For Atlas, whitelist your IP

### Port Already in Use
\`\`\`bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
\`\`\`

### Module Not Found
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

## Technologies Used

- **Frontend**: React 19, Next.js 16, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **UI Components**: shadcn/ui
- **Internationalization**: i18next

## Performance

- Server-side rendering for fast initial load
- API route caching
- Database indexing
- Optimized images
- Code splitting

## Security

- JWT authentication
- Password hashing with bcryptjs
- Environment variable protection
- Input validation
- CORS configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - Feel free to use for personal or commercial projects

## Support

For issues or questions:
1. Check SETUP.md for detailed setup instructions
2. Review DOWNLOAD_AND_RUN.md for troubleshooting
3. Check the code comments
4. Visit Next.js docs: https://nextjs.org/docs

## Roadmap

- Email notifications
- SMS alerts
- Mobile app (React Native)
- Google Maps integration
- Government API integration
- Advanced analytics
- Machine learning for issue categorization
