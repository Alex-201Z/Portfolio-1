# Firebase Studio Portfolio

This is a Next.js starter project for a personal portfolio, built with Firebase Studio. It includes a complete admin system for managing projects, a gamer profile page fetching data from live APIs, and several AI-powered features using Genkit.

## Getting Started

To get the project up and running on your local machine, follow these steps.

### 1. Prerequisites

- Node.js (v18 or later)
- npm or yarn

### 2. Installation

First, clone the repository and install the necessary dependencies:

```bash
npm install
```

### 3. Environment Variables

This project requires API keys to run its various services (Firebase, Riot Games API, Steam API).

1.  Create a file named `.env` in the root of the project.
2.  Copy the contents of the example below into your new `.env` file.
3.  Replace the placeholder values with your actual API keys and IDs.

```env
# Riot Games API Key (for the Gamer page)
# Get one from https://developer.riotgames.com/
RIOT_API_KEY="RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# Steam API Key & ID (for the Gamer page)
# Get a key from https://steamcommunity.com/dev/apikey
# Find your Steam64ID using a tool like https://www.steamidfinder.com/
STEAM_API_KEY="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
STEAM_ID="7656119xxxxxxxxxx"

# The project uses a pre-configured Firebase project.
# The configuration is already in src/lib/firebase.ts.
# You can leave this part as is to use the default project,
# or replace it with your own Firebase project configuration if you wish.
```

### 4. Running the Development Servers

This project requires two separate development servers to be running simultaneously:

-   The **Next.js server** for the main application.
-   The **Genkit server** for the AI features (like the chatbot and image/idea generators).

**To run both servers, open two separate terminal windows.**

**In your first terminal**, run the Next.js development server:

```bash
npm run dev
```

This will start the web application, usually on `http://localhost:9002`.

**In your second terminal**, run the Genkit development server:

```bash
npm run genkit:watch
```

This will start the AI services that the Next.js application communicates with. The `--watch` flag automatically reloads the server when you make changes to the AI flow files.

Once both servers are running, you can open your browser to `http://localhost:9002` to see your portfolio in action!