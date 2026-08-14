import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EventsPage from '../pages/EventsPage';

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('EventsPage', () => {
  it('renders page heading', () => {
    renderWithRouter(<EventsPage />);
    expect(screen.getByText(/UPCOMING HACKATHONS/i)).toBeInTheDocument();
  });

  it('renders tab switcher', () => {
    renderWithRouter(<EventsPage />);
    expect(screen.getByText(/Upcoming Schedule/i)).toBeInTheDocument();
    expect(screen.getByText(/Past Archives/i)).toBeInTheDocument();
  });

  it('renders filter buttons', () => {
    renderWithRouter(<EventsPage />);
    expect(screen.getByText('all')).toBeInTheDocument();
    expect(screen.getByText('hackathon')).toBeInTheDocument();
    expect(screen.getByText('workshop')).toBeInTheDocument();
    expect(screen.getByText('talk')).toBeInTheDocument();
  });
});
