<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { formatDate } from '@/utils/format';
import AttachmentList from '@/components/AttachmentList.vue';
import { useAssignmentDetail } from '@/composables/useAssignment';
import {
  useDeleteSubmission,
  useSubmissionDetailByStudent,
  useSubmitAssignment,
  useUpdateSubmission,
} from '@/composables/useSubmission';

const route = useRoute();

const message = ref('');
const error = ref('');
const handling = ref(false);

const aid = Number(route.params.aid);

const submitAttachments = ref([]);

const {
  data: detailData,
  isLoading: isLoadingDetail,
  error: errorDetail,
  refetch: refetchDetail,
} = useAssignmentDetail(aid);
const assignment = computed(() => detailData.value?.assignment || {});

const {
  data: submissionData,
  isLoading: isLoadingSubmission,
  error: errorSubmission,
  refetch: refetchSubmission,
} = useSubmissionDetailByStudent(aid);
const submission = computed(() => submissionData.value?.submission || {});

const submitAssignmentMutation = useSubmitAssignment();
const updateSubmissionMutation = useUpdateSubmission();
const deleteSubmissionMutation = useDeleteSubmission();

async function createSubmission() {
  handling.value = true;
  error.value = '';
  message.value = '';

  try {
    const formData = new FormData();
    Array.from(submitAttachments.value).forEach((file) => {
      formData.append('attachments', file);
    });

    await submitAssignmentMutation.mutateAsync({ aid, data: formData });
    message.value = 'Submit successfully!';
  } catch (err) {
    error.value = 'Submit failed: ' + err.message;
  } finally {
    handling.value = false;
  }
}

async function updateSubmission() {
  handling.value = true;
  error.value = '';
  message.value = '';

  try {
    const formData = new FormData();
    Array.from(submitAttachments.value).forEach((file) => {
      formData.append('attachments', file);
    });

    await updateSubmissionMutation.mutateAsync({ aid, data: formData });
    message.value = 'Update successfully!';
  } catch (err) {
    error.value = 'Update failed: ' + err.message;
  } finally {
    handling.value = false;
  }
}

async function deleteSubmission(sid) {
  handling.value = true;
  error.value = '';
  message.value = '';
  console.log(sid);

  try {
    await deleteSubmissionMutation.mutateAsync(sid);
    message.value = 'Delete successfully!';
  } catch (err) {
    error.value = 'Delete failed: ' + err.message;
  } finally {
    handling.value = false;
  }
}

function handleFileChange(e) {
  submitAttachments.value = Array.from(e.target.files);
}
</script>

