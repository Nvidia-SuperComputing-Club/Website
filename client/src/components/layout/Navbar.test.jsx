import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Navbar from '../components/layout/Navbar';

describe('Navbar', () => {
  it('renders club name', () => {
    render(<Navbar />);
    expect(screen.getByText(/NVIDIA/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
  });

  it('renders CLI Terminal button', () => {
    render(<Navbar />);
    expect(screen.getByText('Terminal')).toBeInTheDocument();
  });
});
