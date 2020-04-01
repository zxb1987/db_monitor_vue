import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  const data = {
    username: userName,
    password
  }
  return axios.request({
    url: '/api/auth',
    data,
    method: 'post'
  })
}

export const getRoleList = parameter => {
  return axios.request({
    url: `/api/role-list?${parameter}`,
    method: 'get'
  })
}

export const logout = token => {
  return axios.request({
    url: '/system/api/logout',
    data: {
      token
    },
    method: 'post'
  })
}
