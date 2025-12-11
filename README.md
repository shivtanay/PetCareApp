# Mythical Pet Sanctuary 🐉

A virtual pet game where you adopt and care for mythical creatures. Keep your pet happy, healthy, and watch it evolve!

## How to Run

### Local Development
1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Deploy to Render

**Option 1: One-Click Deploy**
1. Push your code to a GitHub repository
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New" → "Static Site"
4. Connect your GitHub repo
5. Render will auto-detect settings from `render.yaml`
6. Click "Create Static Site"

**Option 2: Manual Setup**
1. Create a new Static Site on Render
2. Connect your GitHub repo
3. Set these values:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add a rewrite rule: `/*` → `/index.html` (for React Router)

## Features

- **Adopt a Pet**: Choose from Dragon, Cerberus, Kitsune, or Phoenix
- **Care System**: Feed, play, rest, and clean your pet to keep stats up
- **Evolution**: Pets grow from Egg → Hatchling → Grown as they gain experience
- **Mini-Games**: Complete chores (trash sorting, window cleaning, wire matching) to earn coins
- **Tricks**: Teach your pet tricks like Spin, Dance, and Play Dead
- **Insurance**: Protect your pet from death with the insurance system
- **Expense Tracking**: View spending reports and manage your coins
- **Achievements**: Unlock achievements for milestones
- **Memorial System**: Honor deceased pets in the graveyard

## Controls

- Use the bottom navigation to switch between Home, Adopt, Care, and Graveyard pages
- Click action buttons to care for your pet
- Play mini-games from the Chores menu to earn coins
- Click the ? button for help anytime

## Tech Stack

- **React 18** - UI framework
- **Vite 5** - Build tool and dev server
- **Tailwind CSS 3** - Styling
- **Framer Motion 11** - Animations
- **React Router 6** - Page navigation
- **TanStack React Query 5** - Data fetching
- **Recharts 2** - Charts for expense reports
- **Lucide React** - Icons

## Project Structure

```
src/
├── pages/           # Main app pages
│   ├── Home.jsx
│   ├── PetAdopt.jsx
│   ├── PetCare.jsx
│   └── Graveyard.jsx
├── components/
│   ├── pet/         # Pet-related components
│   ├── games/       # Mini-game components
│   └── ui/          # Reusable UI components
├── api/             # API client for data
└── lib/             # Utility functions
```

## Credits & Attribution

### Libraries & Frameworks
- **React** - MIT License - https://react.dev
- **Vite** - MIT License - https://vitejs.dev
- **Tailwind CSS** - MIT License - https://tailwindcss.com
- **Framer Motion** - MIT License - https://www.framer.com/motion
- **Lucide Icons** - ISC License - https://lucide.dev
- **Recharts** - MIT License - https://recharts.org
- **TanStack Query** - MIT License - https://tanstack.com/query
- **React Router** - MIT License - https://reactrouter.com

### Icons & Graphics
- **Lucide React Icons** - Used for UI icons (buttons, navigation, actions) - ISC License
- **Unicode Emoji** - All pet graphics use standard Unicode emoji characters (🐉🦊🐕🦅🥚🍳 etc.) which are universally available and require no attribution

### Fonts
- Uses system default fonts via Tailwind CSS

### Backend
- **Base44** - API platform for data storage - https://base44.com

## Author

Created for educational purposes.
