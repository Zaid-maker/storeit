import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '',
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => null),
}));

// Mock shadcn/ui components
jest.mock('@/components/ui/button', () => ({
  Button: jest.fn().mockImplementation(() => null),
}));

jest.mock('@/components/ui/form', () => ({
  Form: jest.fn().mockImplementation(({ children }) => children),
  FormField: jest.fn().mockImplementation(({ children }) => children),
  FormItem: jest.fn().mockImplementation(({ children }) => children),
  FormLabel: jest.fn().mockImplementation(({ children }) => children),
  FormControl: jest.fn().mockImplementation(({ children }) => children),
  FormMessage: jest.fn().mockImplementation(({ children }) => children),
}));

jest.mock('@/components/ui/input', () => ({
  Input: jest.fn().mockImplementation(() => null),
}));

// Mock node-appwrite
jest.mock('node-appwrite', () => ({
  Client: jest.fn().mockImplementation(() => ({
    setEndpoint: jest.fn(),
    setProject: jest.fn(),
  })),
  Account: jest.fn().mockImplementation(() => ({
    createEmailToken: jest.fn().mockResolvedValue({ userId: 'mock-user-id' }),
    createEmailSession: jest.fn().mockResolvedValue({ userId: 'mock-user-id' }),
    get: jest.fn().mockResolvedValue({ $id: 'mock-user-id', email: 'test@example.com' }),
  })),
  ID: {
    unique: jest.fn().mockReturnValue('mock-unique-id'),
  },
}));

// Mock user actions
jest.mock('@/lib/actions/user.actions', () => ({
  createUserAccount: jest.fn().mockResolvedValue({ userId: 'mock-user-id' }),
  signInAccount: jest.fn().mockResolvedValue({ userId: 'mock-user-id' }),
}));

// Setup global fetch mock
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
