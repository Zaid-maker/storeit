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
  default: jest.fn().mockImplementation(({ src, alt, ...props }) => (
    Object.assign(document.createElement('img'), { src, alt, ...props })
  )),
}));

// Mock shadcn/ui components
jest.mock('@/components/ui/button', () => ({
  Button: jest.fn().mockImplementation((props) => 
    Object.assign(document.createElement('button'), props)
  ),
}));

jest.mock('@/components/ui/form', () => ({
  Form: jest.fn().mockImplementation((props) => 
    Object.assign(document.createElement('form'), props)
  ),
  FormField: jest.fn().mockImplementation((props) => 
    Object.assign(document.createElement('div'), props)
  ),
  FormItem: jest.fn().mockImplementation((props) => 
    Object.assign(document.createElement('div'), props)
  ),
  FormLabel: jest.fn().mockImplementation((props) => 
    Object.assign(document.createElement('label'), props)
  ),
  FormControl: jest.fn().mockImplementation((props) => 
    Object.assign(document.createElement('div'), props)
  ),
  FormMessage: jest.fn().mockImplementation((props) => 
    Object.assign(document.createElement('span'), props)
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: jest.fn().mockImplementation((props) => 
    Object.assign(document.createElement('input'), props)
  ),
}));

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
