import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";

const originalEnv = { ...process.env };

// Utility to load the prisma module with mocked dependencies and capture constructor args
async function loadPrisma(databaseUrl: string, nodeEnv = "test") {
  const previousEnv = { ...process.env };
  process.env = { ...process.env, DATABASE_URL: databaseUrl, NODE_ENV: nodeEnv };

  // Clear cached singletons
  delete (globalThis as { prisma?: unknown }).prisma;
  delete (globalThis as { pool?: unknown }).pool;

  vi.resetModules();

  type PoolOptions = Record<string, unknown>;
  type ClientOptions = Record<string, unknown>;
  type MockPool = { __pool: true; opts: PoolOptions };
  type MockAdapter = { __adapter: true; pool: MockPool };
  type MockClient = { __client: true; opts: ClientOptions };

  const poolArgs: PoolOptions[] = [];
  const clientArgs: ClientOptions[] = [];
  const adapterArgs: MockAdapter[] = [];

  vi.doMock("pg", () => {
    return {
      Pool: vi.fn().mockImplementation((opts: PoolOptions): MockPool => {
        poolArgs.push(opts);
        return { __pool: true, opts };
      }),
    };
  });

  vi.doMock("@prisma/adapter-pg", () => {
    return {
      PrismaPg: vi.fn().mockImplementation((pool: MockPool): MockAdapter => {
        adapterArgs.push(pool);
        return { __adapter: true, pool };
      }),
    };
  });

  vi.doMock("@/generated/prisma", () => {
    return {
      PrismaClient: vi.fn().mockImplementation((opts: ClientOptions): MockClient => {
        clientArgs.push(opts);
        return { __client: true, opts };
      }),
    };
  });

  const prismaModuleImport = await import("@/lib/prisma");
  process.env = previousEnv;

  return {
    prismaModule: prismaModuleImport,
    poolArgs,
    clientArgs,
    adapterArgs,
  };
}

describe("lib/prisma", () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.resetAllMocks();
  });

  afterAll(() => {
    process.env = { ...originalEnv };
  });

  it("creates pool without SSL for localhost urls", async () => {
    const { poolArgs, clientArgs, adapterArgs } = await loadPrisma(
      "postgres://localhost:5432/testdb"
    );

    expect(poolArgs).toHaveLength(1);
    expect(poolArgs[0].ssl).toBeUndefined();
    expect(adapterArgs).toHaveLength(1);
    expect(clientArgs).toHaveLength(1);
  });

  it("enables SSL when sslmode or non-localhost host is present", async () => {
    const { poolArgs } = await loadPrisma(
      "postgres://db.neon.tech:5432/testdb?sslmode=require"
    );

    expect(poolArgs).toHaveLength(1);
    expect(poolArgs[0].ssl).toMatchObject({ rejectUnauthorized: false });
  });

  it("reuses cached prisma instance in non-production env", async () => {
    const { poolArgs, clientArgs } = await loadPrisma(
      "postgres://localhost:5432/testdb",
      "development"
    );

    // Import again without resetting modules to simulate hot reload reuse
    const secondImport = await import("@/lib/prisma");
    expect(secondImport.prisma).toBeDefined();

    expect(poolArgs).toHaveLength(1);
    expect(clientArgs).toHaveLength(1);
  });
});


