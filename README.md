# 🦈 Shark Tech

> **Discover. Rate. Recognize.**

Shark Tech is a modern full-stack voting platform built with **Next.js, TypeScript, and MongoDB**, designed to showcase participating teams and allow audiences to rate individual participants through a secure 1–5 star voting system.

The platform combines a clean, responsive user experience with a structured backend architecture for managing teams, participants, votes, ratings, and leaderboard statistics.

---

## ✨ Overview

Shark Tech allows an audience to:

* 🏢 Explore participating teams
* 👤 Discover individual participants
* 📖 Read team and participant descriptions
* ⭐ Rate participants from **1 to 5 stars**
* 📊 View real-time average ratings
* 🏆 Explore the leaderboard
* 🔐 Provide administrators with controlled management capabilities

Every vote is processed server-side and reflected in the participant's rating statistics.

---

## 🎯 Core Concept

```text
                    🦈 SHARK TECH
                          │
             ┌────────────┴────────────┐
             │                         │
           TEAMS                  LEADERBOARD
             │                         │
             ▼                         ▲
      Team Information                 │
             │                         │
             ▼                         │
       PARTICIPANTS                    │
             │                         │
             ▼                         │
        ⭐ 1 — 5 ⭐                      │
             │                         │
             ▼                         │
          VOTE ────────────────────────┘
```

The system maintains each participant's:

```text
Rating Sum
     +
Total Votes
     ↓
Average Rating
```

For example:

```text
Rating Sum = 442
Total Votes = 102

Average = 442 / 102
        = 4.33 ⭐
```

---

# 🚀 Features

## 👥 Participant Discovery

Browse all participants through a responsive card-based interface.

Each participant can have:

* Profile image
* Name
* Description
* Team association
* Average rating
* Total vote count

---

## 🏢 Team Profiles

Each team has its own profile containing:

* Team name
* Team description
* Logo
* Category
* Associated participants

```text
Team
│
├── Description
├── Logo
├── Category
│
└── Participants
      ├── Participant A
      ├── Participant B
      └── Participant C
```

---

## ⭐ Audience Voting

Audience members can rate participants using a simple 1–5 star interface.

```text
How would you rate this participant?

☆ ☆ ☆ ☆ ☆

          [ Submit Vote ]
```

Votes are processed through the backend rather than being calculated on the client.

---

## 📊 Dynamic Rating System

The backend maintains:

```text
ratingSum
totalVotes
averageRating
```

This allows rating statistics to be updated efficiently without recalculating every historical vote on every request.

### Example

```text
Existing:

ratingSum  = 437
totalVotes = 101

New vote:

★★★★★

Updated:

ratingSum  = 442
totalVotes = 102

Average:

442 / 102 = 4.33
```

---

## 🔄 Vote Updating

If a voter submits another rating for the same participant, the system updates the existing vote instead of creating another duplicate vote.

```text
Previous rating
      ↓
      5 ⭐

New rating
      ↓
      3 ⭐

ratingSum += 3 - 5
```

This keeps the statistics consistent.

---

## 🏆 Leaderboard

Participants can be displayed according to their average rating and voting statistics.

Example:

```text
┌──────┬─────────────────┬────────┬────────┐
│ Rank │ Participant     │ Rating │ Votes  │
├──────┼─────────────────┼────────┼────────┤
│  01  │ Participant A   │ 4.82 ⭐│ 312    │
│  02  │ Participant B   │ 4.71 ⭐│ 287    │
│  03  │ Participant C   │ 4.65 ⭐│ 241    │
└──────┴─────────────────┴────────┴────────┘
```

---

# 🏗️ Architecture

Shark Tech uses a **full-stack Next.js architecture**.

There is no need for a separate Express server.

```text
                         CLIENT
                           │
                           ▼
                    Next.js / React
                           │
             ┌─────────────┴─────────────┐
             │                           │
      Server Components          Client Components
             │                           │
             │                    Voting Interaction
             │                           │
             └─────────────┬─────────────┘
                           │
                           ▼
                  Next.js Route Handlers
                           │
                           ▼
                    Service Layer
                           │
                           ▼
                     Mongoose
                           │
                           ▼
                       MongoDB
```

---

# 🧩 Application Architecture

