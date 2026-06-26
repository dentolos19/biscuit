import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import AppProvider from "#/components/app-provider";
import ErrorOccurred from "#/components/error-occurred";
import Loading from "#/components/loading";
import NotFound from "#/components/not-found";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      {
        title: "NETS Biscuit",
      },
      {
        name: "theme-color",
        content: "#b5000b",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/icon.jpeg",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        <AppProvider>
          <Outlet />
        </AppProvider>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  ),
  pendingComponent: () => (
    <main className="h-dvh">
      <Loading />
    </main>
  ),
  errorComponent: ({ error }) => (
    <main className="h-dvh">
      <ErrorOccurred error={error} />
    </main>
  ),
  notFoundComponent: () => (
    <main className="h-dvh">
      <NotFound />
    </main>
  ),
});
