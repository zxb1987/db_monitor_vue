import axios from '@/libs/api.request'

export const getAppList = parameter => {
  return axios.request({
    url: `/app/api/app?${parameter}`,
    method: 'get'
  })
}

export const createApp = data => {
  return axios.request({
    url: '/app/api/app',
    data: data,
    method: 'post'
  })
}

export const updateApp = (id, data) => {
  return axios.request({
    url: `/app/api/app/${id}`,
    data: data,
    method: 'PUT'
  })
}

export const deleteApp = id => {
  return axios.request({
    url: `/app/api/app/${id}`,
    method: 'delete'
  })
}
