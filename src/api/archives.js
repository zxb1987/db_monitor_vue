import axios from '@/libs/api.request'

export const getUserList = parameter => {
  return axios.request({
    url: `/user/api/user?${parameter}`,
    method: 'get'
  })
}

export const createUser = data => {
  return axios.request({
    url: '/user/api/user',
    data: data,
    method: 'post'
  })
}

export const updateUser = (id, data) => {
  return axios.request({
    url: `/user/api/user/${id}`,
    data: data,
    method: 'PUT'
  })
}

export const deleteUser = id => {
  return axios.request({
    url: `/user/api/user/${id}`,
    method: 'delete'
  })
}
