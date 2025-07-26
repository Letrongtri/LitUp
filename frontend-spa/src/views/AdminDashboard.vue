<script setup>
import { computed, inject, onMounted } from 'vue';
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
  Filler,
} from 'chart.js';
import { useStatistics } from '@/composables/useAdmin';

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
  Filler,
);

const tab = inject('tab');
tab.value = 'overview';

const { data, isLoading, error, refetch } = useStatistics();
const statistics = computed(() => {
  const rawStats = data.value?.stats;

  if (!rawStats) return {};

  // Clone dữ liệu ra để không mutate object readonly
  const stats = JSON.parse(JSON.stringify(rawStats));

  if (stats.userRolesData) {
    stats.userRolesData.datasets[0].backgroundColor = ['#FF6384', '#36A2EB', '#FFCE56'];
  }

  if (stats.submissionsData) {
    stats.submissionsData.datasets[0].backgroundColor = '#42A5F5';
    stats.submissionsData.datasets[0].borderRadius = 6;
  }

  if (stats.trendData) {
    const colors = ['#66BB6A', '#FFA726'];
    stats.trendData.datasets.forEach((dataset, i) => {
      dataset.borderColor = colors[i];
      dataset.backgroundColor = `${colors[i]}33`;
      dataset.fill = true;
      dataset.tension = 0.3;
      dataset.pointRadius = 4;
    });
  }

  return stats;
});
</script>

<template>
  <div v-if="isLoading" class="text-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div v-else class="container">
    <!-- Overview -->
    <div class="overview-grid">
      <div class="overview-card">
        <h3>Users</h3>
        <p class="count">{{ statistics.totalUsers }}</p>
        <p class="desc">Total number of accounts</p>
      </div>
      <div class="overview-card">
        <h3>Classrooms</h3>
        <p class="count">{{ statistics.totalClassrooms }}</p>
        <p class="desc">Class is active</p>
      </div>
      <div class="overview-card">
        <h3>Assignments</h3>
        <p class="count">{{ statistics.totalAssignments }}</p>
        <p class="desc">Total number of assignments</p>
      </div>
      <div class="overview-card">
        <h3>Submissions</h3>
        <p class="count">{{ statistics.totalSubmissions }}</p>
        <p class="desc">Total number of submissions</p>
      </div>
    </div>

    <div class="content-section">
      <h3 class="section-title">Detailed statistics</h3>
      <div class="charts-grid">
        <div class="chart-box">
          <h4>User classification</h4>
          <Doughnut v-if="statistics.userRolesData" :data="statistics.userRolesData" />
        </div>
        <div class="chart-box">
          <h4>Number of submissions per month</h4>
          <Bar v-if="statistics.submissionsData" :data="statistics.submissionsData" />
        </div>
        <div class="chart-box full">
          <h4>New exercise trends</h4>
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
