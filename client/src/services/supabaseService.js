import { supabase } from '../lib/supabase.js';

// Auth Services
export const authService = {
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },
};

// Events Services
export const eventsService = {
  getEvents: async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    if (error) throw error;
    return data;
  },

  getEventById: async (id) => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  createEvent: async (eventData) => {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateEvent: async (id, eventData) => {
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteEvent: async (id) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  },
};

// Team Services
export const teamService = {
  getTeamMembers: async () => {
    const { data, error } = await supabase
      .from('team')
      .select('*')
      .order('order', { ascending: true });
    if (error) throw error;
    return data;
  },

  getTeamMemberById: async (id) => {
    const { data, error } = await supabase
      .from('team')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  createTeamMember: async (memberData) => {
    const { data, error } = await supabase
      .from('team')
      .insert([memberData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateTeamMember: async (id, memberData) => {
    const { data, error } = await supabase
      .from('team')
      .update(memberData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteTeamMember: async (id) => {
    const { error } = await supabase
      .from('team')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  },
};

// Membership Application Services
export const applicationService = {
  submitApplication: async (applicationData) => {
    const { data, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  getApplications: async () => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
};

export default {
  auth: authService,
  events: eventsService,
  team: teamService,
  applications: applicationService,
};
