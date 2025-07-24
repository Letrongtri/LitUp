function getAuthHeaders() {
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  
  async function efetch(url, options = {}) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    };
  
    const res = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
    });
  
    const json = await res.json().catch(() => ({}));
    console.log('[efetch] response from', url, ':', json);
  
    if (!res.ok || json.status !== 'success') {
      const msg = json.message || res.statusText || 'Server error';
      throw new Error(msg);
    }
  
    if (json.data?.classrooms && Array.isArray(json.data.classrooms)) {
      return json.data.classrooms;
    }
  
    return json.data;
  }
  
  async function efetchFormData(url, formData, options = {}) {
    const headers = {
      ...getAuthHeaders(),
      // Do not set Content-Type for FormData, browser will handle it
    };
  
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
      headers,
      ...options,
    });
  
    const json = await res.json().catch(() => ({}));
    console.log('[efetchFormData] response from', url, ':', json);
  
    if (!res.ok || json.status !== 'success') {
      const msg = json.message || res.statusText || 'Upload failed';
      throw new Error(msg);
    }
  
    return json.data;
  }
  
  export const api = {
    login: (data) =>
      efetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  
    register: (data) =>
      efetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  
    getUserProfile: () => {
      const stored = JSON.parse(localStorage.getItem('user'));
      const uid = stored?.uid || stored?.u_id;
      if (!uid) throw new Error('Bạn chưa đăng nhập hoặc thiếu u_id');
      return efetch(`/api/users/${uid}`);
    },
  
    getClassroomDetail: (cid) => efetch(`/api/classrooms/${cid}`),
  
    getStudentsInClass: (cid, page = 1, limit = 10) => {
      const safePage = Number(page) || 1;
      const safeLimit = Number(limit) || 10;
      return efetch(`/api/classrooms/${cid}/members?page=${safePage}&limit=${safeLimit}`);
    },
  
    getTeacherClassrooms: (uid, page = 1, limit = 10) =>
      efetch(`/api/classrooms/teacher?uid=${uid}&role=teacher&page=${page}&limit=${limit}`),
  
    createClassroom: (uid, name) =>
      efetch('/api/classrooms', {
        method: 'POST',
        body: JSON.stringify({ uid, c_name: name }),
      }),
  
    updateClassroom: (cid, data) =>
      efetch(`/api/classrooms/${cid}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  
    deleteClassroom: (cid) =>
      efetch(`/api/classrooms/${cid}`, {
        method: 'DELETE',
      }),
  
    getAssignments(classroomId, page = 1, limit = 10) {
      const safePage = Number(page) || 1;
      const safeLimit = Number(limit) || 10;
      return efetch(`/api/classrooms/${classroomId}/assignments?page=${safePage}&limit=${safeLimit}`);
    },
    getAssignment(aid) {
        return efetch(`/api/assignments/${aid}`);
      },
      
  
    getSubmissions: (aid) => efetch(`/api/assignments/${aid}/submissions`),
  
    createAssignmentWithFiles: (cid, formData) =>
        efetchFormData(`/api/classrooms/${cid}/assignments`, formData),
    updateAssignmentWithFiles(aid, formData) {
        return efetchFormData(`/api/assignments/${aid}`, formData, {
          method: 'PUT' 
        });
    },
    deleteAssignment: (aid) =>
        efetch(`/api/assignments/${aid}`, {
        method: 'DELETE',
    }),
    getSubmissions: (aid, page = 1, limit = 10) =>
        efetch(`/api/assignments/${aid}/submissions?page=${page}&limit=${limit}`),
      
      getSubmission: (sid) =>
        efetch(`/api/submissions/${sid}`),
      
      gradeSubmission: (sid, data) =>
        efetch(`/api/submissions/${sid}/grade`, {
          method: 'PUT',
          body: JSON.stringify(data),
        }),
        getStudentClassrooms: (uid, page = 1, limit = 10) =>
            efetch(`/api/classrooms/student?uid=${uid}&role=student&page=${page}&limit=${limit}`),
          
      
      
      
  };
  