<script setup>
import adminService from '@/services/admin.service';
import { inject, onMounted, ref } from 'vue';
import { Bar, Doughnut, Line } from 'vue-chartjs';

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
);

const statistics = ref({});
const tab = inject('tab');

async function retrieveStatistics() {
  try {
    const data = await adminService.getStatistics();
    statistics.value = data.stats;

    if (statistics.value.userRolesData) {
      statistics.value.userRolesData.datasets[0].backgroundColor = [
        '#FF6384', // Admin
        '#36A2EB', // Teacher
        '#FFCE56', // Student
      ];
    }

    if (statistics.value.submissionsData) {
      statistics.value.submissionsData.datasets[0].backgroundColor = '#42A5F5';
      statistics.value.submissionsData.datasets[0].borderRadius = 6;
    }

    if (statistics.value.trendData) {
      const colors = ['#66BB6A', '#FFA726'];
      statistics.value.trendData.datasets.forEach((dataset, i) => {
        dataset.borderColor = colors[i];
        dataset.backgroundColor = `${colors[i]}33`; // thêm độ trong suốt
        dataset.fill = true;
        dataset.tension = 0.3;
        dataset.pointRadius = 4;
      });
    }
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  tab.value = 'overview';
  await retrieveStatistics();
});
</script>

<template>
  <div class="container">
    <!-- Tổng quan -->
    <div class="overview-grid">
      <div class="overview-card">
        <h3>Users</h3>
        <p class="count">{{ statistics.totalUsers }}</p>
        <p class="desc">Tổng số tài khoản</p>
      </div>
      <div class="overview-card">
        <h3>Classrooms</h3>
        <p class="count">{{ statistics.totalClassrooms }}</p>
        <p class="desc">Lớp đang hoạt động</p>
      </div>
      <div class="overview-card">
        <h3>Assignments</h3>
        <p class="count">{{ statistics.totalAssignments }}</p>
        <p class="desc">Tổng số bài được giao</p>
      </div>
      <div class="overview-card">
        <h3>Submissions</h3>
        <p class="count">{{ statistics.totalSubmissions }}</p>
        <p class="desc">Tổng số bài đã nộp</p>
      </div>
    </div>

    <!-- Placeholder cho biểu đồ (nếu cần sau này) -->
    <div class="content-section">
      <h3 class="section-title">Thống kê chi tiết</h3>
      <div class="charts-grid">
        <div class="chart-box">
          <h4>Phân loại người dùng</h4>
          <Doughnut v-if="statistics.userRolesData" :data="statistics.userRolesData" />
        </div>
        <div class="chart-box">
          <h4>Số bài nộp theo tháng</h4>
          <Bar v-if="statistics.submissionsData" :data="statistics.submissionsData" />
        </div>
        <div class="chart-box full">
          <h4>Xu hướng bài tập mới</h4>
          <Line v-if="statistics.trendData" :data="statistics.trendData" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.overview-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.overview-card h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.overview-card .count {
  font-size: 2.5rem;
  font-weight: bold;
  color: #007bff;
}

.overview-card .desc {
  color: #6c757d;
}

/* Section placeholder */
.content-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.section-title {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}
.placeholder-text {
  color: #6c757d;
}

/* Biểu đồ */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
.chart-box {
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}
.chart-box h4 {
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #343a40;
}
.chart-box.full {
  grid-column: span 2;
}
</style>
