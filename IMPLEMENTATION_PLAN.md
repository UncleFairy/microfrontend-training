# React + Webpack Microfrontend Implementation Plan

## Goal

Create a small trading dashboard made of three independent React applications:

```text
Browser
└── Shell (host application, port 3000)
    ├── Trade Panel A (remote application, port 3001)
    └── Trade Panel B (remote application, port 3002)
```

The **shell** owns the page structure. The two **trade panels** are separate
applications that the shell loads when the page runs. This is the main idea of a
microfrontend: multiple teams can build and deploy parts of one user interface
independently.

## Step-by-step roadmap

### 1. Create the workspace foundation

**Status:** complete

Create one repository containing `apps/shell`, `apps/trade-panel-a`, and
`apps/trade-panel-b`. We use npm workspaces so one `npm install` installs the
dependencies for all applications.

**Why first?** Before microfrontends can work together, each application needs a
clear home and its own commands.

### 2. Build the shell as a normal React + Webpack app

**Status:** complete

Create a standalone dashboard application in `apps/shell`.

- Add React, React DOM, Webpack, Webpack Dev Server, TypeScript, and loaders.
- Configure Webpack to turn TypeScript and JSX source files into browser-ready
  JavaScript.
- Add `index.html`, `src/index.tsx`, and `src/App.tsx`.
- Run it on `http://localhost:3000`.
- Make a simple dashboard layout with placeholders for both panels.

**What we learn:** A host is still an ordinary React application. We should make
it work normally before asking it to load other applications.

### 3. Build Trade Panel A as a standalone app

**Status:** complete

Create `apps/trade-panel-a`, running on port 3001.

- Add an order-entry form: symbol, side, quantity, and price.
- Add a small list of mock open orders.
- Give it its own HTML page and React entry point so it can be opened and tested
  without the shell.

**What we learn:** A microfrontend must be useful and testable in isolation;
otherwise it is only a tightly coupled component in another project.

### 4. Build Trade Panel B as a standalone app

**Status:** complete

Create `apps/trade-panel-b`, running on port 3002.

- Add a market watchlist with sample prices.
- Let the user select an instrument, such as `AAPL` or `BTC-USD`.
- Keep its code and Webpack configuration separate from Panel A.

**What we learn:** Independent applications may have different features,
release schedules, and owners while still appearing together to a user.

### 5. Add Webpack Module Federation

**Status:** complete

Configure the panels as **remotes** and the shell as a **host**.

- Each panel exposes one React component through Module Federation.
- The shell declares where to load each remote application's `remoteEntry.js`.
- The shell loads both panels using `React.lazy` and `Suspense`.
- Configure `react` and `react-dom` as shared singleton dependencies.

**What we learn:** Module Federation downloads another application's code at
runtime. A new deployment of a panel can be used without rebuilding the shell,
as long as their public contract stays compatible.

### 6. Define communication contracts

**Status:** complete

Make the shell the coordinator for shared information.

- Panel B tells the shell when a symbol is selected.
- The shell stores the selected symbol.
- The shell passes that symbol to Panel A as a prop.
- Panel A uses it as the default order symbol and reports submitted orders back
  through a callback.

**What we learn:** Prefer explicit props and callbacks at first. They make data
flow visible and avoid a hidden global dependency between independently deployed
applications.

### 7. Handle remote failures and loading states

**Status:** complete

Add safe user-facing behaviour for operational problems.

- Show a loading message while a remote downloads.
- Wrap each remote in a React error boundary.
- Display a useful fallback when Panel A or Panel B is unavailable.
- Provide a retry action where practical.

**What we learn:** A remote can fail because of a bad deployment, a network
problem, or a cached old asset. One failed panel must not make the whole trading
dashboard unusable.

### 8. Introduce shared UI and type packages carefully

Create packages only for genuinely common code.

- A small shared design system: `Button`, `Card`, colours, and spacing.
- Shared trade domain types such as `Order` and `Instrument`.
- Keep business features inside the panel that owns them.

**What we learn:** Sharing everything removes independence. Share stable,
well-maintained primitives—not feature code that changes frequently.

### 9. Test each level

- Unit-test trade calculations and React components in each application.
- Test that each remote renders by itself.
- Add shell integration tests that verify both remotes load and communicate.
- Add an end-to-end test for selecting a symbol and submitting an order.

**What we learn:** Microfrontends add boundaries, so tests need to cover both
local behaviour and the integration between applications.

### 10. Prepare for independent deployment

- Build and publish each application separately.
- Configure remote URLs for local, test, and production environments.
- Use backward-compatible exposed component props.
- Add monitoring for remote-load errors and version information.

**What we learn:** Independent deployment is a key benefit, but it requires
release discipline and observability.

## Challenges we will actively address

| Challenge | Why it happens | Our approach |
| --- | --- | --- |
| Version incompatibility | The shell and remotes can deploy at different times. | Keep exposed props small, documented, and backward-compatible. |
| Duplicate React copies | Each app has dependencies of its own. Multiple React runtimes can break hooks and context. | Share `react` and `react-dom` as singleton dependencies. |
| Shared state coupling | A global store seems convenient, but makes panels dependent on hidden internal details. | Let the shell coordinate shared data through explicit contracts. |
| Inconsistent UI | Different teams can create different visual and accessibility patterns. | Add a small shared design system after the basics work. |
| Remote outage | A remote URL or deployment can fail at runtime. | Use loading fallbacks, error boundaries, and remote-specific recovery UI. |
| Slower first load | The browser must fetch multiple application bundles. | Keep remotes small and load them only when needed. |
| Harder debugging | A failure can be in the host, remote, server, CDN, or cached assets. | Use clear runtime error messages and record app versions. |
| Testing integration | Local unit tests cannot prove separately deployed apps work together. | Test remotes alone, then add shell integration and end-to-end tests. |

## Guiding rule

Use a microfrontend only where there is a real ownership or release boundary.
For a small team and a small product, a normal modular React application is often
simpler. We are using microfrontends here to learn the trade-offs and the tools,
not because every UI needs them.
