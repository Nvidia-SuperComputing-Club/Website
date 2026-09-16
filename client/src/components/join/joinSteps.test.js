import { describe, it, expect } from 'vitest';
import {
  EMPTY_ANSWERS, STEPS, buildPayload, isStepAnswered, semesterToYear, summaryValue, validateStep,
} from './joinSteps.js';

const stepById = (id) => STEPS.find((s) => s.id === id);

const filled = {
  ...EMPTY_ANSWERS,
  name: '  Aarav Sharma ',
  email: ' aarav@galgotiasuniversity.edu.in ',
  department: 'AI & Machine Learning',
  branch: 'B.Tech',
  semester: '5th',
  interests: ['CUDA & GPU Architecture', 'LLMs & Generative AI'],
  experience: 'builder',
  goal: 'Ship a real project',
  why_join: 'A Hindi lecture transcription model.',
};

describe('validateStep', () => {
  it('requires a name', () => {
    expect(validateStep(stepById('name'), '')).toMatch(/enter your name/i);
    expect(validateStep(stepById('name'), 'A')).toMatch(/short/i);
    expect(validateStep(stepById('name'), 'Aarav')).toBeNull();
  });

  it('checks the email looks like an address', () => {
    const step = stepById('email');
    expect(validateStep(step, 'aarav')).toMatch(/email/i);
    expect(validateStep(step, 'aarav@uni')).toMatch(/email/i);
    expect(validateStep(step, 'aarav@galgotiasuniversity.edu.in')).toBeNull();
  });

  it('needs at least one interest but lets the open question be skipped', () => {
    expect(validateStep(stepById('interests'), [])).toMatch(/at least one/i);
    expect(validateStep(stepById('interests'), ['CUDA & GPU Architecture'])).toBeNull();
    expect(validateStep(stepById('why_join'), '')).toBeNull();
  });

  it('treats an unanswered choice as incomplete', () => {
    expect(isStepAnswered(stepById('department'), '')).toBe(false);
    expect(isStepAnswered(stepById('department'), 'Biotechnology')).toBe(true);
  });
});

describe('summaryValue', () => {
  it('reads back option labels rather than stored values', () => {
    expect(summaryValue(stepById('experience'), 'builder')).toBe('I build things');
    expect(summaryValue(stepById('semester'), '5th')).toBe('5th Semester');
    expect(summaryValue(stepById('interests'), ['A', 'B'])).toBe('A, B');
    expect(summaryValue(stepById('goal'), '')).toBe('');
  });

  it('keeps free-typed "other" answers as written', () => {
    expect(summaryValue(stepById('department'), 'Design')).toBe('Design');
  });
});

describe('semesterToYear', () => {
  it('maps semesters onto the year the admin views expect', () => {
    expect(semesterToYear('1st')).toBe('1st Year');
    expect(semesterToYear('4th')).toBe('2nd Year');
    expect(semesterToYear('5th')).toBe('3rd Year');
    expect(semesterToYear('8th')).toBe('4th Year');
    expect(semesterToYear('Sabbatical')).toBeNull();
  });
});

describe('buildPayload', () => {
  it('maps answers onto applications columns', () => {
    expect(buildPayload(filled)).toEqual({
      name: 'Aarav Sharma',
      email: 'aarav@galgotiasuniversity.edu.in',
      department: 'AI & Machine Learning',
      branch: 'B.Tech',
      semester: '5th Semester',
      year: '3rd Year',
      interests: ['CUDA & GPU Architecture', 'LLMs & Generative AI'],
      experience: 'I build things',
      goal: 'Ship a real project',
      why_join: 'A Hindi lecture transcription model.',
    });
  });

  it('sends null rather than empty strings for optional answers', () => {
    const payload = buildPayload({ ...filled, why_join: '   ', semester: '', interests: [] });
    expect(payload.why_join).toBeNull();
    expect(payload.semester).toBeNull();
    expect(payload.year).toBeNull();
    expect(payload.interests).toBeNull();
  });
});
