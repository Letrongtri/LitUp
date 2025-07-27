import adminService from '@/services/admin.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed, unref } from 'vue';

export function useStatistics() {
  return useQuery({
    queryKey: ['admin.statistics'],
    queryFn: () => adminService.getStatistics(),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUsersByAdmin(page, limit) {
  return useQuery({
    queryKey: computed(() => ['admin.users', unref(page), unref(limit)]),
    queryFn: () => adminService.getUsersByAdmin(unref(page), unref(limit)),
    keepPreviousData: true,
  });
}

export function useUpdateUserByAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uid, data }) => adminService.editAccount(uid, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin.users']);
    },
  });
}

export function useClassroomsByAdmin(page, limit) {
  return useQuery({
    queryKey: computed(() => ['admin.classrooms', unref(page), unref(limit)]),
    queryFn: () => adminService.getClassroomsByAdmin(unref(page), unref(limit)),
    keepPreviousData: true,
  });
}

export function useUpdateClassroomByAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cid, data }) => adminService.editClassroom(cid, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin.classrooms']);
    },
  });
}

export function useAssignmentsByAdmin(page, limit) {
  return useQuery({
    queryKey: computed(() => ['admin.assignments', unref(page), unref(limit)]),
    queryFn: () => adminService.getAssignmentsByAdmin(unref(page), unref(limit)),
    keepPreviousData: true,
  });
}

export function useUpdateAssignmentByAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ aid, data }) => adminService.editAssignment(aid, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin.assignments']);
    },
  });
}

export function useSubmissionsByAdmin(page, limit) {
  return useQuery({
    queryKey: computed(() => ['admin.submissions', unref(page), unref(limit)]),
    queryFn: () => adminService.getSubmissionsByAdmin(unref(page), unref(limit)),
    keepPreviousData: true,
  });
}
