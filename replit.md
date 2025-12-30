# MetaLearn Registration Page

## Overview
A React-based student registration application with a multi-step form flow. The app includes registration, assessment, and success steps for enrolling students in the MetaLearn AI Native FullStack Developer program.

## Project Architecture
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Backend/Database**: Supabase (external)

## Project Structure
```
src/
├── components/
│   ├── AssessmentStep.tsx    # Assessment questions step
│   ├── ProgressBar.tsx       # Visual progress indicator
│   ├── RegistrationStep.tsx  # Student registration form
│   └── SuccessStep.tsx       # Completion confirmation
├── lib/
│   └── supabase.ts           # Supabase client configuration
├── types/
│   └── index.ts              # TypeScript type definitions
├── App.tsx                   # Main application component
├── main.tsx                  # Application entry point
└── index.css                 # Global styles
```

## Environment Variables
The following environment variables are required for Supabase integration:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Development
- Run `npm run dev` to start the development server on port 5000
- Run `npm run build` to build for production

## Deployment
- Static deployment with `dist` as the public directory
- Build command: `npm run build`
