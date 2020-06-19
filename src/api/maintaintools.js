import axios from '@/libs/api.request'

// 命令列表
export const getCommandList = parameter => {
  return axios.request({
    url: `/maintaintools/api/command-list?${parameter}`,
    method: 'get'
  })
}

// linux列表
export const getLinuxList = parameter => {
  return axios.request({
    url: `/assets/api/linux?${parameter}`,
    method: 'get'
  })
}

// 创建（添加）命令
export const createCommandList = data => {
  return axios.request({
    url: '/maintaintools/api/command-list',
    data: data,
    method: 'post'
  })
}

// 更新命令
export const updateCommandList = (id, data) => {
  return axios.request({
    url: `/maintaintools/api/command-list/${id}`,
    data: data,
    method: 'PUT'
  })
}

// 删除命令
export const deleteCommandList = id => {
  return axios.request({
    url: `/maintaintools/api/command-list/${id}`,
    method: 'delete'
  })
}

// 执行命令
export const exec_command = (id, data) => {
  return axios.request({
    url: `/maintaintools/sshclient/${id}`,
    data: data,
    method: 'post'
  })
}

// 获取文件上传下载记录列表
export const getUploadDownFileList = parameter => {
  return axios.request({
    url: `/maintaintools/api/uploaddownfile-list?${parameter}`,
    method: 'get'
  })
}

// 文件上传
export const upload_file = (date) => {
  return axios.request({
    url: `/maintaintools/uploadfile`,
    method: 'post',
    data: date
  })
}

// 文件夹同步（未完）
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

// 根据电脑ID获取文件夹（未完）
export const ssh_Folder = (ssh_id, date) => {
  return axios.request({
    method: 'get',
    url: `/maintaintools/uploadfile/Folder/${ssh_id}`,
    data: date

  })
}
