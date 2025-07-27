import assignmentsService from '@/services/assignments.service';
import submissionsService from '@/services/submissions.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

export function useSubmissionDetailByTeacher(id) {
  return useQuery({
    queryKey: ['submission.detail', id],
    queryFn: () => submissionsService.getSubmissionByTeacher(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGradeSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sid, data }) => submissionsService.gradeSubmission(sid, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['submission.detail']);
    },
  });
}

export function useSubmissionDetailByStudent(aid) {
  return useQuery({
    queryKey: ['student.submission.detail', aid],
    queryFn: () => assignmentsService.getAssignmentSubmissionByStudent(aid),
    enabled: !!aid,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSubmitAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ aid, data }) => assignmentsService.submitAssignment(aid, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['student.submission.detail']);
    },
  });
}

export function useUpdateSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ aid, data }) => assignmentsService.updateSubmission(aid, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['student.submission.detail']);
    },
  });
}

export function useDeleteSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sid) => submissionsService.deleteSubmission(sid),
    onSuccess: () => {
      queryClient.invalidateQueries(['assignment.detail']);
    },
  });
}
