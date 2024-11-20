import { render, screen, waitFor } from '../test-utils';
import userEvent from '@testing-library/user-event';
import Dashboard from '@/app/dashboard/page';

// Mock the storage service
jest.mock('@/lib/storage', () => ({
  listFiles: jest.fn().mockResolvedValue([
    { id: '1', name: 'test.pdf', size: 1024, type: 'application/pdf' },
    { id: '2', name: 'image.jpg', size: 2048, type: 'image/jpeg' },
  ]),
  uploadFile: jest.fn().mockResolvedValue({ id: '3', name: 'new-file.txt' }),
  deleteFile: jest.fn().mockResolvedValue(true),
}));

describe('Dashboard Integration', () => {
  const mockFiles = [
    new File(['test content'], 'test.txt', { type: 'text/plain' }),
    new File(['image content'], 'test.jpg', { type: 'image/jpeg' }),
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('File Listing', () => {
    it('displays the list of files from storage', async () => {
      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('test.pdf')).toBeInTheDocument();
        expect(screen.getByText('image.jpg')).toBeInTheDocument();
      });
    });

    it('shows file details including size', async () => {
      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('1.0 KB')).toBeInTheDocument();
        expect(screen.getByText('2.0 KB')).toBeInTheDocument();
      });
    });
  });

  describe('File Upload', () => {
    it('handles file upload through drag and drop', async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      const dropzone = screen.getByTestId('file-dropzone');
      
      // Simulate file drop
      await user.upload(dropzone, mockFiles[0]);

      await waitFor(() => {
        expect(screen.getByText('new-file.txt')).toBeInTheDocument();
      });
    });

    it('shows upload progress and success message', async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      const dropzone = screen.getByTestId('file-dropzone');
      await user.upload(dropzone, mockFiles[0]);

      // Check for upload progress indicator
      expect(screen.getByRole('progressbar')).toBeInTheDocument();

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText(/successfully uploaded/i)).toBeInTheDocument();
      });
    });
  });

  describe('File Operations', () => {
    it('allows file deletion', async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      // Wait for files to load
      await waitFor(() => {
        expect(screen.getByText('test.pdf')).toBeInTheDocument();
      });

      // Click delete button for first file
      const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
      await user.click(deleteButton);

      // Confirm deletion
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      await user.click(confirmButton);

      // Check if file is removed from the list
      await waitFor(() => {
        expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
      });
    });

    it('allows file download', async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      // Wait for files to load
      await waitFor(() => {
        expect(screen.getByText('test.pdf')).toBeInTheDocument();
      });

      // Click download button
      const downloadButton = screen.getAllByRole('button', { name: /download/i })[0];
      await user.click(downloadButton);

      // Verify download started
      expect(window.location.href).toContain('test.pdf');
    });
  });

  describe('Search and Filter', () => {
    it('filters files by search term', async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      // Wait for files to load
      await waitFor(() => {
        expect(screen.getByText('test.pdf')).toBeInTheDocument();
        expect(screen.getByText('image.jpg')).toBeInTheDocument();
      });

      // Type in search box
      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'pdf');

      // Check if only PDF file is shown
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
      expect(screen.queryByText('image.jpg')).not.toBeInTheDocument();
    });

    it('filters files by type', async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      // Wait for files to load
      await waitFor(() => {
        expect(screen.getByText('test.pdf')).toBeInTheDocument();
      });

      // Select PDF filter
      const filterSelect = screen.getByRole('combobox', { name: /filter/i });
      await user.selectOptions(filterSelect, 'PDF');

      // Check if only PDF files are shown
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
      expect(screen.queryByText('image.jpg')).not.toBeInTheDocument();
    });
  });
});
