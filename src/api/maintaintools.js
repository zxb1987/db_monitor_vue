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
    // url: '/maintaintools/sshclient/',
    url: `/maintaintools/sshclient/${id}`,
    data: data,
    method: 'post'
  })
}
