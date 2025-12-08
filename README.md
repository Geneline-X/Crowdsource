# Crowsource Platform
Lay complain website: https://complainbot.vercel.app/

An intelligent WhatsApp-based civic crowdsourcing platform that allows citizens to report community problems and upvote them to signal priority to local councils and district authorities in Sierra Leone.

## Project Structure

This workspace contains the following modules:

- **[Client](./client)**: A Next.js web dashboard for visualizing reports, managing approvals, and viewing statistics.
- **[Server](./server)**: The core Node.js agent server that handles business logic, OpenAI integration for intent classification, and database interactions (Prisma + PostgreSQL).
- **[WhatsApp Gateway (crow_WA)](./crow_WA)**: A WhatsApp Web API server that manages the connection to WhatsApp, handles message sending/receiving, and media management.

## Getting Started

To get the entire platform running locally, you will need to set up each module individually. Please refer to the `README.md` in each subdirectory for specific instructions.

### Quick Links

- [Client README](./client/README.md)
- [Server README](./server/README.md)
- [WhatsApp Gateway README](./crow_WA/README.md)
