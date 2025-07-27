import classroomsService from '@/services/classrooms.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed, unref } from 'vue';

export function useClassroomsByTeacher(page) {
  return useQuery({
    queryKey: computed(() => ['teacher.classrooms', unref(page)]),
    queryFn: () => classroomsService.getClassroomsByTeacher(unref(page)),
    keepPreviousData: true,
  });
}

export function useClassroomsByStudent(page) {
  return useQuery({
    queryKey: computed(() => ['student.classrooms', unref(page)]),
    queryFn: () => classroomsService.getClassrooms(unref(page)),
    keepPreviousData: true,
  });
}

export function useCreateClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => classroomsService.createClassroom(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['teacher.classrooms']);
    },
  });
}

export function useClassroomDetail(id) {
  return useQuery({
    queryKey: computed(() => ['classroom.detail', unref(id)]),
    queryFn: () => classroomsService.getClassroom(unref(id)),
    enabled: computed(() => !!unref(id)),
    staleTime: 1000 * 60 * 5,
  });
}

export function useClassroomAssignments(id) {
  return useQuery({
    queryKey: ['classroom.assignments', id],
    queryFn: () => classroomsService.getClassroomAssignment(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useClassroomMembers(id) {
  return useQuery({
    queryKey: computed(() => ['classroom.members', unref(id)]),
    queryFn: () => classroomsService.getMembers(unref(id)),
    enabled: computed(() => !!unref(id)),
    staleTime: 1000 * 60 * 5,
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cid, mid }) => classroomsService.removeMember(cid, mid),
    onSuccess: () => {
      queryClient.invalidateQueries(['classroom.detail']);
      queryClient.invalidateQueries(['classroom.members']);
    },
  });
}

export function useDeleteClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => classroomsService.deleteClassroom(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['teacher.classrooms']);
    },
  });
}

export function useUpdateClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cid, data }) => classroomsService.updateClassroom(cid, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['classroom.detail']);
    },
  });
}

export function useJoinClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cid, data }) => classroomsService.joinClassroom(cid, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['student.classrooms']);
    },
  });
}
