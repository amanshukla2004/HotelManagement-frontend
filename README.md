# Roomly — Premium Hotel Booking & Management Platform

Roomly is a polished hotel discovery and management experience for modern travelers and property managers. It combines a premium guest journey with a powerful admin workspace, all wrapped in a clean, high-conversion interface.

<div align="center">
  <p><strong>Luxury stays • Smart operations • Fast bookings</strong></p>
</div>

## ✨ What Roomly offers

- Fast hotel discovery with rich search and availability flows
- Guided booking experience for guests from search to confirmation
- Admin tools for hotels, rooms, inventory, and reporting
- Secure authentication and profile-based guest management

## 🧭 Product overview

```mermaid
flowchart LR
    A([Guest lands on Roomly]):::start --> B[Search for hotels]:::main
    B --> C[View hotel details]:::main
    C --> D[Choose room & guests]:::main
    D --> E[Secure payment]:::highlight
    E --> F[Booking confirmed]:::success

    classDef start fill:#0F172A,stroke:#0284C7,color:#F8FAFC,stroke-width:2px;
    classDef main fill:#E0F2FE,stroke:#0284C7,color:#0F172A,stroke-width:1.5px;
    classDef highlight fill:#BFDBFE,stroke:#2563EB,color:#0F172A,stroke-width:1.5px;
    classDef success fill:#DCFCE7,stroke:#16A34A,color:#14532D,stroke-width:1.5px;
```

## 🏗️ Architecture

```mermaid
flowchart TB
    subgraph Frontend[Frontend]
        UI[React + Vite UI]:::ui
        Routes[Routes & Pages]:::ui
        State[Context + API layer]:::ui
    end

    subgraph Backend[Backend Services]
        Auth[Auth API]:::api
        Hotels[Hotel API]:::api
        Bookings[Booking API]:::api
    end

    UI --> Routes
    Routes --> State
    State --> Auth
    State --> Hotels
    State --> Bookings

    classDef ui fill:#EFF6FF,stroke:#2563EB,color:#0F172A,stroke-width:1.5px;
    classDef api fill:#F5F3FF,stroke:#7C3AED,color:#0F172A,stroke-width:1.5px;
```

## 🔄 Booking flow

```mermaid
sequenceDiagram
    participant G as Guest
    participant F as Roomly UI
    participant B as Booking API
    participant P as Payment Flow

    G->>F: Search hotels
    F->>B: Fetch availability
    B-->>F: Room options
    G->>F: Select stay
    F->>P: Create payment intent
    P-->>F: Payment success
    F->>B: Confirm reservation
    B-->>G: Booking details

    Note over G,F: Blue flow for guest discovery
    Note over F,B: Violet flow for availability checks
    Note over F,P: Sky flow for secure payments
```

## 🚀 Getting started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Environment

Create a .env file with:

```env
VITE_API_BASE_URL=http://localhost:9091
```

## 📁 Project structure

```text
src/
├── api/          # API services
├── components/   # Reusable UI components
├── context/      # Auth and shared state
├── pages/        # Guest and admin pages
├── routes/       # Route configuration
└── utils/        # Helper functions
```

## 🎨 Brand direction

Roomly emphasizes clarity, calm luxury, and high-trust interactions. The interface leans on soft gradients, glassmorphism, and fast feedback loops to keep the experience feeling premium without being overwhelming.

---

Built with care for modern hospitality experiences.
