# 🦈 Shark Tech Voting

A modern **startup pitch voting platform** built with **Next.js, MongoDB, Clerk Authentication, and Tailwind CSS**.

Shark Tech allows participants to explore startup pitches, rate teams, and support their favorite ideas through a secure, one-vote-per-team voting system. Administrators can manage teams, control voting availability, monitor results, and remove teams from the competition.

> **Back the Bold. Sink the Ordinary.**

---

## ✨ Features

### 👥 For Voters

* 🔐 Secure authentication with **Clerk**
* 🏢 Browse all participating startup teams
* 📄 View individual startup pitch details
* ⭐ Rate teams from **1–5 stars**
* 🗳️ One vote per authenticated user for each team
* 🚫 Prevent duplicate voting
* 🔴 Real-time team voting status
* 📊 View total backers/votes
* 📱 Fully responsive interface
* 🔔 Toast notifications for voting actions and errors

### 🛠️ For Administrators

* 📊 Admin dashboard
* ➕ Add new startup teams
* 🔴 Start/stop voting for individual teams
* 🗑️ Delete teams
* 📈 Monitor total votes
* ⭐ Monitor team rating scores
* 🏆 Leaderboard-style team overview
* ⚡ Optimistic UI updates for admin actions

### 🎨 UI & UX

* Dark, modern **Shark Tank-inspired** interface
* Cyan + amber visual theme
* Responsive navigation
* Mobile-friendly menu
* Animated status indicators
* Hover and transition effects
* Glassmorphism-inspired cards
* Responsive tables and layouts
* `react-hot-toast` feedback notifications

---

## 🧰 Tech Stack

| Technology          | Purpose                          |
| ------------------- | -------------------------------- |
| **Next.js**         | Full-stack React framework       |
| **React**           | Frontend UI                      |
| **TypeScript**      | Type safety                      |
| **MongoDB**         | Database                         |
| **Clerk**           | Authentication & user management |
| **Tailwind CSS**    | Styling                          |
| **Lucide React**    | UI icons                         |
| **React Icons**     | Rating/star icons                |
| **React Hot Toast** | User notifications               |

---

## 🏗️ Project Architecture

The application follows a **Next.js App Router** architecture.

```text
Browser
   │
   ▼
Next.js App Router
   │
   ├── Server Components
   │      ├── Home
   │      ├── Teams
   │      ├── Team Details
   │      └── Dashboard
   │
   ├── Client Components
   │      ├── Navbar
   │      ├── VoteBox
   │      ├── AdminDashboard
   │      └── VoterDashboard
   │
   ├── API Routes
   │      ├── /api/teams
   │      ├── /api/teams/[id]
   │      ├── /api/teams/[id]/vote
   │      └── /api/settings
   │
   ▼
MongoDB
   │
   ├── teams
   ├── users
   └── settings
```

---

## 📂 Project Structure

```text
.
├── app/
│   ├── api/
│   │   ├── settings/
│   │   │   └── route.ts
│   │   │
│   │   └── teams/
│   │       ├── route.ts
│   │       └── [id]/
│   │           ├── route.ts
│   │           └── vote/
│   │               └── route.ts
│   │
│   ├── dashboard/
│   │   └── page.tsx
│   │
│   ├── teams/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── AdminDashboard.tsx
│   ├── Navbar.tsx
│   ├── SyncUser.tsx
│   ├── VoteBox.tsx
│   └── VoterDashboard.tsx
│
├── lib/
│   └── mongodb.ts
│
├── models/
│   ├── Team.ts
│   └── User.ts
│
├── public/
│
├── .env.local
├── package.json
└── README.md
```

---

## 🔐 Authentication

Authentication is handled using **Clerk**.

The application supports:

* User registration
* User login
* User profile management
* Authenticated voting
* Server-side authentication checks

Each authenticated Clerk user is synchronized with MongoDB through the `SyncUser` component.

Users are stored using their unique Clerk ID:

```ts
{
  clerkId: string,
  email: string,
  firstName: string | null,
  lastName: string | null,
  role: "voter" | "admin",
  createdAt: Date
}
```

