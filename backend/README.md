# SpotIt Backend API

A comprehensive Node.js + Express + MongoDB backend for the SpotIt Citizen Issue Tracker application.

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Issue Management**: Create, track, and manage civic issues with automatic authority routing
- **Authority Routing**: Intelligent routing of issues to appropriate authorities based on category
- **Escalation System**: Automatic escalation of unresolved issues to higher authorities
- **Leaderboard & Gamification**: Points system, badges, and rankings for citizen engagement
- **Chatbot Integration**: Rule-based chatbot for user support and FAQs
- **Notifications**: Real-time notifications for issue updates, badges, and rank changes
- **Admin Dashboard**: Comprehensive admin tools for system management

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **Language**: TypeScript

## Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create a `.env` file based on `.env.example`:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. Update `.env` with your configuration:
   \`\`\`
   MONGODB_URI=mongodb://localhost:27017/spotit
   JWT_SECRET=your-secret-key
   PORT=5000
   \`\`\`

## Running the Server

### Development
\`\`\`bash
npm run dev
\`\`\`

### Production
\`\`\`bash
npm run build
npm start
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Issues
- `POST /api/issues` - Report new issue (protected)
- `GET /api/issues` - Get all issues with filtering
- `GET /api/issues/:id` - Get issue details
- `PUT /api/issues/:id` - Update issue status (protected)
- `GET /api/issues/user/:userId` - Get user's issues
- `GET /api/issues/authority/:authorityType` - Get authority's issues

### Authority
- `GET /api/authority` - Get all authorities
- `GET /api/authority/:id` - Get authority details
- `GET /api/authority/:authorityType/issues` - Get authority's assigned issues
- `POST /api/authority/:authorityType/assign/:issueId` - Assign issue to authority (protected)
- `POST /api/authority/escalate/:issueId` - Escalate issue (protected)
- `GET /api/authority/escalations/pending` - Get pending escalations
- `POST /api/authority/escalations/:escalationId/accept` - Accept escalation (protected)

### Leaderboard
- `GET /api/leaderboard/global` - Get global leaderboard
- `GET /api/leaderboard/city/:city` - Get city leaderboard
- `GET /api/leaderboard/rank/:userId` - Get user rank
- `GET /api/leaderboard/badges` - Get all badges
- `POST /api/leaderboard/badges/award` - Award badge (protected)
- `POST /api/leaderboard/check-badges/:userId` - Check and award badges (protected)
- `GET /api/leaderboard/achievements/:userId` - Get user achievements

### Chatbot
- `POST /api/chatbot/message` - Send message to chatbot (protected)
- `GET /api/chatbot/history` - Get chat history (protected)
- `PUT /api/chatbot/message/:messageId/helpful` - Mark message as helpful (protected)
- `GET /api/chatbot/stats` - Get chatbot statistics

### Notifications
- `GET /api/notifications` - Get user notifications (protected)
- `GET /api/notifications/unread/count` - Get unread count (protected)
- `PUT /api/notifications/:notificationId/read` - Mark as read (protected)
- `PUT /api/notifications/read/all` - Mark all as read (protected)
- `DELETE /api/notifications/:notificationId` - Delete notification (protected)
- `DELETE /api/notifications` - Clear all notifications (protected)

## Database Models

### User
- name, email, password, phone, city
- role (citizen, authority, admin)
- points, badges, issuesReported, issuesResolved
- profileImage, createdAt, updatedAt

### Issue
- title, description, category, severity
- location (latitude, longitude, address, city)
- reportedBy, assignedTo, assignedAuthority
- status, escalationLevel, slaDeadline
- images, timeline, createdAt, updatedAt

### Authority
- name, type, email, phone, city
- slaHours, escalationThreshold
- activeIssues, resolvedIssues, averageResolutionTime

### Leaderboard
- userId, points, rank, city, month

### Badge
- name, description, icon, criteria

### Notification
- userId, type, title, message
- issueId, relatedUserId, read, actionUrl

### ChatMessage
- userId, message, response, category, intent, helpful

## Environment Variables

\`\`\`
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/spotit
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
\`\`\`

## Error Handling

The API uses standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Security

- Passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- CORS is enabled for frontend communication
- Input validation on all endpoints
- Protected routes require valid JWT token

## Future Enhancements

- Email notifications
- SMS alerts for critical issues
- Real-time updates using WebSockets
- Advanced analytics and reporting
- Machine learning for issue categorization
- Mobile app support

## License

MIT
