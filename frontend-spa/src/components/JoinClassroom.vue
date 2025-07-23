<script setup>
import { ref, watch } from 'vue';
// import { useRouter } from 'vue-router';
import classroomsService from '@/services/classrooms.service';

const emit = defineEmits(['created', 'close']);
const className = ref('');
const classId = ref('');
const classCode = ref('');
const teacherName = ref('');

const message = ref('');
const error = ref('');
const creating = ref(false);

// const router = useRouter();

async function handleJoinClassroom() {
  //   if (!className.value || !cla) return;

  creating.value = true;
  error.value = '';
  message.value = '';

  try {
    const uid = JSON.parse(localStorage.getItem('user')).user.uid;
    if (!uid) throw new Error('UID not found');

    const joinData = { uid, c_code: classCode.value };

    await classroomsService.joinClassroom(classId.value, joinData);
    message.value = 'Join successfully!';
    className.value = '';
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

async function getClassInfo(cid) {
  if (classId.value) {
    try {
      const classroom = await classroomsService.getClassroom(cid);
      className.value = classroom.classroom.c_name;
      teacherName.value = classroom.classroom.teacher_name;
    } catch (error) {
      error.value = error.message;
      className.value = '';
      teacherName.value = '';
    }
  }
}

watch(classId, () => getClassInfo(classId.value));
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
        <label for="className" class="form-label fw-semibold">Class name: </label>
        <input id="className" type="text" v-model="className" class="form-control" disabled />
      </div>

      <div class="mb-3">
        <label for="teacherName" class="form-label fw-semibold">Teacher: </label>
        <input id="teacherName" type="text" v-model="teacherName" class="form-control" disabled />
      </div>

      <div class="mb-3">
        <label for="classCode" class="form-label fw-semibold">Class code:* </label>
        <input
          id="classCode"
          type="text"
          v-model="classCode"
          class="form-control"
          placeholder="VD: ABC123"
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
