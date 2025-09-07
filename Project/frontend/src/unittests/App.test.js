import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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

  test('renders Dynamic Data Capture heading', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText(/Dynamic Data Capture/i)).toBeInTheDocument();
  });

  test('renders controls from mocked database data', async () => {
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => expect(screen.getByDisplayValue('test text')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByDisplayValue('123')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByDisplayValue('2025-09-06')).toBeInTheDocument());
  });

  test('add control button adds a new input', async () => {
    await act(async () => {
      render(<App />);
    });
    const addButton = screen.getByText('Add Control');
    await act(async () => {
      fireEvent.click(addButton);
    });
    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0);
  });
});
