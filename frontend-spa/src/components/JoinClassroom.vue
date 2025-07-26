<script setup>
import { ref } from 'vue';
import { useJoinClassroom } from '@/composables/useClassroom';

const emit = defineEmits(['created', 'close']);
const classId = ref('');
const classCode = ref('');

const message = ref('');
const error = ref('');
const creating = ref(false);

const joinClassroomMutation = useJoinClassroom();
async function handleJoinClassroom() {
  creating.value = true;
  error.value = '';
  message.value = '';

  try {
    const joinData = { c_code: classCode.value };

    await joinClassroomMutation.mutateAsync({ cid: classId.value, data: joinData });
    message.value = 'Join successfully!';
    classId.value = '';
    classCode.value = '';

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
    <h2 class="mb-4 text-primary fw-bold">Join Classroom</h2>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="message" class="alert alert-success">{{ message }}</div>

    <form @submit.prevent="handleJoinClassroom">
      <div class="mb-3">
        <label for="classId" class="form-label fw-semibold">Class ID:* </label>
        <input id="classId" type="number" v-model="classId" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="classCode" class="form-label fw-semibold">Class code:* </label>
        <input
          id="classCode"
          type="text"
          v-model="classCode"
          class="form-control"
          placeholder="Ex: ABC123"
          required
        />
      </div>
      <div class="d-flex align-items-center justify-content-end">
        <button type="button" @click="emit('close')" class="btn btn-secondary px-4 py-2 me-3">
          Cancel
        </button>
        <button type="submit" :disabled="creating" class="btn btn-primary px-4 py-2">Join</button>
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
