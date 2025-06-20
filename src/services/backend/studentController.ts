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
  return request<API.BaseResponseBoolean>('/api/student/edit/' + params.id , {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

/**
 * 导入excel
 */
/**
 * 批量导入学生
 * @param file 上传的Excel文件
 */
export async function importExcelUsingPost(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    return request<API.BaseResponse<object>>('/api/student/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    });
  }

  /**
 * 获取学校列表
 *  */
export async function listSchool() {
    return request('/api/school/school/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: null,
    });
  }

    /**
 * 获取学校地址列表
 *  */
export async function listSchoolAddress() {
    return request('/api/school/address/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: null,
    });
  }