```text
src/
│
├── app/
│   ├── participants/
│   ├── teams/
│   ├── leaderboard/
│   ├── admin/
│   └── api/
│
├── components/
│   ├── participants/
│   ├── teams/
│   ├── voting/
│   └── leaderboard/
│
├── models/
│   ├── Team.ts
│   ├── Participant.ts
│   └── Vote.ts
│
├── services/
│   ├── team.service.ts
│   ├── participant.service.ts
│   └── vote.service.ts
│
├── validations/
│   ├── team.validation.ts
│   ├── participant.validation.ts
│   └── vote.validation.ts
│
├── lib/
│   ├── mongodb.ts
│   ├── auth.ts
│   └── utils.ts
│
├── types/
│   ├── team.ts
│   ├── participant.ts
│   └── vote.ts
│
└── hooks/
    └── useVote.ts
```

---

# 🗄️ Database Architecture

MongoDB contains three primary collections.

```text
                 MongoDB
                    │
       ┌────────────┼────────────┐
       │            │            │
       ▼            ▼            ▼
     Teams    Participants     Votes
       │            │            │
       │            │            │
       └────────────┴────────────┘
```

### Team

```json
{
  "_id": "team_id",
  "name": "Team Alpha",
  "description": "Innovative technology team",
  "logo": "image-url",
  "category": "Technology"
}
```

### Participant

```json
{
  "_id": "participant_id",
  "teamId": "team_id",
  "name": "Participant A",
  "image": "image-url",
  "description": "Participant description",
  "ratingSum": 442,
  "totalVotes": 102,
  "averageRating": 4.33
}
```

### Vote

```json
{
  "_id": "vote_id",
  "participantId": "participant_id",
  "voterIdentifier": "unique-voter-id",
  "rating": 5
}
```

---

# 🔐 Voting Integrity

The voting system is designed to prevent simple duplicate submissions.

A vote is uniquely associated with:

```text
voterIdentifier
       +
participantId
```

The database enforces this relationship through a compound unique index.

```text
┌───────────────────────┐
│ voterIdentifier       │
│ participantId         │
│ rating                │
└───────────────────────┘
```

This means the same voter cannot create unlimited duplicate votes for the same participant.

> For high-stakes production voting, additional protections such as authentication, rate limiting, CAPTCHA/bot protection, and identity verification can be introduced.

---

# ⚡ Efficient Rating Updates

Instead of recalculating every vote whenever someone submits a rating:

```text
❌ Inefficient

Fetch all votes
      ↓
Calculate sum
      ↓
Calculate average
      ↓
Save result
```

Shark Tech uses an incremental approach:

```text
✅ Efficient

New Vote
   ↓
ratingSum += rating
   ↓
totalVotes += 1
   ↓
averageRating = ratingSum / totalVotes
```

This keeps the voting operation efficient even as the number of votes grows.

---

# 🔌 API Architecture

## Participants

### Get all participants

```http
GET /api/participants
```

### Get participant

```http
GET /api/participants/:id
```

---

## Teams

### Get all teams

```http
GET /api/teams
```

### Get team

```http
GET /api/teams/:id
```

### Create team

```http
POST /api/teams
```

---

## Voting

### Submit vote

```http
POST /api/votes
```

Request:

```json
{
  "participantId": "participant_id",
  "rating": 5
}
```

Response:

```json
{
  "success": true,
  "message": "Your vote has been submitted.",
  "data": {
    "averageRating": 4.33,
    "totalVotes": 102
  }
}
```

---

# 🛡️ Validation

All incoming data is validated server-side using **Zod**.

Example:

```text
rating
 │
 ├── integer?       ✓
 ├── minimum 1?    ✓
 └── maximum 5?    ✓
```

Invalid requests are rejected before reaching the database.

---

# 🖥️ Frontend Architecture

The application uses Next.js Server Components wherever possible.

```text
Server Component
       │
       ├── Fetch MongoDB data
       │
       └── Render initial UI
                    │
                    ▼
             Client Component
                    │
                    ├── Star selection
                    ├── Vote submission
                    └── Interactive states
```

This keeps the amount of client-side JavaScript focused on areas that actually require interactivity.

---

# 🎨 User Experience

The interface is designed around a simple interaction model:

```text
Discover
   ↓
Explore Team
   ↓
View Participant
   ↓
Select ⭐
   ↓
Submit Vote
   ↓
See Updated Rating
```

The goal is to keep voting fast, clear, and frictionless.

---

# 🛠️ Tech Stack

| Technology                 | Purpose                    |
| -------------------------- | -------------------------- |
| **Next.js**                | Full-stack React framework |
| **TypeScript**             | Type-safe development      |
| **React**                  | UI development             |
| **MongoDB**                | Database                   |
| **Mongoose**               | MongoDB object modeling    |
| **Zod**                    | Runtime validation         |
| **Tailwind CSS**           | Styling                    |
| **Next.js Route Handlers** | Backend API                |
| **ESLint**                 | Code quality               |

---

# 📁 Project Structure

