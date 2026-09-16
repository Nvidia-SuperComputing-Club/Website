import { describe, it, expect, vi, beforeEach } from 'vitest';
import { applicationService } from '../services/supabaseService.js';
import { supabase } from '../lib/supabase.js';

vi.mock('../lib/supabase.js', () => {
  const mockSupabase = { from: vi.fn() };
  return { supabase: mockSupabase, default: mockSupabase };
});

const application = {
  name: 'Aarav Sharma',
  email: 'aarav@galgotiasuniversity.edu.in',
  department: 'AI & Machine Learning',
  branch: 'B.Tech',
  semester: '5th Semester',
  year: '3rd Year',
  interests: ['CUDA & GPU Architecture'],
  experience: 'I build things',
  goal: 'Ship a real project',
  why_join: 'A campus speech model.',
};

/**
 * Records every insert and answers with whatever `respond(payload)` returns,
 * the way the table itself would: the same payload always gets the same answer.
 */
function mockInserts(respond) {
  const inserts = [];
  supabase.from.mockReturnValue({
    insert: (rows) => {
      inserts.push(rows[0]);
      const result = respond(rows[0]);
      const promise = Promise.resolve(result);
      // Supports both `.insert(...)` and `.insert(...).select().single()`.
      promise.select = () => ({ single: () => Promise.resolve(result) });
      return promise;
    },
  });
  return inserts;
}

describe('applicationService.submitApplication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('inserts the onboarding columns when the table has them', async () => {
    const inserts = mockInserts(() => ({ data: { id: 'app-1', ...application }, error: null }));

    const saved = await applicationService.submitApplication(application);

    expect(inserts).toHaveLength(1);
    expect(inserts[0]).toEqual(application);
    expect(saved.id).toBe('app-1');
  });

  it('retries in the legacy shape when the migration has not been run', async () => {
    const missingColumn = {
      code: 'PGRST204',
      message: "Could not find the 'department' column of 'applications' in the schema cache",
    };
    // An un-migrated table rejects anything mentioning the new columns.
    const inserts = mockInserts((payload) =>
      'department' in payload ? { data: null, error: missingColumn } : { data: { id: 'app-2' }, error: null },
    );

    const saved = await applicationService.submitApplication(application);

    expect(inserts).toHaveLength(3); // select attempt, plain insert, then the retry
    const retry = inserts[inserts.length - 1];
    expect(retry.department).toBeUndefined();
    expect(retry.semester).toBeUndefined();
    expect(retry.interests).toBeUndefined();
    expect(retry.goal).toBeUndefined();
    expect(retry.name).toBe(application.name);
    expect(retry.why_join).toContain('A campus speech model.');
    expect(retry.why_join).toContain('Department: AI & Machine Learning');
    expect(retry.why_join).toContain('Interests: CUDA & GPU Architecture');
    expect(saved.id).toBe('app-2');
  });

  it('keeps the application on the device when the insert fails outright', async () => {
    mockInserts(() => ({ data: null, error: { code: '500', message: 'network down' } }));

    const saved = await applicationService.submitApplication(application);

    expect(saved.offline).toBe(true);
    const stored = JSON.parse(localStorage.getItem('nvidia_club_applications'));
    expect(stored).toHaveLength(1);
    expect(stored[0].email).toBe(application.email);
    expect(stored[0].department).toBe('AI & Machine Learning');
  });
});
