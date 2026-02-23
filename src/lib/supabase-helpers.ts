import { supabase } from "@/integrations/supabase/client";

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: {
  start_semester_term?: string;
  start_semester_year?: number;
  focus_tag?: string | null;
}) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getModules() {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .order('module_group')
    .order('area')
    .order('title');
  if (error) throw error;
  return data || [];
}

export async function getUserModules(userId: string) {
  const { data, error } = await supabase
    .from('user_modules')
    .select('*, modules(*)')
    .eq('user_id', userId);
  if (error) throw error;
  return data || [];
}

export async function addUserModule(userId: string, moduleId: string, semesterTerm: string, semesterYear: number) {
  const { data, error } = await supabase
    .from('user_modules')
    .insert({
      user_id: userId,
      module_id: moduleId,
      semester_term: semesterTerm,
      semester_year: semesterYear,
      status: 'planned',
    })
    .select('*, modules(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function updateUserModuleStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from('user_modules')
    .update({ status })
    .eq('id', id)
    .select('*, modules(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function updateUserModuleSemester(id: string, semesterTerm: string, semesterYear: number) {
  const { data, error } = await supabase
    .from('user_modules')
    .update({ semester_term: semesterTerm, semester_year: semesterYear })
    .eq('id', id)
    .select('*, modules(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function removeUserModule(id: string) {
  const { error } = await supabase
    .from('user_modules')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function updateUserModuleEcts(id: string, customEcts: number) {
  const { data, error } = await supabase
    .from('user_modules')
    .update({ custom_ects: customEcts })
    .eq('id', id)
    .select('*, modules(*)')
    .single();
  if (error) throw error;
  return data;
}
