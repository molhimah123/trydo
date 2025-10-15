# TryDo - Simple Todo Webapp

A minimal, fast Todo Webapp built with Next.js 15 and Supabase for secure, real-time task management.

## Features

- ✅ User authentication (signup, signin, logout, password reset)
- ✅ Secure session management with JWT
- ✅ Row Level Security (RLS) for user data isolation
- ✅ Responsive UI with Tailwind CSS
- ✅ TypeScript support
- ✅ Comprehensive test suite

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS, Realtime)
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel (frontend) + Supabase (backend)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trydo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
   - Create a new Supabase project
   - Run the migration file: `supabase/migrations/001_initial_schema.sql`
   - This creates the tables and RLS policies

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   │   ├── signin/        # Login page
│   │   ├── signup/        # Registration page
│   │   └── reset/         # Password reset page
│   ├── app/               # Protected app dashboard
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   └── AuthProvider.tsx   # Authentication context
├── lib/                   # Utility libraries
│   └── supabase.ts        # Supabase client
└── middleware.ts          # Route protection

supabase/
└── migrations/            # Database migrations
    └── 001_initial_schema.sql

__tests__/                 # Test files
├── auth/
│   ├── signin.test.tsx
│   └── signup.test.tsx
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Database Schema

The app uses the following tables with Row Level Security:

- **profiles** - User profile information
- **tasks** - Todo items with status, priority, due dates
- **categories** - Task categories (optional)

All tables have RLS policies ensuring users can only access their own data.

## Authentication Flow

1. **Signup**: Users register with email/password
2. **Signin**: Users log in with credentials
3. **Session Management**: JWT tokens handled automatically
4. **Password Reset**: Email-based password reset
5. **Logout**: Secure session termination

## Testing

The project includes comprehensive tests:

- Unit tests for authentication components
- Integration tests for auth flows
- Form validation testing
- Error handling verification

Run tests with:
```bash
npm test
```

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Supabase)

1. Create Supabase project
2. Run database migrations
3. Configure RLS policies
4. Set up authentication settings

## Security Features

- Row Level Security (RLS) on all tables
- JWT-based authentication
- HTTPS enforcement
- Client-side input validation
- Secure password handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.
