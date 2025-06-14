import { request } from '@umijs/max';

/**
 * 删除学生
 * @param params
 */
export async function deleteStudentUsingPost(params: { id: number }) {
  return request<API.BaseResponseBoolean>('/api/student/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

/**
 * 分页获取学生列表
 * @param params
 */
export async function listStudentByPageUsingPost(params: API.StudentQueryRequest) {
  return request<API.BaseResponsePageStudent>('/api/student/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

/**
 * 添加学生
 * @param params
 */
export async function addStudentUsingPost(params: API.StudentAddRequest) {
  return request<API.BaseResponseLong>('/api/student/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

/**
 * 更新学生
 * @param params
 */
export async function updateStudentUsingPost(params: API.StudentUpdateRequest) {
  return request<API.BaseResponseBoolean>('/api/student/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}