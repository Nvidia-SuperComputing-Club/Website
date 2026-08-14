import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TeamPage from '../pages/TeamPage';

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('TeamPage', () => {
  it('renders page heading', () => {
    renderWithRouter(<TeamPage />);
    expect(screen.getByText(/PIONEERING GPU COMPUTING/i)).toBeInTheDocument();
  });

  it('renders mission section', () => {
    renderWithRouter(<TeamPage />);
    expect(screen.getByText('Our Campus Mission')).toBeInTheDocument();
  });

  it('renders executive board heading', () => {
    renderWithRouter(<TeamPage />);
    expect(screen.getByText('EXECUTIVE BOARD')).toBeInTheDocument();
  });
});