---

## 🗳️ Voting System

The voting system is designed around **authenticated users**.

When a user votes:

1. Clerk verifies the user's identity.
2. The server checks whether the selected team exists.
3. The server verifies that voting is currently active for the team.
4. The server checks the team's `votedUsers` array.
5. If the user has already voted, the request is rejected.
6. Otherwise, the rating is added.
7. The vote count is increased.
8. The user's Clerk ID is added to `votedUsers`.
9. The team's average rating is recalculated.

### Rating

Users can give:

```text
⭐ 1
⭐ 2
⭐ 3
⭐ 4
⭐ 5
```

The average rating is calculated using:

```text
New Average =
(Current Average × Current Votes + New Rating)
÷ New Vote Count
```

The admin dashboard converts the 5-star average into a score out of 100:

```text
Score = Average Rating × 20
```

---

## 🗄️ MongoDB Collections

The application uses a MongoDB database named:

```text
SHARK_TECH_DB
```

### `teams`

Example document:

```js
{
  _id: ObjectId("..."),
  name: "Example Startup",
  description: "Startup pitch description...",
  votes: 25,
  averageRating: 4.4,
  isLive: true,
  votedUsers: [
    "user_xxxxxxxxx",
    "user_yyyyyyyyy"
  ],
  createdAt: ISODate("...")
}
```

### `users`

Example document:

```js
{
  _id: ObjectId("..."),
  clerkId: "user_xxxxxxxxx",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  role: "voter",
  createdAt: ISODate("...")
}
```

### `settings`

The project also supports a system settings document:

```js
{
  _id: "system_settings",
  votingIsLive: true
}
```

---

## 🔌 API Endpoints

### Teams

#### `GET /api/teams`

Returns all registered teams.

#### `POST /api/teams`

Creates a new team.

Example request:

```json
{
  "name": "Example Startup",
  "description": "Our startup pitch..."
}
```

---

### Team Management

#### `PATCH /api/teams/[id]`

Updates a team's voting status.

Example:

```json
{
  "isLive": true
}
```

#### `DELETE /api/teams/[id]`

Deletes a team from the database.

---

### Voting

#### `POST /api/teams/[id]/vote`

Submits a rating for a team.

Example request:

```json
{
  "rating": 5
}
```

The endpoint requires an authenticated Clerk user.

---

### System Settings

#### `GET /api/settings`

Returns the current global voting setting.

#### `POST /api/settings`

Updates the global voting setting.

Example:

```json
{
  "isLive": true
}
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

Navigate into the project:

```bash
cd YOUR_REPOSITORY
```

---

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

Or using pnpm:

```bash
pnpm install
```

---

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

> Never commit `.env.local` or expose your MongoDB connection string or Clerk secret key publicly.

---

### 4. Start the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🔑 User Roles

The application currently supports two roles:

```text
voter
admin
```

### Voter

A normal authenticated user can:

* Browse teams
* View pitches
* Rate teams
* Vote once per team
* Access the voter dashboard

### Admin

An administrator can:

* View the leaderboard
* Add teams
* Start/stop voting
* Delete teams
* Monitor votes
* Monitor rating scores

---

## 📊 Admin Dashboard

The administrator dashboard provides a centralized control panel containing:

```text
┌─────────────────────────────────────────────────────────┐
│              LEADERBOARD & CONTROLS                     │
├─────────────────────────────────────────────────────────┤
│ Startup       Votes       Score        Actions          │
│ ─────────────────────────────────────────────────────── │
│ Team Alpha      25         88.0        Start   Delete  │
│ Team Beta       19         92.0        Stop    Delete  │
│ Team Gamma      12         76.0        Start   Delete  │
└─────────────────────────────────────────────────────────┘
```

Administrators can control the voting state of each team independently.

---

## 📱 Responsive Design

The interface is designed for:

* 💻 Desktop
* 📱 Mobile
* 📟 Tablet

The navigation automatically switches to a mobile menu on smaller screens.

---

## 🎯 Main User Flow

```text
                    ┌───────────────┐
                    │     Home      │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │     Teams     │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  Team Pitch   │
                    └───────┬───────┘
                            │
                     User Logged In?
                       /          \
                     No            Yes
                     │              │
                     ▼              ▼
                  Log In       Check Vote
                                    │
                                    ▼
                              ┌─────────────┐
                              │ Rate 1–5 ⭐ │
                              └──────┬──────┘
                                     │
                                     ▼
                              Vote Recorded
