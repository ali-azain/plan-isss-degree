import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import {
  getModules,
  getUserModules,
  addUserModule,
  updateUserModuleStatus,
  updateUserModuleSemester,
  removeUserModule,
  updateUserModuleEcts,
} from '@/lib/supabase-helpers';
import { toast } from 'sonner';

export function useAllModules() {
  return useQuery({
    queryKey: ['modules'],
    queryFn: getModules,
    staleTime: 1000 * 60 * 10,
  });
}

export function useUserModules() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['user-modules', user?.id],
    queryFn: () => getUserModules(user!.id),
    enabled: !!user,
  });
}

export function useAddModule() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: ({ moduleId, semesterTerm, semesterYear }: { moduleId: string; semesterTerm: string; semesterYear: number }) =>
      addUserModule(user!.id, moduleId, semesterTerm, semesterYear),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user-modules'] });
      toast.success('Module added to plan');
    },
    onError: (err: any) => toast.error(err.message || 'Failed to add module'),
  });
}

export function useUpdateStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateUserModuleStatus(id, status),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ['user-modules'] });
      const prev = qc.getQueryData(['user-modules']);
      qc.setQueryData(['user-modules'], (old: any) =>
        old?.map((um: any) => um.id === id ? { ...um, status } : um)
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['user-modules'], ctx.prev);
      toast.error('Failed to update status');
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['user-modules'] }),
  });
}

export function useUpdateSemester() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, semesterTerm, semesterYear }: { id: string; semesterTerm: string; semesterYear: number }) =>
      updateUserModuleSemester(id, semesterTerm, semesterYear),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['user-modules'] }),
    onError: () => toast.error('Failed to move module'),
  });
}

export function useRemoveModule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeUserModule(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user-modules'] });
      toast.success('Module removed');
    },
    onError: () => toast.error('Failed to remove module'),
  });
}

export function useUpdateEcts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ects }: { id: string; ects: number }) => updateUserModuleEcts(id, ects),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['user-modules'] }),
    onError: () => toast.error('Failed to update ECTS'),
  });
}
