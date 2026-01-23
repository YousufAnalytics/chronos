# Chronos

Chronos is a lightweight **request tracing and execution timeline tool** for backend developers.

It helps you **see what actually happened inside a request** — across controllers, services, async calls, and failures — without guessing, adding logs everywhere, or reproducing bugs locally.

Chronos focuses on:
- Clear execution flow
- Method-level tracing
- Error attribution (where & why it failed)
- Simple setup for Node.js / Nest.js apps

---

## 🚨 The Problem Chronos Solves

When a backend request fails or behaves unexpectedly, developers usually ask:
- Which service failed?
- In what order did methods execute?
- Where exactly did the error originate?
- Was it slow or blocked?
- Did the error happen before or after payment / DB / external API?

Logs are scattered. Stack traces are noisy. Debugging is slow.

**Chronos gives you a visual execution tree for every request.**

## 📦 Components

### 1. `chronos-tracer` (npm package)
- Emits trace events from your backend
- Provides decorators, middleware, and error helpers

### 2. Chronos Go CLI
- Runs the Chronos server
- Hosts UI
- Can start your backend automatically

## 🚀 Installation

### 1️⃣ Install Chronos Tracer (Backend)

```bash
npm install chronos-tracer

git clone https://github.com/YousufAnalytics/chronos.git

```

Open
```bash
chronos/internal/cli/root.go
```
Update the following sections

```bash
cmd := exec.Command("npm", "run", "start:dev")

cmd.Dir = `C:\path\to\your\nestjs-project`
```

This tells Chronos:
- How to start your nest app
- where your backend lives

## Visual UI

This tells Chronos:

```bash
http://localhost:7366
```
You will see
- Trace list
- Execution trees
- success and failure paths

Note : Data is currently in logs/ in memory

## 2 : Instrument your app

### install chronos tracer

```bash
npm install chronos-tracer
```

### initialize chronos once
call this during app bootstrap

```bash
import { initChronos } from 'chronos-tracer';

initChronos({
  service: 'orders-service',
  endpoint: 'http://localhost:7366/events'
});
```

### Register middleware
this creates a trace per request

```bash
import { ChronosMiddleware } from 'chronos-tracer';

app.use(ChronosMiddleware);
```

### Trace your methods
use @Trace() on controllers and services

```bash
import { Trace } from 'chronos-tracer';

@Trace('checkout')
async checkout(orderId: string) {
  await this.inventory.reserveItem(orderId);
  await this.payment.process(orderId);
}
```

Each traced method becomes a node in the execution tree


### Emits error correctly
Chronos does not auto-capture errors.
You must emit them explicitly.

```bash
import { errorFunction } from 'chronos-tracer';

try {
  await this.inventory.reserveItem(orderId);
} catch (err) {
  errorFunction(err);
  throw err;
}
```

### Global Exception Filter (Optional)

If you already use a Nest.js exception filter:

```bash
catch(exception: unknown) {
  errorFunction(exception);
  throw exception;
}
```

Chronos ensures errors are **emitted only once**, even if both service and filter call errorFunction

### Chronos tracer API

initChronos(config)
initialize chronos

```bash
initChronos({
  service: string,
  endpoint?: string
});
```

---

```bash
@Trace(name?: string)
```
creates a spam for methods

```bash
errorFunction(error)
```
Emits a error event safely

```bash
chronosMiddleWare
```
Creates request level trace context

---

### What to Try First

Create a simple API
Add @Trace() to:
- controller
- services
- external calls
  
Throw an error in one service

Open the UI and inspect the tree

You should clearly see:

- Execution order
- Failure location
- Partial execution

---
## Roadmap
- Persistent storage (DB)
- Search & filtering
- Performance metrics
- Packaged Go CLI
- OpenTelemetry compatibility

---

## License
MIT License

chronos is open core
the core will remain open source
