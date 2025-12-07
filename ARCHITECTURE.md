# Complain Bot Platform Architecture

**Version:** 1.0.0
**Status:** Active

---

## 1. Executive Summary

The **Complain Bot Platform** is a civic engagement system designed to bridge the gap between citizens and local authorities in Sierra Leone. It leverages WhatsApp for accessible reporting and a modern web dashboard for administrative oversight. The system is architected as a set of loosely coupled services to ensure scalability, maintainability, and ease of deployment.

## 2. High-Level System Context

The following diagram illustrates the high-level interaction between the primary actors and system components.

```mermaid
graph LR
    subgraph "External Actors"
        Citizen(("Citizen<br>(WhatsApp User)"))
        Official(("Ministry Official<br>(Web User)"))
    end

    subgraph "Core System Components"
        Gateway["WhatsApp Gateway<br>(crow_WA)"]
        Agent["Agent Server<br>(server)"]
        DB[("Primary Database<br>(PostgreSQL)")]
        Dashboard["Ministry Dashboard<br>(client)"]
    end

    Citizen <-->|Messages| Gateway
    Gateway <-->|Webhooks| Agent
    Agent <-->|Prisma ORM| DB
    Dashboard <-->|API / Prisma| DB
    Official <-->|HTTPS| Dashboard

    classDef component fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef actor fill:#fff9c4,stroke:#fbc02d,stroke-width:2px;
    
    class Gateway,Agent,Dashboard,DB component;
    class Citizen,Official actor;
```

## 3. Component Specifications

The system is divided into three distinct functional units.

### 3.1 WhatsApp Gateway (`crow_WA`)

| Feature | Description |
| :--- | :--- |
| **Role** | Connectivity Layer |
| **Technology** | Node.js, `whatsapp-web.js`, Docker |
| **Responsibility** | Manages the connection to the WhatsApp network, handles QR code authentication, and forwards incoming messages to the Agent Server. |
| **Key Endpoints** | `POST /send-whatsapp`, `POST /webhook/whatsapp` |

### 3.2 Agent Server (`server`)

| Feature | Description |
| :--- | :--- |
| **Role** | Intelligence & Business Logic |
| **Technology** | Node.js, Express, OpenAI GPT-4, Prisma |
| **Responsibility** | Processes incoming messages, determines intent (Report, Upvote, Help), executes business logic via tools, and generates intelligent responses. |
| **Key Components** | `Complain BotAgent` (Orchestrator), `OpenAI` (Reasoning), `Tools` (Actions) |

### 3.3 Web Client (`client`)

| Feature | Description |
| :--- | :--- |
| **Role** | Visualization & Administration |
| **Technology** | Next.js 16, React, Tailwind CSS |
| **Responsibility** | Provides a public-facing view of community issues and a secured dashboard for ministry officials to manage and update problem status. |
| **Data Access** | **Public**: Server Components (Direct DB) <br> **Admin**: Client Components (API) |

## 4. Agent Logic & Data Flow

The Agent Server employs a reasoning loop to process complex user inputs.

```mermaid
sequenceDiagram
    autonumber
    participant User as Citizen
    participant Gateway as WhatsApp Gateway
    participant Agent as Agent Server
    participant AI as OpenAI (GPT-4)
    participant DB as Database

    User->>Gateway: Sends Message (Text/Media)
    Gateway->>Agent: POST /webhook/whatsapp
    
    rect rgb(240, 248, 255)
        note right of Agent: Reasoning Loop
        Agent->>AI: Send Conversation Context
        AI-->>Agent: Request Tool Execution (e.g., report_problem)
        
        alt Tool Execution Required
            Agent->>DB: Execute Database Operation
            DB-->>Agent: Return Result
            Agent->>AI: Send Tool Output
            AI-->>Agent: Generate Final Response
        else Direct Response
            AI-->>Agent: Generate Final Response
        end
    end

    Agent->>Gateway: POST /send-whatsapp
    Gateway->>User: Delivers Reply
```

## 5. Data Model (ERD)

The database schema is designed to support the core entities of the platform: Problems, Upvotes, and Media.

```mermaid
erDiagram
    PROBLEM ||--o{ PROBLEM_UPVOTE : "receives"
    PROBLEM ||--o{ PROBLEM_IMAGE : "contains"
    PROBLEM ||--o{ MEDIA : "has"

    PROBLEM {
        int id PK
        string title
        string description
        string location_text
        float latitude
        float longitude
        enum status "REPORTED, IN_PROGRESS, RESOLVED"
        int upvote_count
        datetime created_at
    }

    PROBLEM_UPVOTE {
        int problem_id FK
        string voter_phone PK
        datetime created_at
    }

    PROBLEM_IMAGE {
        int id PK
        int problem_id FK
        string url
        string mime_type
    }
```

---
*Confidential - Internal Use Only*
