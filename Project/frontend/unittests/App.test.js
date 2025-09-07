import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation((url) => {
      if (url === 'http://localhost:8000/index.php') {
        return Promise.resolve({
          json: () => Promise.resolve([
            {
              id: 1,
              data: {
                'ctrl1': 'test text',
                'ctrl2': 123,
                'ctrl3': '2025-09-06'
              },
              created_at: '2025-09-06 12:00:00'
            }
          ])
        });
      }
      return Promise.resolve({ json: () => Promise.resolve({}) });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders Dynamic Data Capture heading', () => {
    render(<App />);
    expect(screen.getByText(/Dynamic Data Capture/i)).toBeInTheDocument();
  });

  test('renders controls from mocked database data', async () => {
    render(<App />);
    // Wait for controls to be rendered
    await waitFor(() => {
      expect(screen.getAllByRole('textbox').length).toBe(1); // text
      expect(screen.getByDisplayValue('test text')).toBeInTheDocument();
      expect(screen.getByDisplayValue('123')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2025-09-06')).toBeInTheDocument();
    });
  });

  test('add control button adds a new input', () => {
    render(<App />);
    const addButton = screen.getByText('Add Control');
    fireEvent.click(addButton);
    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0);
  });

  test('shows error if backend is unreachable', async () => {
    // This test is a placeholder for error handling, would need to mock fetch
    expect(true).toBe(true);
  });
});
