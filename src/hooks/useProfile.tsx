import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { getProfile, updateProfile } from '@/lib/supabase-helpers';
import { toast } from 'sonner';

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => getProfile(user!.id),
    enabled: !!user,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (updates: { start_semester_term?: string; start_semester_year?: number; focus_tag?: string | null }) =>
      updateProfile(user!.id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated');
    },
    onError: () => toast.error('Failed to update profile'),
  });
}
