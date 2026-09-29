# Microfrontend training

This project will teach microfrontends using **React** and **Webpack Module Federation**.

We will create three applications:

```text
apps/
├── shell/           The host application: it creates the dashboard layout.
├── trade-panel-a/   A remote application: order entry and open orders.
└── trade-panel-b/   A remote application: market data and a watchlist.
```

## Workspace structure

This repository uses **npm workspaces**. An npm workspace lets several small
applications live in one repository while still keeping their dependencies and
commands organised.

The application workspaces implement a React + Webpack Module Federation host
and two remotes. The packages below intentionally share only stable primitives:

```text
packages/
├── shared-ui/       Button, Card, and visual tokens.
└── trade-types/     Order and Instrument domain types.
```

Feature state, watchlist data, and order-entry behaviour remain in the panels
that own them.

### Useful commands (after the applications are added)

```bash
# Install all project dependencies once, from this root folder.
npm install

# Run one application during development.
npm run dev:shell

# Verify TypeScript across application workspaces.
npm run typecheck

# Build every workspace that has a build script.
npm run build

# Run all unit tests.
npm test
```

## Unit tests

The first test layer checks each remote in isolation, next to its feature
component. This catches broken user-facing behaviour without requiring remote
servers or Module Federation to be running.

- `trade-panel-a`: shell-provided symbol updates and submitted-order callbacks.
- `trade-panel-b`: watchlist selection and selected-symbol callbacks.

Integration tests for the shell and remotes will be added separately, because
they verify a different boundary: the applications working together at runtime.

## Shell integration tests

The shell integration test uses the actual exported Panel A and Panel B
components with the shell's real state coordinator. It verifies the complete
selected-symbol and submitted-order journey without replacing either panel.
Run it alone with `npm run test --workspace=shell`.

It does not fetch `remoteEntry.js`; a future browser test will start the real
remote servers and validate Webpack Module Federation's runtime loading.

## Learning sequence

1. **Workspace foundation**.
2. Build the React + Webpack shell application.
3. Build both React + Webpack trade panels as standalone applications.
4. Connect them with Webpack Module Federation.
5. Exchange selected-symbol data safely through the shell.
6. Add failure handling.
7. Share stable UI primitives and trade domain types.
8. Add testing and deployment-oriented configuration.
