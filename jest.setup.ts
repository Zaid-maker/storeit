import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      refresh: jest.fn(),
      forward: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '';
  },
  useParams() {
    return {};
  },
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

// Mock useToast
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
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

// Add custom matchers or global test configuration here
expect.extend({
  toHaveBeenCalledWithMatch(received: jest.Mock, ...expected: any[]) {
    const pass = received.mock.calls.some((call) =>
      expected.every((arg, i) => {
        if (typeof arg === 'object') {
          return expect.objectContaining(arg).asymmetricMatch(call[i]);
        }
        return arg === call[i];
      })
    );

    return {
      pass,
      message: () =>
        `expected ${received.getMockName()} to ${
          pass ? 'not ' : ''
        }have been called with arguments matching ${expected.join(', ')}`,
    };
  },
});
