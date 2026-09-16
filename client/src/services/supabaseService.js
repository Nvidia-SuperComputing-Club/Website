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
    // Map DB fields back to what the frontend components expect
    return data.map(m => ({
      ...m,
      image_url: m.avatar_url,
      display_order: m.order,
      twitter_url: m.email // Using email column to store twitter_url temporarily if needed
    }));
  },

  getTeamMemberById: async (id) => {
    const { data, error } = await supabase
      .from('team')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return {
      ...data,
      image_url: data.avatar_url,
      display_order: data.order,
      twitter_url: data.email
    };
  },

  createTeamMember: async (memberData) => {
    // Map frontend fields to DB schema
    const dbData = {
      name: memberData.name,
      role: memberData.role,
      bio: memberData.bio,
      avatar_url: memberData.image_url,
      github_url: memberData.github_url,
      linkedin_url: memberData.linkedin_url,
      email: memberData.twitter_url, // Map twitter to email column
      order: Number(memberData.display_order) || 0,
      is_active: memberData.is_active
    };
    
    const { data, error } = await supabase
      .from('team')
      .insert([dbData])
      .select()
      .single();
    if (error) throw error;
    
    return { ...data, image_url: data.avatar_url, display_order: data.order, twitter_url: data.email };
  },

  updateTeamMember: async (id, memberData) => {
    // Map frontend fields to DB schema
    const dbData = {};
    if (memberData.name !== undefined) dbData.name = memberData.name;
    if (memberData.role !== undefined) dbData.role = memberData.role;
    if (memberData.bio !== undefined) dbData.bio = memberData.bio;
    if (memberData.image_url !== undefined) dbData.avatar_url = memberData.image_url;
    if (memberData.github_url !== undefined) dbData.github_url = memberData.github_url;
    if (memberData.linkedin_url !== undefined) dbData.linkedin_url = memberData.linkedin_url;
    if (memberData.twitter_url !== undefined) dbData.email = memberData.twitter_url;
    if (memberData.display_order !== undefined) dbData.order = Number(memberData.display_order) || 0;
    if (memberData.is_active !== undefined) dbData.is_active = memberData.is_active;

    const { data, error } = await supabase
      .from('team')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    
    return { ...data, image_url: data.avatar_url, display_order: data.order, twitter_url: data.email };
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

// Columns added by schemas/applications_onboarding.sql. Until that migration
// is applied, inserts using them fail and we fold them into `why_join`.
const ONBOARDING_COLUMNS =['department', 'semester', 'interests', 'goal'];

const isMissingColumnError = (error) => {
  if (!error) return false;
  const text = `${error.code || ''} ${error.message || ''} ${error.details || ''}`;
  return (
    error.code === 'PGRST204' ||
    error.code === '42703' ||
    /column .* does not exist|could not find the '.*' column/i.test(text)
  );
};

/** Same application, described in the columns an un-migrated table has. */
const toLegacyPayload = (applicationData) => {
  const legacy = { ...applicationData };
  const extra = [];
  for (const column of ONBOARDING_COLUMNS) {
    const value = legacy[column];
    delete legacy[column];
    if (value === null || value === undefined || value === '') continue;
    const label = column.charAt(0).toUpperCase() + column.slice(1);
    extra.push(`${label}: ${Array.isArray(value) ? value.join(', ') : value}`);
  }
  if (extra.length) {
    legacy.why_join = [legacy.why_join, extra.join('\n')].filter(Boolean).join('\n\n');
  }
  return legacy;
};

const storeApplicationLocally = (applicationData) => {
  const localApps = JSON.parse(localStorage.getItem('nvidia_club_applications') || '[]');
  const newApp = {
    id: 'app-' + Date.now(),
    ...applicationData,
    status: 'pending',
    created_at: new Date().toISOString(),
    offline: true,
  };
  localApps.unshift(newApp);
  localStorage.setItem('nvidia_club_applications', JSON.stringify(localApps));
  return newApp;
};

// Membership Application Services
export const applicationService = {
  submitApplication: async (applicationData) => {
    const insert = async (payload) => {
      // Insert with select() first; if RLS blocks reading the row back, the
      // plain insert below still records the application.
      const { data, error } = await supabase
        .from('applications')
        .insert([payload])
        .select()
        .single();
      if (!error && data) return { data };

      const { error: insertError } = await supabase.from('applications').insert([payload]);
      if (insertError) return { error: insertError };
      return { data: { success: true, ...payload } };
    };

    try {
      let result = await insert(applicationData);

      if (result.error && isMissingColumnError(result.error)) {
        console.warn(
          'applications table is missing the onboarding columns — run schemas/applications_onboarding.sql. Submitting in the legacy shape for now.',
          result.error,
        );
        result = await insert(toLegacyPayload(applicationData));
      }

      if (result.error) {
        console.warn('Supabase insert failed, storing in local fallback:', result.error);
        return storeApplicationLocally(applicationData);
      }
      return result.data;
    } catch (err) {
      console.warn('Supabase application submission caught exception, using local store:', err);
      return storeApplicationLocally(applicationData);
    }
  },

  getApplications: async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      const localApps = JSON.parse(localStorage.getItem('nvidia_club_applications') || '[]');
      if (error) {
        return localApps;
      }
      // Combine DB applications and local applications (avoiding duplicates by id)
      const dbIds = new Set((data || []).map(a => a.id));
      const combined = [...(data || []), ...localApps.filter(a => !dbIds.has(a.id))];
      return combined;
    } catch {
      return JSON.parse(localStorage.getItem('nvidia_club_applications') || '[]');
    }
  },

  getRecentApplications: async (limit = 5) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      const localApps = JSON.parse(localStorage.getItem('nvidia_club_applications') || '[]');
      if (error) {
        return localApps.slice(0, limit);
      }
      const dbIds = new Set((data || []).map(a => a.id));
      const combined = [...(data || []), ...localApps.filter(a => !dbIds.has(a.id))];
      return combined.slice(0, limit);
    } catch {
      const localApps = JSON.parse(localStorage.getItem('nvidia_club_applications') || '[]');
      return localApps.slice(0, limit);
    }
  },
};

// Dashboard Service
export const dashboardService = {
  getStats: async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { count: eventsCount } = await supabase.from('events').select('*', { count: 'exact', head: true });
      const { count: teamCount } = await supabase.from('team').select('*', { count: 'exact', head: true }).eq('is_active', true);
      const { count: upcomingCount } = await supabase.from('events').select('*', { count: 'exact', head: true }).gte('date', today).eq('is_published', true);
      const { count: applicationsCount } = await supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending');

      return {
        events: eventsCount || 0,
        team: teamCount || 0,
        upcoming: upcomingCount || 0,
        applications: applicationsCount || 0
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  }
};

// Homepage CMS Service
export const homepageService = {
  getHomepageContent: async () => {
    const { data, error } = await supabase
      .from('homepage_content')
      .select('*');
    if (error) throw error;
    return data;
  },

  updateHomepageSection: async (section, bodyData) => {
    const { data, error } = await supabase
      .from('homepage_content')
      .update({ body: bodyData })
      .eq('section', section)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

export default {
  auth: authService,
  events: eventsService,
  team: teamService,
  applications: applicationService,
  dashboard: dashboardService,
  homepage: homepageService,
};
