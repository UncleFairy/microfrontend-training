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
```

## Learning sequence

1. **Workspace foundation**.
2. Build the React + Webpack shell application.
3. Build both React + Webpack trade panels as standalone applications.
4. Connect them with Webpack Module Federation.
5. Exchange selected-symbol data safely through the shell.
6. Add failure handling.
7. Share stable UI primitives and trade domain types.
8. Add testing and deployment-oriented configuration.