```

---

## 🛡️ Voting Protection

The voting API performs server-side validation rather than relying only on the frontend.

It verifies:

* Authentication
* Team existence
* Team voting status
* Rating range
* Previous vote by the current user

A user's Clerk ID is stored in the team's `votedUsers` array to prevent duplicate votes.

---

## 🎨 Design Philosophy

The UI follows a dark, modern competition-style visual language inspired by startup pitch arenas.

### Primary Colors

```text
Background     → Slate 950
Primary        → Cyan
Accent         → Amber
Success        → Emerald
Danger         → Rose
Secondary      → Slate
```

The design uses:

* Gradient typography
* Glass-like cards
* Subtle borders
* Background radial glows
* Animated indicators
* Hover transitions
* Responsive layouts

---

## ⚡ Performance & Architecture

The project takes advantage of Next.js Server Components for database-driven pages.

Examples include:

* Home page team statistics
* Team listing
* Team details
* Dashboard role detection

Client Components are used where browser-side interaction is required, such as:

* Navigation menu
* Voting interface
* Admin controls
* Form handling
* Toast notifications

---

## 🧑‍💻 Development Highlights

This project demonstrates practical implementation of:

* Next.js App Router
* Server Components
* Client Components
* REST API routes
* MongoDB native driver
* Clerk authentication
* Role-based dashboard rendering
* Server-side authentication
* Protected voting logic
* Optimistic UI updates
* Dynamic MongoDB queries
* Responsive Tailwind CSS design
* TypeScript interfaces
* Error handling
* Toast-based user feedback

---

## 🔮 Future Improvements

Potential improvements for future versions include:

* [ ] Real-time leaderboard updates
* [ ] Global voting countdown timer
* [ ] Team logos and images
* [ ] Team search and filtering
* [ ] Advanced admin analytics
* [ ] Vote history
* [ ] Admin authentication middleware
* [ ] Stronger server-side role authorization for admin APIs
* [ ] Pagination for large numbers of teams
* [ ] Vote activity analytics
* [ ] Export voting results
* [ ] Deployment analytics
* [ ] Improved database indexing
* [ ] Rate limiting for API endpoints

---

## 🧪 Example Voting Scenario

Suppose a team currently has:

```text
Votes: 10
Average Rating: 4.2
```

A new authenticated user gives:

```text
Rating: 5
```

The new average becomes:

```text
(4.2 × 10 + 5) ÷ 11
= 4.27
```

The dashboard then displays:

```text
Score = 4.27 × 20
      = 85.4 / 100
```

---

## 🌐 Deployment

The project can be deployed using platforms that support Next.js applications and environment variables.

Before deployment, configure:

```env
MONGODB_URI=...

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...

CLERK_SECRET_KEY=...
```

Also make sure the production domain is configured correctly in your Clerk application settings.

---

## 🔒 Security Notes

Sensitive credentials should never be committed to GitHub.

Make sure `.gitignore` contains:

```gitignore
.env
.env.local
.env.*.local
node_modules
.next
```

Never expose:

```text
MONGODB_URI
CLERK_SECRET_KEY
```

in client-side code or public repositories.

##

---

## 👨‍💻 Author

**Habibur Rahman**

Full Stack Developer | React Developer | Aircraft Maintenance Engineering Student

### Skills

* React
* Next.js
* JavaScript
* TypeScript
* Node.js
* Express.js
* MongoDB
* Firebase
* Clerk
* Tailwind CSS

---

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

<p align="center">
  Built with ❤️ using Next.js, MongoDB & Clerk
</p>
