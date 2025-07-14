# Munger's Compass

Munger's Compass is a web app that helps you evaluate purchases using Charlie Munger's rational investing principles. Provide an item's details and your optional financial profile to get a buy/don't-buy recommendation and potential cheaper alternatives.

<<<<<<< ours
## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development servers in separate terminals:
   ```bash
   npm run dev        # Next.js app on http://localhost:9002
   npm run genkit:dev # Genkit AI flows
   ```
3. Open `http://localhost:9002` and follow the prompts to analyze a purchase.
=======
To get started, take a look at `src/app/page.tsx`.

## Setup

This project relies on the Google Generative AI (Gemini) API via the
`@genkit-ai/googleai` plugin. You must supply an API key in a `.env` file before
the purchase advice features will work.

1. Copy `.env.example` to `.env`.
2. Add your Gemini API key to the `GEMINI_API_KEY` variable.

Without a valid API key the "Should I Buy It?" and "Find Cheaper Alternatives"
actions will fail with an error.
>>>>>>> theirs