```text
shark-tech/
│
├── src/
│   │
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   │
│   │   ├── participants/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── teams/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── leaderboard/
│   │   │   └── page.tsx
│   │   │
│   │   ├── admin/
│   │   │
│   │   └── api/
│   │       ├── teams/
│   │       ├── participants/
│   │       └── votes/
│   │
│   ├── components/
│   │
│   ├── models/
│   │   ├── Team.ts
│   │   ├── Participant.ts
│   │   └── Vote.ts
│   │
│   ├── services/
│   │
│   ├── validations/
│   │
│   ├── lib/
│   │
│   ├── types/
│   │
│   └── hooks/
│
├── public/
│
├── .env.local
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/shark-tech.git
```

## 2. Navigate to the project

```bash
cd shark-tech
```

## 3. Install dependencies

```bash
npm install
```

## 4. Configure environment variables

Create:

```text
.env.local
```

Add:

```env
MONGODB_URI=your_mongodb_connection_string

ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

NODE_ENV=development
```

## 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🔑 Environment Variables

| Variable         | Description               |
| ---------------- | ------------------------- |
| `MONGODB_URI`    | MongoDB connection string |
| `ADMIN_USERNAME` | Admin username            |
| `ADMIN_PASSWORD` | Admin password            |
| `NODE_ENV`       | Application environment   |

> Never commit `.env.local` to GitHub.

---

# 📊 Voting Flow

```text
User
 │
 ▼
Participant Card
 │
 ▼
Participant Details
 │
 ▼
Select Rating
 │
 ▼
POST /api/votes
 │
 ▼
Zod Validation
 │
 ▼
Check Participant
 │
 ▼
Check Existing Vote
 │
 ├───────────────┐
 │               │
 ▼               ▼
New Vote       Existing Vote
 │               │
 ▼               ▼
Create         Update
 │               │
 └───────┬───────┘
         ▼
   Update Statistics
         │
         ▼
    MongoDB
         │
         ▼
 Updated Rating
         │
         ▼
      UI Update
```

---

# 🧠 Engineering Principles

Shark Tech follows several core engineering principles:

### Separation of Concerns

Database logic, business logic, validation, API routes, and UI components are separated.

### Server-Side Validation

Client-side validation improves UX, but server-side validation remains authoritative.

### Atomic Updates

Vote statistics are updated using MongoDB atomic operations.

### Type Safety

TypeScript is used throughout the application.

### Reusable Components

Common UI functionality is extracted into reusable components.

### Server-First Rendering

Next.js Server Components are preferred when client-side interactivity is unnecessary.

### Security by Design

Sensitive database credentials and administrative operations remain server-side.

---

# 🔮 Roadmap

### Phase 1 — Core Platform

* [x] Next.js architecture
* [x] MongoDB integration
* [x] Team model
* [x] Participant model
* [x] Vote model
* [x] Star rating system
* [x] Average rating calculation
* [x] Leaderboard

### Phase 2 — Administration

* [ ] Complete admin dashboard
* [ ] Team management
* [ ] Participant management
* [ ] Vote analytics
* [ ] Search and filtering
* [ ] Pagination

### Phase 3 — Security

* [ ] User authentication
* [ ] Rate limiting
* [ ] CAPTCHA / bot protection
* [ ] Stronger voting verification
* [ ] Audit logging

### Phase 4 — Advanced Experience

* [ ] Live leaderboard updates
* [ ] Voting analytics
* [ ] Rating distribution charts
* [ ] Participant comparison
* [ ] Competition phases
* [ ] Real-time statistics

---

# 📸 Screenshots

> Add project screenshots here once the UI is finalized.

### Homepage

```text
Coming soon...
```

### Participants

```text
Coming soon...
```

### Voting Interface

```text
Coming soon...
```

### Leaderboard

```text
Coming soon...
```

---

# 🌐 Deployment

The application can be deployed using a modern Next.js hosting platform.

Typical production architecture:

```text
                   Internet
                       │
                       ▼
                 Next.js App
                       │
            ┌──────────┴──────────┐
            │                     │
         Frontend              API
            │                     │
            └──────────┬──────────┘
                       │
                       ▼
                    MongoDB
```

---

# 🤝 Contributing

Contributions, ideas, and improvements are welcome.

```bash
git checkout -b feature/your-feature
```

Make your changes, commit them, and open a pull request.

---

# 📄 License

This project is currently intended as a personal/project showcase.

License information can be added when the project is officially released.

---

<div align="center">

## 🦈 Shark Tech

**Discover. Rate. Recognize.**

Built with Next.js · TypeScript · MongoDB

</div>
