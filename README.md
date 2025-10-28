# Linkly · The 5-Minute Match

Linkly is a speed-dating style matchmaking experience that connects two people for a focused, timed conversation. Instead of ghosting or waiting days for a reply, Linkly pairs people who are ready to chat right now.

## Features

- **Profile onboarding** – Create and edit your Linkly profile with an auto-generated avatar, verification toggle, and rich matchmaking preferences (gender, age range, distance).
- **Instant matchmaking** – Jump into a live chat queue, filter matches based on your preferences, and get paired with a partner in seconds.
- **Five-minute chat rooms** – Each conversation runs on a bold countdown timer. Extend once per chat if the vibes are right, or let the clock decide.
- **Gemini-inspired icebreakers** – Every chat starts with a playful prompt to keep the conversation flowing.
- **Partner insights** – Peek at your partner’s full profile from the chat and review it again when the timer ends.
- **Post-chat decisions** – Choose to Match or go Next. Mutual matches are saved to your Friends list for future follow-up.
- **Theme aware** – Light and dark themes with a slick floating toggle.

## Tech stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) dev tooling
- [Tailwind CSS](https://tailwindcss.com/) for styling
- Context-based state management with localStorage persistence

## Getting started

```bash
pnpm install
pnpm dev
```

Or use `npm`/`yarn` if you prefer.

The app will be served at [http://localhost:5173](http://localhost:5173).

## Project structure

```
src/
  components/   # Shared UI atoms/molecules
  context/      # App-wide state container
  types/        # Shared TypeScript contracts
  utils/        # Mock data and helpers
  views/        # Screen-level UI
```

## Notes

- The Gemini icebreaker integration is simulated with a curated prompt list to keep the project runnable offline.
- Chat partner responses are currently scripted to mimic real-time typing while you explore the flow.

Enjoy quick, authentic conversations! ✨
