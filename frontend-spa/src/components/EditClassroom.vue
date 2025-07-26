<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDeleteClassroom, useUpdateClassroom } from '@/composables/useClassroom';

const route = useRoute();
const router = useRouter();

const cid = route.params.cid;

const emit = defineEmits(['updated', 'close']);
const props = defineProps({
  classroom: { type: Object },
});

const className = ref(props.classroom.c_name);
const error = ref('');
const message = ref('');
const updating = ref(false);
const status = ref(props.classroom.c_status);

const updateClassroomMutation = useUpdateClassroom();
const deleteClassroomMutation = useDeleteClassroom();

async function updateClassroom() {
  updating.value = true;
  error.value = '';
  message.value = '';

  try {
    await updateClassroomMutation.mutateAsync({
      cid,
      data: { c_name: className.value, c_status: status.value },
    });
    message.value = 'Class update successful!';

    emit('updated');
    emit('close');
  } catch (err) {
    error.value = 'Update failed: ' + err.message;
  } finally {
    updating.value = false;
  }
}

async function deleteClassroom() {
  error.value = '';
  message.value = '';
  if (confirm('Do you want to delete this classroom?')) {
    try {
      await deleteClassroomMutation.mutateAsync(cid);
      message.value = 'Class update successful!';
      router.push('/teacher/classrooms');
    } catch (err) {
      error.value = 'Update failed: ' + err.message;
    }
  }
}
</script>

<template>
  <div class="form-box bg-white shadow rounded p-4 p-md-5 my-4">
    <h2 class="mb-4 text-primary fw-bold">Edit Classroom</h2>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="message" class="alert alert-success">{{ message }}</div>

    <form @submit.prevent="updateClassroom">
      <div class="mb-3">
        <label for="className" class="form-label fw-semibold">Classroom name: </label>
        <input id="className" type="text" v-model="className" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label fw-semibold">Status</label>

        <div class="d-flex align-items-center">
          <input
            id="status-active"
            type="radio"
            v-model="status"
            :value="true"
            :selected="status"
          />
          <label for="status-active" class="my-0 ms-2 me-4 form-label fw-semibold">Active</label>

          <input
            id="status-inactive"
            type="radio"
            v-model="status"
            :value="false"
            :selected="!status"
          />
          <label for="status-inactive" class="my-0 ms-2 me-4 form-label fw-semibold"
            >Inactive</label
          >
        </div>
      </div>

      <div class="d-flex align-items-center justify-content-end">
        <button type="button" @click="emit('close')" class="btn btn-secondary px-4 py-2 me-3">
          Cancel
        </button>
        <button type="submit" :disabled="updating" class="btn btn-primary px-4 py-2 me-3">
          Update
        </button>
        <button type="button" @click="deleteClassroom" class="btn btn-danger px-4 py-2">
          Delete
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
}

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
