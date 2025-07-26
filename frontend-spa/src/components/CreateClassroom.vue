<script setup>
import { ref } from 'vue';
import { useCreateClassroom } from '@/composables/useClassroom';

const emit = defineEmits(['created', 'close']);
const className = ref('');
const message = ref('');
const error = ref('');
const creating = ref(false);

const createClassroomMutation = useCreateClassroom();

async function handleCreateClassroom() {
  if (!className.value.trim()) return;

  creating.value = true;
  error.value = '';
  message.value = '';

  try {
    await createClassroomMutation.mutateAsync({ c_name: className.value.trim() });
    message.value = 'Create a successful class!';
    className.value = '';

    emit('created');
    emit('close');
  } catch (err) {
    error.value = err.message;
  } finally {
    creating.value = false;
  }
}
</script>

<template>
  <div class="form-box bg-white shadow rounded p-4 p-md-5">
    <h2 class="mb-4 text-primary fw-bold">Create a new class</h2>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="message" class="alert alert-success">{{ message }}</div>

    <form @submit.prevent="handleCreateClassroom">
      <div class="mb-3">
        <label for="className" class="form-label fw-semibold">Class name:* </label>
        <input
          id="className"
          type="text"
          v-model="className"
          class="form-control"
          placeholder="Example: Math 12A3, Web Programming 1..."
          required
        />
      </div>
      <div class="d-flex align-items-center justify-content-end">
        <button type="button" @click="emit('close')" class="btn btn-secondary px-4 py-2 me-3">
          Cancel
        </button>
        <button type="submit" :disabled="creating" class="btn btn-primary px-4 py-2">Create</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-box {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 16px;
}

input.form-control {
  border-radius: 10px;
}

button.btn {
  font-weight: 600;
  border-radius: 10px;
  font-size: 1rem;
}

.alert {
  border-radius: 8px;
  font-size: 0.95rem;
}
</style>
