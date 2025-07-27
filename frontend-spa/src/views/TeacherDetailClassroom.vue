<script setup>
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import { formatDate } from '@/utils/format';
import AssignmentStudentList from '@/components/AssignmentList.vue';
import EditClassroom from '@/components/EditClassroom.vue';
import CreateAndEditAssignment from '@/components/CreateAndEditAssignment.vue';
import {
  useClassroomAssignments,
  useClassroomDetail,
  useClassroomMembers,
  useRemoveMember,
} from '@/composables/useClassroom';

const route = useRoute();
const cid = Number(route.params?.cid);

const {
  data: detailData,
  isLoading: isLoadingDetail,
  error: errorDetail,
  refetch: refetchDetail,
} = useClassroomDetail(cid);
const classroom = computed(() => detailData.value?.classroom || {});

const {
  data: assignmentsData,
  isLoading: isLoadingAssignments,
  error: errorAssignments,
  refetch: refetchAssignments,
} = useClassroomAssignments(cid);
const assignments = computed(() => assignmentsData.value ?? []);

const {
  data: membersData,
  isLoading: isLoadingMembers,
  error: errorMembers,
  refetch: refetchMembers,
} = useClassroomMembers(cid);
const members = computed(() => membersData.value?.users || []);

const showModalEditClassroom = ref(false);
const showModalAddAssignment = ref(false);
const tab = ref('information');

const selectedMemberIdx = ref(-1);
const selectedMember = computed(() => {
  if (selectedMemberIdx.value < 0) return null;
  return members.value[selectedMemberIdx.value];
});

const membersMutation = useRemoveMember();
async function removeMember(mid) {
  if (confirm('Do you want to remove this user from your class?')) {
    try {
      await membersMutation.mutateAsync({ cid, mid });
    } catch (error) {
      console.log(error);
    }
  }
}
</script>

<template>
  <div v-if="isLoadingDetail" class="text-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div v-else class="page-container bg-light">
    <!-- Class Banner -->
    <div class="class-header bg-white border-bottom shadow-sm">
      <div class="container py-4 px-3 d-flex align-items-center justify-content-between">
        <h2 class="fw-bold text-primary mb-1">{{ classroom.c_name }}</h2>
        <button class="btn btn-primary" @click="showModalEditClassroom = true">
          <i class="fa fa-cog d-inline-block me-1" aria-hidden="true"></i>
          Setting
        </button>
      </div>
    </div>

    <!-- Tabs nav -->
    <div class="tabs-nav border-bottom bg-white">
      <div class="container d-flex gap-4 px-3 py-2">
        <div
          class="tab-item"
          :class="tab === 'information' ? 'active' : ''"
          @click="tab = 'information'"
        >
          Information
        </div>
        <div class="tab-item" :class="tab === 'members' ? 'active' : ''" @click="tab = 'members'">
          Members
        </div>
      </div>
    </div>

    <EditClassroom
      v-if="showModalEditClassroom"
      @updated="refetchDetail"
      @close="showModalEditClassroom = false"
      :classroom="classroom"
    />

    <!-- Information tab -->
    <div v-if="tab === 'information'">
      <!-- Class Information -->
      <div class="container py-4">
        <div class="row g-3 mb-3">
          <div class="card rounded shadow p-3 border">
            <h5 class="card-title mb-3">Classroom Information</h5>
            <p class="card-text"><strong>Classname: </strong>{{ classroom.c_name }}</p>
            <p class="card-text"><strong>Class ID: </strong>{{ classroom.cid }}</p>
            <p class="card-text"><strong>Code: </strong>{{ classroom.c_code }}</p>
            <p class="card-text">
              <strong>Status: </strong>{{ classroom.c_status ? 'Active' : 'Inactive' }}
            </p>
            <p class="card-text">
              <strong>Created at: </strong>{{ formatDate(classroom.c_created_at) }}
            </p>
            <p class="card-text"><strong>Assignments: </strong>{{ assignments.length }}</p>
          </div>
        </div>

        <div v-if="isLoadingAssignments" class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-else>
          <CreateAndEditAssignment
            v-if="showModalAddAssignment"
            @updated="refetchAssignments"
            @close="showModalAddAssignment = false"
            :task="'create'"
          />
        </div>

        <div class="row g-3">
          <div class="card rounded shadow p-3 border">
            <div class="d-flex justify-content-between align-items-center m-3">
              <h5 class="card-title">Assignments</h5>
              <button class="btn btn-primary" @click="showModalAddAssignment = true">
                Add assignment
              </button>
            </div>

            <!-- Assignments list -->
            <AssignmentStudentList
              v-if="assignments.length > 0"
              :assignments="assignments"
              :role="'teacher'"
            />
            <p class="text-muted text-center mt-4" v-else>No exercises yet</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Member tab -->
    <div v-if="tab === 'members'">
      <div class="container py-4">
        <div v-if="isLoadingMembers" class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else class="row g-3 mb-3">
          <!-- Member table -->
          <div class="col-md-8">
            <div class="card rounded shadow p-3">
              <table class="table table-bordered table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>No.</th>
                    <th>Full name</th>
                    <th>Email</th>
                    <th>Join at</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(member, index) in members"
                    :class="{ 'table-active': index === selectedMemberIdx }"
                    :key="member.uid"
                    @click="selectedMemberIdx = index"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>{{ member.u_first_name }} {{ member.u_last_name }}</td>
                    <td>{{ member.u_email }}</td>
                    <td>{{ formatDate(member.m_joined_at) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Detail member -->
          <div v-if="selectedMember" class="col-md-4">
            <div class="card rounded shadow p-3">
              <div class="p-1 w-100 d-flex align-items-center justify-content-center">
                <img
                  class="img-fluid img-thumbnail"
                  :src="'http://localhost/' + selectedMember.avatar_url"
                  alt="avatar"
                />
              </div>
              <div class="p-1">
                <strong>Name: </strong>
                {{ selectedMember.u_first_name }} {{ selectedMember.u_last_name }}
              </div>
              <div class="p-1">
                <strong>Email: </strong>
                {{ selectedMember.u_email }}
              </div>
              <div class="p-1">
                <strong>Join at: </strong>
                {{ formatDate(selectedMember.m_joined_at) }}
              </div>
              <div class="p-1 text-end">
                <button @click="removeMember(selectedMember.mid)" class="btn btn-danger">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-section {
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
  padding: 2rem;
}

.page-container {
  background-color: #f5f6f9;
  min-height: 100vh;
}

.class-header {
  background: #fff;
}

.tabs-nav {
  border-bottom: 1px solid #e0e0e0;
  font-weight: 500;
}

.tab-item {
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 0.375rem;
  color: #444;
  transition: background 0.2s;
}

.tab-item:hover {
  background: #f0f0f0;
}

.tab-item.active {
  background: #e7f1ff;
  color: #007bff;
}

.card {
  border-radius: 0.375rem !important;
  background-color: #fff;
}

.card h6 {
  font-size: 1rem;
}

.btn {
  border-radius: 0.375rem;
}

.img-thumbnail {
  border-radius: 0.375rem;
}

.table {
  border-radius: 0.375rem;
  overflow: hidden;
}
</style>
