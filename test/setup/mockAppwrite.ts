// Mock the entire appwrite module
jest.mock('@/lib/appwrite/index', () => ({
  createSessionClient: jest.fn().mockImplementation(() => ({
    account: {
      get: jest.fn().mockResolvedValue({
        $id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
      }),
    },
    databases: {
      listDocuments: jest.fn().mockResolvedValue({
        documents: [],
        total: 0,
      }),
      createDocument: jest.fn().mockResolvedValue({
        $id: 'test-doc-id',
      }),
    },
  })),
  createAdminClient: jest.fn().mockImplementation(() => ({
    account: {
      create: jest.fn().mockResolvedValue({
        $id: 'test-user-id',
      }),
    },
    databases: {
      listDocuments: jest.fn().mockResolvedValue({
        documents: [],
        total: 0,
      }),
    },
  })),
}));

// Mock the next/headers module
jest.mock('next/headers', () => ({
  cookies: jest.fn().mockReturnValue({
    get: jest.fn().mockReturnValue({
      value: 'mock-session-value',
    }),
  }),
}));
