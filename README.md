# Fitness Tracker

A minimalist, terminal-style workout tracking app with progressive overload tracking and automatic weight suggestions.

## Features

- **Auto-rotating workout schedule**: Push → Pull → Lower A → Upper A → Lower B
- **Progressive overload tracking**: Automatically suggests +2.5 lbs when you complete all sets
- **Session timer**: Tracks your workout duration with pause/resume
- **Weight persistence**: Remembers your last used weights for each exercise
- **Streak tracking**: Shows your current workout streak
- **Markdown export**: Export your complete workout history
- **Terminal aesthetic**: Clean, minimal design inspired by classic terminals

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Deploy to Netlify

### Option 1: Drag and Drop
1. Run `npm install` then `npm run build`
2. Drag the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)

### Option 2: Git-based Deployment
1. Push this code to a GitHub repository
2. Connect your repository to Netlify
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Option 3: Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

## Usage

- **Calendar View**: Click any day to start that workout
- **Today's Workout**: Quick start button for today's scheduled workout
- **During Workout**: 
  - Check off sets as you complete them
  - Use +/- buttons to adjust weights (2.5 lb increments)
  - Timer runs automatically, pause if needed
- **Complete Workout**: App will suggest weight increases if you completed all sets
- **Export**: Download your workout history as markdown

## Data Storage

All data is stored locally in your browser's localStorage:
- Workout history
- Weight progression
- Streak tracking

No account needed, no backend required!

## Customization

Edit `src/data/workouts.js` to modify:
- Exercise lists
- Set/rep schemes
- Workout rotation schedule
