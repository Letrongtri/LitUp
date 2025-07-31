import { useMutation } from '@tanstack/vue-query';
import { useAuthStore } from '@/stores/auth';
import authService from '@/services/auth.service';

export function useLogin() {
  const auth = useAuthStore();

  return useMutation({
    mutationFn: (payload) => authService.login(payload),
    onSuccess: () => auth.fetchMe,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload) => authService.register(payload),
  });
}
