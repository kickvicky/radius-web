# Radius

An anonymous, location-based social platform. Discover what's happening around you and connect with your local community in real-time.

## Features

- **The Pulse Feed** - Real-time, location-aware social feed
- **Anonymous Posting** - Share updates without revealing your identity
- **Location Tags** - Posts tagged with distance and area context
- **Interactive Voting** - Upvote/downvote community content
- **Post Categories** - LOCAL, TRENDING, ALERT, CAUTION tags

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Images**: Cloudinary (with URL-based optimization)
- **Typography**: Inter

## Design System

The UI follows the **Obsidian Precision** aesthetic:
- Primary accent: `#00FFCC` (Neon Mint)
- Background: `#1A1C1E`
- 12px border-radius for cards and buttons
- Sharp, utility-focused, tactical design

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Welcome page
│   └── pulse/
│       └── page.tsx      # The Pulse feed
├── components/
│   ├── feed/             # Feed components (FeedCard, FeedList, FeedHeader)
│   ├── layout/           # Layout components (Header, BottomNavigation, LocationBanner)
│   └── ui/               # Reusable UI (InteractionBar, PostImage)
├── data/
│   └── mock-feed.ts      # Mock data
└── types/
    └── feed.ts           # TypeScript types
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Routes

- `/` - Welcome/landing page
- `/pulse` - The Pulse feed

## License

Private
