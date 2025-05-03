# Stamurai Task Management System

A modern, full-stack task management system built with Next.js, TypeScript, and Prisma.

## Features

- User Authentication and Authorization
- Task Management with CRUD operations
- Dashboard Overview with statistics
- Modern UI with Radix UI components
- Responsive design
- Real-time updates
- Task categorization and filtering

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Radix UI Components
- React Hook Form
- Prisma ORM
- NextAuth.js

### Backend
- Node.js
- Express.js
- Prisma ORM
- MongoDB Atlas
- bcryptjs for password hashing

## Project Structure

```
├── backend/                # Backend server code
├── frontend/              # Next.js frontend application
│   ├── app/              # Next.js app directory
│   ├── components/       # Reusable React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and configurations
│   └── styles/          # Global styles and theme
└── prisma/              # Prisma schema and migrations
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
cd frontend
npm install

cd ../backend
pnpm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the environment variables with your configuration

4. Run database migrations:

```bash
cd backend
npm prisma migrate dev
```

5. Start the development servers:

```bash
# In frontend directory
cd frontend
pnpm dev

# In backend directory
cd backend
pnpm dev
```

## Usage

1. Access the application at `http://localhost:3000`
2. Sign up or log in to your account
3. Create, view, edit, and delete tasks
4. Use the dashboard to track your progress

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
