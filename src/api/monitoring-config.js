import axios from '@/libs/api.request'

export const getMonitoringLog = parameter => {
  return axios.request({
    url: `/monitoring/api/Monitorin-log?${parameter}`,
    method: 'get'
  })
}

export const getMonitoringConfig = parameter => {
  return axios.request({
    url: `/monitoring/api/monitoring-config?${parameter}`,
    method: 'get'
  })
}
export const createMonitoringConfig = data => {
  return axios.request({
    url: '/monitoring/api/monitoring-config',
    data: data,
    method: 'post'
  })
}

export const updateMonitoringConfig = (id, data) => {
  return axios.request({
    url: `/monitoring/api/monitoring-config/${id}`,
    data: data,
    method: 'PUT'
  })
}

export const deleteMonitoringConfig = id => {
  return axios.request({
    url: `/monitoring/api/monitoring-config/${id}`,
    method: 'delete'
  })
}

export const getMonitoringInfo = parameter => {
  return axios.request({
    url: `/monitoring/api/monitoring-info?${parameter}`,
    method: 'get'
  })
}
