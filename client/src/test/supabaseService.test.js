import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService, eventsService, teamService, applicationService } from '../services/supabaseService.js';
import { supabase } from '../lib/supabase.js';

vi.mock('../lib/supabase.js', () => {
  const mockSupabase = {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
      getSession: vi.fn(),
    },
    from: vi.fn(),
  };
  return {
    supabase: mockSupabase,
    default: mockSupabase,
  };
});

describe('Supabase Service Layer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Auth Service', () => {
    it('should login successfully with valid credentials', async () => {
      const mockSession = { user: { id: 'user-1', email: 'admin@nvidia.com' }, token: 'xyz' };
      supabase.auth.signInWithPassword.mockResolvedValue({ data: mockSession, error: null });

      const result = await authService.login('admin@nvidia.com', 'password123');
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'admin@nvidia.com',
        password: 'password123',
      });
      expect(result).toEqual(mockSession);
    });

    it('should throw error on invalid login', async () => {
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: new Error('Invalid login credentials'),
      });

      await expect(authService.login('admin@nvidia.com', 'wrong')).rejects.toThrow(
        'Invalid login credentials'
      );
    });

    it('should logout user successfully', async () => {
      supabase.auth.signOut.mockResolvedValue({ error: null });
      const res = await authService.logout();
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(res).toEqual({ success: true });
    });
  });

  describe('Events Service', () => {
    it('should fetch list of events', async () => {
      const mockEvents = [
        { id: '1', title: 'AI Summit 2026', date: '2026-09-01' },
        { id: '2', title: 'GPU Workshop', date: '2026-10-15' },
      ];

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockEvents, error: null }),
      };
      supabase.from.mockReturnValue(mockChain);

      const events = await eventsService.getEvents();
      expect(supabase.from).toHaveBeenCalledWith('events');
      expect(mockChain.select).toHaveBeenCalledWith('*');
      expect(events).toEqual(mockEvents);
    });

    it('should create a new event', async () => {
      const newEvent = { title: 'Hackathon', date: '2026-11-01' };
      const createdEvent = { id: '3', ...newEvent };

      const mockChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: createdEvent, error: null }),
      };
      supabase.from.mockReturnValue(mockChain);

      const result = await eventsService.createEvent(newEvent);
      expect(supabase.from).toHaveBeenCalledWith('events');
      expect(mockChain.insert).toHaveBeenCalledWith([newEvent]);
      expect(result).toEqual(createdEvent);
    });

    it('should delete an event', async () => {
      const mockChain = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      };
      supabase.from.mockReturnValue(mockChain);

      const result = await eventsService.deleteEvent('event-123');
      expect(supabase.from).toHaveBeenCalledWith('events');
      expect(mockChain.eq).toHaveBeenCalledWith('id', 'event-123');
      expect(result).toEqual({ success: true });
    });
  });

  describe('Team Service', () => {
    it('should fetch team members ordered by rank', async () => {
      const mockMembers = [
        { id: 't1', name: 'Jensen Huang', role: 'Honorary Patron' },
      ];

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockMembers, error: null }),
      };
      supabase.from.mockReturnValue(mockChain);

      const members = await teamService.getTeamMembers();
      expect(supabase.from).toHaveBeenCalledWith('team');
      expect(members).toEqual(mockMembers);
    });
  });

  describe('Application Service', () => {
    it('should submit a membership application', async () => {
      const applicationData = { full_name: 'John Doe', email: 'john@example.com' };
      const createdApplication = { id: 'app-1', ...applicationData };

      const mockChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: createdApplication, error: null }),
      };
      supabase.from.mockReturnValue(mockChain);

      const result = await applicationService.submitApplication(applicationData);
      expect(supabase.from).toHaveBeenCalledWith('applications');
      expect(result).toEqual(createdApplication);
    });
  });
});