<template>
  <div v-if="isLoadingDetail" class="text-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div v-else class="page-container bg-light py-5">
    <div class="class-header bg-white border-bottom shadow-sm">
      <div class="container py-4 px-3">
        <h2 class="fw-bold text-primary mb-1">{{ assignment.a_title }}</h2>
      </div>
    </div>

    <div class="container my-3">
      <div class="row g-3 mb-3">
        <div class="col-md-8">
          <div class="card p-3 mb-3">
            <div v-if="assignment.a_description" class="mb-3">
              <p><strong>Description: </strong> {{ assignment.a_description }}</p>
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-4">
                <p><strong>Max points: </strong> {{ assignment.a_max_points }}</p>
              </div>
              <div class="col-md-4">
                <p><strong>Deadline:</strong> {{ formatDate(assignment.a_deadline_at) }}</p>
              </div>
              <div class="col-md-4">
                <p>
                  <strong>Allow late submission:</strong>
                  {{ assignment.a_allow_late_submission ? ' Yes' : ' No' }}
                </p>
              </div>
            </div>

            <div class="mb-3">
              <p><strong>Attachments:</strong> {{ assignment.attachments?.length }}</p>

              <div v-if="assignment.attachments?.length > 0">
                <AttachmentList :attachments="assignment.attachments" />
              </div>
            </div>
          </div>

          <div v-if="submission.sid" class="card p-3">
            <h5 class="card-title">Your submission</h5>

            <div class="mb-3">
              <p><strong>Attachments:</strong> {{ submission.attachments?.length }}</p>

              <div v-if="submission.attachments?.length > 0" class="my-3">
                <AttachmentList :attachments="submission.attachments" />
              </div>
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-4">
                <p><strong>Submitted at:</strong> {{ formatDate(submission.s_submitted_at) }}</p>
              </div>
              <div class="col-md-4">
                <p><strong>Updated at:</strong> {{ formatDate(submission.s_updated_at) }}</p>
              </div>
              <div class="col-md-4">
                <p><strong>Status: </strong> {{ submission.s_status }}</p>
              </div>
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-4">
                <p><strong>Grade:</strong> {{ submission.s_grade }}</p>
              </div>
              <div class="col-md-4">
                <p><strong>Graded at: </strong> {{ formatDate(submission.s_graded_at) }}</p>
              </div>
              <div class="col-md-4">
                <p><strong>Comment: </strong> {{ submission.s_comment }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card p-3">
            <div class="">
              <h2 class="mb-4 text-primary fw-bold">Submission</h2>

              <div v-if="error" class="alert alert-danger">{{ error }}</div>
              <div v-if="message" class="alert alert-success">{{ message }}</div>

              <form @submit.prevent="createSubmission" enctype="multipart/form-data">
                <div class="mb-4">
                  <label class="form-label fw-semibold">Upload your attachments:</label>
                  <input
                    type="file"
                    multiple
                    class="form-control"
                    @change="handleFileChange"
                    required
                  />
                </div>

                <div class="d-flex align-items-center justify-content-end">
                  <button
                    type="button"
                    v-if="submission.sid"
                    @click="updateSubmission"
                    :disabled="handling"
                    class="btn btn-warning px-4 py-2 me-3"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    v-if="submission.sid"
                    @click="deleteSubmission(submission.sid)"
                    :disabled="handling"
                    class="btn btn-danger px-4 py-2"
                  >
                    Delete
                  </button>
                  <button
                    type="submit"
                    v-else
                    :disabled="handling"
                    class="btn btn-primary px-4 py-2 me-3"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="card assignment-box bg-white p-4 p-md-5">
        <div v-if="assignment.a_description" class="mb-3">
          <p><strong>Description: </strong> {{ assignment.a_description }}</p>
        </div>

        <div class="row g-3 mb-3">
          <div class="col-md-4">
            <p><strong>Max points: </strong> {{ assignment.a_max_points }}</p>
          </div>
          <div class="col-md-4">
            <p><strong>Deadline:</strong> {{ formatDate(assignment.a_deadline_at) }}</p>
          </div>
          <div class="col-md-4">
            <p>
              <strong>Allow late submission:</strong>
              {{ assignment.a_allow_late_submission ? ' Yes' : ' No' }}
            </p>
          </div>
        </div>

        <div class="mb-3">
          <p><strong>Attachments:</strong> {{ assignment.attachments?.length }}</p>

          <div v-if="assignment.attachments?.length > 0">
            <AttachmentList :attachments="assignment.attachments" />
          </div>
        </div>
      </div> -->
    </div>

    <!-- submission -->
    <!-- <div class="container my-3">
      <div class="row">
        <div class="col-md-8">
          <div class="card assignment-box bg-white p-4 p-md-5">
            <h2 class="mb-4 text-primary fw-bold">Your submission</h2>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card assignment-box bg-white p-4 p-md-5">
            <h2 class="mb-4 text-primary fw-bold">Submission</h2>

            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <div v-if="message" class="alert alert-success">{{ message }}</div>

            <form @submit.prevent="handleSubmission" enctype="multipart/form-data">
              <div class="mb-4">
                <label class="form-label fw-semibold">Upload your attachments:</label>
                <input type="file" multiple class="form-control" @change="handleFileChange" />
              </div>

              <div class="d-flex align-items-center justify-content-end">
                <button type="button" class="btn btn-secondary px-4 py-2 me-3">Cancel</button>
                <button type="submit" :disabled="handling" class="btn btn-primary px-4 py-2 me-3">
                  Submit
                </button>
                <button type="button" @click="deleteAssignment" class="btn btn-danger px-4 py-2">
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
}

.alert {
  border-radius: 8px;
  font-size: 0.95rem;
}

p {
  margin: 0;
}

h2 {
  font-size: 2rem;
  font-weight: 700;
}

.card-title,
h5 {
  font-size: 1.3rem;
  font-weight: 600;
}

p,
strong,
label,
.alert {
  font-size: 1.05rem;
}

button {
  font-size: 1rem;
}
</style>
