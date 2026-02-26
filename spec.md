# Specification

## Summary
**Goal:** Build a two-player cooperative trivia quiz game where both players share a screen, answer questions together, and see their combined performance at the end.

**Planned changes:**
- Backend actor with a seeded question bank (20+ multiple-choice questions across Science, History, Sports, and Entertainment), game session management (player names, scores, question index, status), and functions to start, answer, advance, and reset a game
- Lobby screen with two player name inputs and a "Start Game" button (disabled until both names are filled)
- Game screen showing one question at a time with four answer buttons, current question number, category, and both players' scores; highlights correct/incorrect answers after selection and provides a "Next Question" button
- Results screen showing final scores, combined team score, a contextual performance message, and a "Play Again" button returning to the lobby
- Vibrant game-show-inspired visual theme: dark background, gold/teal/coral accents, bold typography, card-style panels, hover and selection animations, responsive layout for desktop and tablet

**User-visible outcome:** Two players can enter their names, play through 20 trivia questions together on one device, see live score updates, and receive a celebratory results summary with the option to play again.
