# PrepositionPal - AI-based Foundational Learning Platform

A colorful, interactive educational web application designed to help children learn English prepositions through fun drag-and-drop games and engaging quizzes.

## Features

- **Interactive Drag & Drop Quiz**: Learn prepositions by dragging a cute ball to different positions around a table
- **Colorful Cartoon Design**: Shinchan/Pokémon-inspired aesthetic with bright colors and playful animations
- **User Authentication**: Email/password and Google sign-in powered by Firebase
- **Class Selection**: Choose between Class 7 or Class 8
- **Progress Tracking**: Track quiz scores and learning progress
- **Educational Videos**: Embedded YouTube videos for additional learning
- **Help System**: Students can submit help requests with screenshots
- **Confetti Celebrations**: Reward successful quiz completion with animations
- **Responsive Design**: Works beautifully on tablets, desktops, and mobile devices

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom theme
- **UI Components**: shadcn/ui + Radix UI primitives
- **Animations**: Framer Motion + react-confetti
- **Drag & Drop**: @dnd-kit/core
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Icons**: lucide-react
- **Fonts**: Comic Neue, Bubblegum Sans

## Project Structure

```
preposition-pal/
├── app/
│   ├── class-select/       # Class selection page
│   ├── help/               # Help request form
│   ├── lessons/            # Lessons listing
│   ├── login/              # Authentication page
│   ├── quiz/               # Interactive quiz
│   ├── results/            # Quiz results with confetti
│   ├── videos/             # Educational videos
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   ├── AuthProvider.tsx    # Auth state provider
│   ├── DraggableQuiz.tsx   # Main quiz component
│   └── Navbar.tsx          # Navigation bar
├── lib/
│   ├── auth.ts             # Firebase auth functions
│   ├── firebase.ts         # Firebase initialization
│   └── utils.ts            # Utility functions
├── stores/
│   ├── authStore.ts        # Authentication state
│   └── quizStore.ts        # Quiz state management
├── types/
│   └── index.ts            # TypeScript type definitions
├── .env.local.example      # Environment variables template
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Firebase project set up
- npm or yarn package manager

### Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the steps
   - Give your project a name (e.g., "PrepositionPal")

2. **Enable Authentication**
   - In Firebase Console, go to "Authentication" > "Sign-in method"
   - Enable "Email/Password" provider
   - Enable "Google" provider
   - Add your domain to authorized domains (localhost is pre-authorized)

3. **Create Firestore Database**
   - Go to "Firestore Database" > "Create database"
   - Choose "Start in test mode" for development
   - Select a location close to your users

4. **Set up Firestore Rules** (for production)
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /quizAttempts/{attemptId} {
         allow read, write: if request.auth != null;
       }
       match /helpRequests/{requestId} {
         allow create: if request.auth != null;
         allow read, update: if request.auth != null;
       }
     }
   }
   ```

5. **Set up Firebase Storage**
   - Go to "Storage" > "Get started"
   - Start in test mode for development
   - Set up Storage rules:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /help-screenshots/{userId}/{fileName} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

6. **Get Firebase Configuration**
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click "Web" icon (</>) to add a web app
   - Register your app with a nickname
   - Copy the Firebase configuration object

### Installation

1. **Clone or download the repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Building for Production

```bash
npm run build
npm start
```

## Features Breakdown

### Landing Page (/)
- Hero section with animated stars
- "Start Learning" call-to-action
- Feature cards showcasing key benefits

### Authentication (/login)
- Email/password registration and login
- Google sign-in integration
- Form validation with error messages
- Smooth animations

### Class Selection (/class-select)
- Choose between Class 7 or Class 8
- Colorful animated cards
- Progress saved to Firestore

### Lessons (/lessons)
- Browse available lessons
- "Prepositions of Place - Level 1" is unlocked
- Future lessons shown as locked

### Quiz (/quiz)
- 2 interactive drag-and-drop questions
- Visual table with drop zones (on, in, under, beside, above)
- Cute ball character to drag
- Immediate feedback with animations
- Progress tracking (Question X of 2)
- Score counter

### Results (/results)
- Final score with percentage
- Confetti animation for scores ≥ 70%
- Encouraging messages based on performance
- Review of all answers
- Options: Next Lesson, Watch Videos, or Try Again
- Quiz attempt saved to Firestore

### Videos (/videos)
- Embedded YouTube videos about prepositions
- Responsive video players
- Option to retry quiz after watching

### Help (/help)
- Contact form with message textarea
- Screenshot upload capability
- Form validation
- Submissions saved to Firestore
- Success confirmation animation

## Color Palette

- **Bright Red**: #FF3B5C
- **Sunny Yellow**: #FFEB3B
- **Sky Blue**: #40C4FF
- **Lime Green**: #4ADE80

## Fonts

- **Primary**: Comic Neue (Google Fonts)
- **Secondary**: Bubblegum Sans (Google Fonts)

## State Management

### Auth Store (Zustand)
- User authentication state
- Loading states
- Login/logout actions

### Quiz Store (Zustand)
- Current question index
- User answers
- Score tracking
- Quiz completion state

## Firebase Collections

### users
```typescript
{
  uid: string
  email: string
  displayName: string
  photoURL: string | null
  selectedClass: 7 | 8
  createdAt: Date
}
```

### quizAttempts
```typescript
{
  userId: string
  score: number
  correctAnswers: number
  totalQuestions: number
  answers: Answer[]
  timestamp: Date
  classLevel: 7 | 8
}
```

### helpRequests
```typescript
{
  userId: string
  userName: string
  userEmail: string
  message: string
  screenshotUrl?: string
  status: "pending" | "resolved"
  timestamp: Date
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Tips

- The app uses Next.js 15 App Router
- All pages are client-side rendered with "use client" directive
- Firebase is initialized once and reused across the app
- Animations are performance-optimized with Framer Motion
- Drag and drop uses @dnd-kit for better touch support

## Contributing

This is an educational project. Feel free to fork and customize for your needs!

## License

ISC

## Support

For questions or issues, use the Help form within the application or contact the development team.

---

Built with ❤️ for young learners
