# Microfrontend training

This project will teach microfrontends using **React** and **Webpack Module Federation**.

We will create three applications:

```text
apps/
├── shell/           The host application: it creates the dashboard layout.
├── trade-panel-a/   A remote application: order entry and open orders.
└── trade-panel-b/   A remote application: market data and a watchlist.
```

## Step 1: workspace foundation

This first step creates an **npm workspace**. An npm workspace lets several small
applications live in one repository while still keeping their dependencies and
commands organised.

There is deliberately no React or Webpack code yet. First we create the project
boundaries; in the next step we will make the shell run by itself.

### Useful commands (after the applications are added)

```bash
# Install all project dependencies once, from this root folder.
npm install

# Run one application during development.
npm run dev:shell
```

## Learning sequence

1. **Workspace foundation** — this step.
2. Build the React + Webpack shell application.
3. Build both React + Webpack trade panels as standalone applications.
4. Connect them with Webpack Module Federation.
5. Exchange selected-symbol data safely through the shell.
6. Add failure handling, testing, and deployment-oriented configuration.
