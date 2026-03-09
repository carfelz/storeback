import { loadEnv, defineConfig } from '@medusajs/framework/utils'

// Define jest globally to avoid Medusa crashing when it evaluates test files during auto-discovery
if (typeof global !== "undefined" && typeof (global as any).jest === "undefined") {
  const noop = () => { };
  (global as any).jest = { mock: noop, setTimeout: noop, clearAllMocks: noop };
  (global as any).describe = noop;
  (global as any).it = noop;
  (global as any).beforeAll = noop;
  (global as any).beforeEach = noop;
  (global as any).afterAll = noop;
  (global as any).afterEach = noop;
  (global as any).expect = (() => ({
    toEqual: noop,
    toBeDefined: noop,
    toBe: noop,
    rejects: { toThrow: noop },
    toHaveBeenCalledWith: noop
  }));
}

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  admin: {
    vite: (config) => {
      return {
        server: {
          host: "0.0.0.0",
          // Allow all hosts when running in Docker (development mode)
          // In production, this should be more restrictive
          allowedHosts: [
            "localhost",
            ".localhost",
            "127.0.0.1",
          ],
          hmr: {
            // HMR websocket port inside container
            port: 5173,
            // Port browser connects to (exposed in docker-compose.yml)
            clientPort: 5173,
          },
        },
      }
    },
  },
  modules: [
    {
      resolve: "./src/modules/gifting",
    },
  ],
  projectConfig: {
    redisUrl: process.env.REDIS_URL,
    databaseDriverOptions: {
      ssl: false,
      sslmode: "disable",
    },
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  }
})
