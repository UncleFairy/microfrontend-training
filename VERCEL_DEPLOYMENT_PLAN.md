# Vercel deployment learning plan

## What we are building

We will deploy three independent static websites from this one repository:

```text
Vercel
├── trading-shell       the page users open
├── trade-panel-a       order-entry remote
└── trade-panel-b       market-watch remote
```

The shell downloads each panel at runtime through its `remoteEntry.js` file.
That is why the panels must be deployed separately rather than copied into the
shell's output.

## Words to know first

| Term | Meaning in this project |
| --- | --- |
| Repository | This Git repository containing every app and package. |
| Vercel project | One independently deployed website connected to a folder in the repository. |
| Build | Vercel runs a command that turns source files into browser files. Here, Webpack creates `dist/`. |
| Deployment | A published build with its own URL. |
| Production | The live version users visit. |
| Preview | A temporary deployment Vercel creates for a branch or pull request. |
| Remote URL | The URL the shell uses to download a panel's `remoteEntry.js`. |

## The learning path

### Phase 1: Prepare the code for deployed URLs

**Goal:** The shell should no longer permanently point at `localhost`.

Today the shell expects the remotes at local URLs:

```text
http://localhost:3001/remoteEntry.js
http://localhost:3002/remoteEntry.js
```

We will change the Webpack configuration so it reads two build-time values:

```text
TRADE_PANEL_A_URL
TRADE_PANEL_B_URL
```

The configuration will use `localhost` only when these values are absent. On
Vercel, the values will be the deployed panel URLs.

**Why this comes first:** a production shell cannot fetch a remote from your
laptop. The URL must be chosen when Vercel builds the shell.

**Check:** local development and the existing Playwright E2E test still pass.

### Phase 2: Add small Vercel build configurations

**Goal:** Make it obvious how Vercel builds each app.

Each application will get a small `vercel.json` that says:

```text
build command:      npm run build
output directory:   dist
framework:          Other
```

These are static React/Webpack applications. Vercel will publish the generated
`dist/` files; there is no server-side React application here.

We will also set safe cache headers. In particular, each panel's
`remoteEntry.js` must revalidate on every request, because it tells the shell
which remote chunks to load after a panel is deployed. The shell applies the
same policy to its static output because its current chunk filenames are not
content-hashed.

**Check:** `npm run build` succeeds before any cloud deployment is attempted.

### Phase 3: Create the three Vercel projects manually

**Goal:** See the independent-deployment boundary in the Vercel dashboard.

In Vercel, we will import this same Git repository three times:

| Vercel project | Root Directory | Output Directory |
| --- | --- | --- |
| `trading-shell` | `apps/shell` | `dist` |
| `trade-panel-a` | `apps/trade-panel-a` | `dist` |
| `trade-panel-b` | `apps/trade-panel-b` | `dist` |

The root directory tells Vercel which workspace is the application being
published. npm workspaces still let it install the shared local packages from
the repository.

After Vercel deploys them, write down the three `*.vercel.app` URLs.

**Check:** Open each panel URL directly. Both panels should work as standalone
applications before we connect the shell to them.

### Phase 4: Connect the production shell to the production remotes

**Goal:** Make the hosted dashboard work as one page.

In the `trading-shell` Vercel project, add these Production environment
variables:

```text
TRADE_PANEL_A_URL=https://<panel-a-production-url>
TRADE_PANEL_B_URL=https://<panel-b-production-url>
```

Redeploy the shell after adding them. The remote projects need no secret
variables for this example.

**Check:** Open the shell production URL, select `BTC-USD`, submit an order,
and confirm the shell displays the confirmation message.

### Phase 5: Use previews safely

**Goal:** Learn previews without making cross-project preview URLs complicated.

Vercel creates a preview deployment for non-production branches. At first,
the shell preview will point to stable, deployed test remotes rather than trying
to discover the matching random preview URL for each panel.

```text
shell preview → stable test Panel A + stable test Panel B
shell production → production Panel A + production Panel B
```

This is intentional. Coordinating a matching preview URL across three separate
Vercel projects is useful later, but it is not the first concept to learn.

**Check:** Create a branch, push it, and use Vercel's preview shell URL to
verify the real remotes load.

### Phase 6: Make remote releases observable

**Goal:** Make a failed remote understandable rather than mysterious.

We already show a fallback when a panel cannot load. We will add:

1. A build version for each application.
2. Structured remote-load error data: remote name, remote URL, shell version,
   error message, and time.
3. Initially, browser logging; later, a monitoring provider can receive the
   same data.

**Check:** Temporarily use an invalid remote URL in a preview environment and
confirm the shell stays usable and reports the useful context.

### Phase 7: Test deployed artifacts

**Goal:** Test what Vercel actually publishes.

The existing E2E test uses development servers. We will add a second mode that
builds all three apps, serves their `dist/` folders, and runs the same
Playwright journey. Later this can run against Vercel preview URLs in CI.

**Check:** The production-artifact E2E test passes before a production release.

## What we will not do in the first deployment

- Custom domains.
- Automatic matching preview URLs for all three projects.
- A paid monitoring service.
- API, login, database, or payment infrastructure.

Leaving these out lets us focus on the microfrontend deployment boundary:
separate builds, separate URLs, and safe runtime loading.

## Official references

- [Vercel monorepos](https://vercel.com/docs/monorepos): one repository can
  connect to multiple Vercel projects, each with its own root directory.
- [Vercel build settings](https://vercel.com/docs/deployments/configure-a-build):
  build command and output-directory configuration.
- [Vercel environments](https://vercel.com/docs/deployments/environments):
  Local, Preview, and Production deployment environments.
- [Vercel environment variables](https://vercel.com/docs/environment-variables):
  values are available during the build and can differ by environment.
- [vercel.json configuration](https://vercel.com/docs/project-configuration/vercel-json):
  static configuration, including build settings and response headers.
