import { defineConfig } from "cf/config";

import * as entrypoint from "./src/server.ts" with { type: "cf-worker" };

export default defineConfig({
  accountId: "d910f54eba4cf3d1634aa41c3d9a93bc",
  worker: {
    name: "biscuit",
    compatibilityDate: "2026-10-01",
    entrypoint,
    observability: {
      logs: {
        enabled: true,
      },
      traces: {
        enabled: true,
      },
      issues: {
        enabled: true,
      },
    },
    domains: ["biscuit.dennise.me"],
  },
});
