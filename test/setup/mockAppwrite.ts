import { vi } from 'vitest';

// Mock the entire appwrite module
vi.mock('@/lib/appwrite/index', () => ({
  createSessionClient: vi.fn().mockImplementation(() => ({
    account: {
      get: vi.fn().mockResolvedValue({
        $id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
      }),
    },
    databases: {
      listDocuments: vi.fn().mockResolvedValue({
        documents: [],
        total: 0,
      }),
      createDocument: vi.fn().mockResolvedValue({
        $id: 'test-doc-id',
      }),
    },
  })),
  createAdminClient: vi.fn().mockImplementation(() => ({
    account: {
      create: vi.fn().mockResolvedValue({
        $id: 'test-user-id',
      }),
    },
    databases: {
      listDocuments: vi.fn().mockResolvedValue({
        documents: [],
        total: 0,
      }),
    },
  })),
}));

// Mock the next/headers module
vi.mock('next/headers', () => ({
  cookies: vi.fn().mockReturnValue({
    get: vi.fn().mockReturnValue({
      value: 'mock-session-value',
    }),
  }),
}));
