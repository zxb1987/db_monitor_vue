import axios from '@/libs/api.request'

export const getCommandList = parameter => {
  return axios.request({
    url: `/maintaintools/api/command-list?${parameter}`,
    method: 'get'
  })
}

export const getLinuxList = parameter => {
  return axios.request({
    url: `/assets/api/linux?${parameter}`,
    method: 'get'
  })
}

export const createCommandList = data => {
  return axios.request({
    url: '/maintaintools/api/command-list',
    data: data,
    method: 'post'
  })
}

export const updateCommandList = (id, data) => {
  return axios.request({
    url: `/maintaintools/api/command-list/${id}`,
    data: data,
    method: 'PUT'
  })
}

export const deleteCommandList = id => {
  return axios.request({
    url: `/maintaintools/api/command-list/${id}`,
    method: 'delete'
  })
}

export const exec_command = (id, data) => {
  return axios.request({
    url: `/maintaintools/sshclient/${id}`,
    data: data,
    method: 'post'
  })
}
export const getUploadDownFileList = parameter => {
  return axios.request({
    url: `/maintaintools/api/uploaddownfile-list?${parameter}`,
    method: 'get'
  })
}

export const upload_file = (date) => {
  return axios.request({
    url: `/maintaintools/uploadfile`,
    method: 'post',
    data: date
    // headers: {
    //   'Content-Type': 'multipart/form-data'
    // }
  })
}

export const upload_fileall = (date) => {
  return axios.request({
    method: 'post',
    url: `/maintaintools/uploadfile/file`,
    data: date,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
