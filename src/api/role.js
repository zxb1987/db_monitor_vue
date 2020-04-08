import axios from '@/libs/api.request'
/// role/api/role?接收后台传到前台的url数据值
// 用户角色信息表的增删改查，和后台urls-->path(date)进行数据交互的
export const createRole = data => {
  return axios.request({
    url: '/role/api/role',
    data: data,
    method: 'post'
  })
}
export const getRoleList = parameter => {
  return axios.request({
    url: `/role/api/role?${parameter}`,
    method: 'get'
  })
}

export const updateRole = (id, data) => {
  return axios.request({
    url: `/role/api/role/${id}`,
    data: data,
    method: 'PUT'
  })
}

export const deleteRole = id => {
  return axios.request({
    url: `/role/api/role/${id}`,
    method: 'delete'
  })
}
