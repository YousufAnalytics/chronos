Chronos ⏱️

Execution Timeline Debugger for Developers

Chronos is a local-first developer tool that records what actually happened during a single request — step by step, in order, with meaning.

Instead of asking “what failed?”
Chronos answers “why it failed, where it failed, and in what order.”

Why Chronos?

Modern observability tools focus on:

metrics
averages
dashboards
infrastructure

Chronos focuses on:

one request
one execution
true order of operations
business-level debugging
Chronos is designed to help developers answer questions like:
Why did this order fail?
Which step was slow?
What happened before the error?
What exactly ran, and in what order?

Core Idea

Chronos records timeline events emitted by your application and reconstructs them into a human-readable execution flow.

Each request becomes a trace:
CreateOrder
 ├─ CheckInventory
 ├─ ProcessPayment
 └─ SaveOrder


Chronos is:

language-agnostic
local-first
developer-controlled

Current Architecture (MVP)
┌──────────────┐
│  Chronos CLI │  (Go)
│              │
│  • Starts app│
│  • Receives  │◀── Node.js service
│    events    │
│  • Stores    │
│    events    │
└──────┬───────┘
       │
       ▼
   events.log


Components
1. Chronos CLI (Go)

Starts the target service (Node.js for now)
Injects environment variables
Exposes an /events HTTP endpoint
Persists incoming events to a file (events.log)

2. Application SDK (Node.js)

Emits structured events during request execution
Sends events to the Chronos CLI endpoint
Supports trace-level correlation

Event Model (Current)

Each event is a structured JSON object:
{
  "trace_id": "order-123",
  "service": "order-service",
  "operation": "CheckInventory",
  "type": "start | end | log | error",
  "timestamp": "ISO-8601"
}

Events are appended line-by-line to events.log.

Getting Started (Local)
1. Run Chronos CLI

go run cmd/chronos/main.go run

This will:

Start the Chronos event recorder

Launch the Node.js service

Inject required environment variables

2. Hit the Node API
POST /orders

Chronos will record the execution timeline for that request.


Design Principles

Request-first, not metrics-first
Explain failures, don’t just report them
Minimal developer effort
Local-first, cloud-optional

Status

🚧 Early-stage / Experimental

Chronos is under active development.
APIs and data formats may change.


🤝 Contributing

This project is in its infancy.
Ideas, feedback, and discussions are welcome.
