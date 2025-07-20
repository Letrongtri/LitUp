<script setup>
import AttachmentList from '@/components/AttachmentList.vue';
import CreateAndEditAssignment from '@/components/CreateAndEditAssignment.vue';
import MainPagination from '@/components/MainPagination.vue';
import assignmentsService from '@/services/assignments.service';
import classroomsService from '@/services/classrooms.service';
import { formatDate } from '@/utils/format';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const aid = Number(route.params?.aid);

const assignment = ref({});
const attachments = ref([]);
const members = ref([]);
const submissions = ref([]);

const totalSubmissionPage = ref(1);
const currentSubmissionPage = ref(1);

const showModal = ref(false);

async function retrieveAssignment() {
  try {
    const data = await assignmentsService.getAssignment(aid);
    assignment.value = data.assignment;
    attachments.value = assignment.value.attachments;
  } catch (error) {
    console.log(error);
  }
}

async function retrieveSubmissions(page) {
  try {
    const data = await assignmentsService.getSubmissions(aid, page);
    submissions.value = data.submissions;
    totalSubmissionPage.value = data.metadata.lastPage ?? 1;
  } catch (error) {
    console.log(error);
  }
}

async function retrieveMembers() {
  try {
    const data = await classroomsService.getMembers(assignment.value.cid);
    members.value = data.users;
  } catch (error) {
    console.log(error);
  }
}

function changeCurrentPage(page) {
  currentSubmissionPage.value = page;
}

const submittedMembersWithSubmission = computed(() => {
  return submissions.value.map((sub) => {
    const user = members.value.find((m) => m.user_id === sub.user_id);
    return {
      ...user,
      submission: sub,
    };
  });
});

const avgGrade = computed(() => {
  if (!submissions.value.length) return 0;

  const total = submissions.value.reduce((sum, submission) => {
    return sum + (submission.s_grade ?? 0);
  }, 0);

  return (total / submissions.value.length).toFixed(2);
});

const notSubmittedMembers = computed(() => {
  const submittedIds = new Set(submissions.value.map((s) => s.uid));
  return members.value.filter((m) => !submittedIds.has(m.uid));
});

const leftColumn = computed(() => {
  const mid = Math.ceil(notSubmittedMembers.value.length / 2);
  return notSubmittedMembers.value.slice(0, mid);
});

const rightColumn = computed(() => {
  const mid = Math.ceil(notSubmittedMembers.value.length / 2);
  return notSubmittedMembers.value.slice(mid);
});

onMounted(async () => {
  await retrieveAssignment();

  await retrieveMembers();
});

watch(currentSubmissionPage, () => retrieveSubmissions(currentSubmissionPage.value), {
  immediate: true,
});
</script>

<template>
  <div class="container py-5">
    <!-- Thông tin bài tập -->
    <div class="bg-white p-4 rounded shadow-sm mb-4">
      <div class="row">
        <div class="col-9">
          <h4 class="mb-3 text-primary fw-bold">{{ assignment.a_title }}</h4>
        </div>
        <div class="col-3 text-end">
          <button class="btn btn-primary" @click="showModal = true">
            <i class="fa fa-cog d-inline-block me-1" aria-hidden="true"></i>
            Setting
          </button>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-4">
          <p><strong>Created at: </strong> {{ formatDate(assignment.a_created_at) }}</p>
        </div>
        <div class="col-4">
          <p><strong>Deadline at: </strong> {{ formatDate(assignment.a_deadline_at) }}</p>
        </div>
        <div class="col-4">
          <p><strong>Max points: </strong> {{ assignment.a_max_points }}</p>
        </div>
        <div class="col-4">
          <p><strong>Allow late submission: </strong> {{ assignment.a_allow_late_submission }}</p>
        </div>
        <div class="col-4">
          <p>
            <strong>Status: </strong>
            <span class="text-success" v-if="assignment.a_status">Active</span>
            <span class="text-danger" v-else>Inactive</span>
          </p>
        </div>
        <div class="col-4">
          <p><strong>Total submissions: </strong> {{ submittedMembersWithSubmission.length }}</p>
        </div>
        <div class="col-4">
          <p><strong>Not yet submitted: </strong> {{ notSubmittedMembers.length }}</p>
        </div>
        <div class="col-4">
          <p><strong>Average scores: </strong> {{ avgGrade }}</p>
        </div>
      </div>
      <div class="row">
        <p><strong>Description: </strong> {{ assignment.a_description }}</p>
        <p><strong>Attachments: </strong>{{ attachments.length }}</p>
        <AttachmentList v-if="attachments" :attachments="attachments" />
      </div>
    </div>

    <CreateAndEditAssignment
      v-if="showModal"
      @updated="retrieveAssignment(aid)"
      @close="showModal = false"
      :assignment="assignment"
      :task="'update'"
    />

    <!-- Danh sách bài nộp -->
    <div class="bg-white p-4 rounded shadow-sm my-4">
      <h4 class="mb-3 text-dark">Danh sách bài nộp</h4>
      <table class="table table-bordered table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>No.</th>
            <th>Full name</th>
            <th>Status</th>
            <th>Submited Date</th>
            <th>Mark</th>
            <th>Attachments</th>
            <th>Late</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(member, index) in submittedMembersWithSubmission" :key="member.uid">
            <td>{{ index + 1 }}</td>
            <td>{{ member.u_first_name }} {{ member.u_last_name }}</td>
            <td><span class="text-success">Đã nộp</span></td>
            <td>19-7-2025</td>
            <td>9</td>
            <td>2</td>
            <td>False</td>
            <td>
              <button class="btn btn-sm btn-outline-secondary">Xem chi tiết</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex justify-content-center">
        <MainPagination
          v-if="submittedMembersWithSubmission.length > 0"
          :total-pages="totalSubmissionPage"
          :current-page="1"
          @update:current-page="changeCurrentPage"
        />
      </div>
    </div>

    <div class="bg-white p-4 rounded shadow-sm my-4">
      <h4 class="mb-3 text-dark">Danh sách chưa nộp</h4>
      <div class="row">
        <div class="col-md-6">
          <table class="table table-bordered table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>No.</th>
                <th>Full name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(member, index) in leftColumn" :key="member.uid">
                <td>{{ index + 1 }}</td>
                <td>{{ member.u_first_name }} {{ member.u_last_name }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="col-md-6">
          <table class="table table-bordered table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>No.</th>
                <th>Full name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(member, index) in rightColumn" :key="member.uid">
                <td>{{ index + leftColumn.length + 1 }}</td>
                <td>{{ member.u_first_name }} {{ member.u_last_name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
