import assignmentsService from '@/services/assignments.service';
import classroomsService from '@/services/classrooms.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

export function useAssignmentDetail(id) {
  return useQuery({
    queryKey: ['assignment.detail', id],
    queryFn: () => assignmentsService.getAssignment(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSubmissions(id, page, limit = 10) {
  return useQuery({
    queryKey: ['assignment.submissions', id, page],
    queryFn: () => assignmentsService.getSubmissions(id, page, limit),
    keepPreviousData: true,
    enabled: !!id,
  });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cid, payload }) => classroomsService.createAssignment(cid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['classroom.assignments']);
    },
  });
}

export function useUpdateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ aid, payload }) => assignmentsService.updateAssignment(aid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['assignment.detail']);
    },
  });
}

export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (aid) => assignmentsService.deleteAssignment(aid),
    onSuccess: () => {
      queryClient.invalidateQueries(['classroom.assignments']);
    },
  });
}
