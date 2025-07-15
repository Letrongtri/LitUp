<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '@/services/litup_service';

const route = useRoute();
const assignment = ref(null);
const error = ref('');

onMounted(async () => {
  try {
    const result = await api.getAssignment(route.params.aid);
    assignment.value = result.assignment;
  } catch (err) {
    error.value = 'Không tải được bài tập: ' + err.message;
  }
});
</script>

<template>
  <div class="container mt-4">
    <h2>Chi tiết bài tập</h2>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="assignment">
      <p><strong>Tiêu đề:</strong> {{ assignment.a_title }}</p>
      <p><strong>Mô tả:</strong> {{ assignment.a_description }}</p>
      <p><strong>Điểm tối đa:</strong> {{ assignment.a_max_points }}</p>
      <p><strong>Hạn nộp:</strong> {{ assignment.a_deadline_at?.split('T')[0] }}</p>
      <p><strong>Cho phép nộp muộn:</strong> {{ assignment.a_allow_late_submission ? 'Có' : 'Không' }}</p>

      <!-- ✅ Hiển thị file đính kèm -->
      <div v-if="assignment.attachments?.length">
        <h5>File đính kèm:</h5>
        <ul>
          <li v-for="(file, index) in assignment.attachments" :key="index">
            <a :href="file.filepath" target="_blank" rel="noopener">{{ file.filename }}</a>
          </li>
        </ul>
      </div>
      <div v-else>
        <em>Không có file đính kèm</em>
      </div>
    </div>
  </div>
</template>
