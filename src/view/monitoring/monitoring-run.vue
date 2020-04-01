<template>
  <Row>
    <Card>
      <Row>
        <Button @click="add"
                type="primary"
                v-if="addAccessAll">添加
        </Button>&nbsp;
        <Input placeholder="业务名称"
               style="width: 100px"
               v-model="monitoring_name_search"/>&nbsp;
        <Button @click="search"
                type="primary">搜索
        </Button>&nbsp;
        <Button @click="clear_search"
                type="success">刷新
        </Button>
      </Row>
      <br>
      <Row>
        <Table :columns="columns"
               :data="data"
               border>

        </Table>
      </Row>
      <Row>
        <br>
        <Page :page_size='page_size'
              :total="count"
              @on-change="get_monitoring_run_parameter"
              show-elevator
              show-total/>
      </Row>
      <Row>
        <Drawer :mask-closable="this.close"
                :styles="styles"
                title="SQL配置"
                v-model="create"
                width="720">
          <Form :model="formData"
                :rules="ruleValidate"
                ref="formData">
            <Alert show-icon>基础信息</Alert>
            <Row :gutter="32">
              <Col span="8">
                <FormItem label="检测项目名称"
                          label-position="top"
                          prop="name">
                  <Input placeholder="检测项目名称"
                         v-model="formData.name">
                  </Input>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="SQL检测指标名称"
                          label-position="top"
                          prop="monitoring_run_id">
                  <Select v-model="formData.monitoring_run_id"
                          placeholder="选择SQL检测指标名称">
                    <Option v-for="item in monitoringconfiglist" :value="item.name" :key="item.id"
                            :label="item.name"></Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="数据库服务"
                          label-position="top"
                          prop="mysql_list_id">
                  <Select v-model="formData.mysql_list_id"
                          placeholder="选择数据库服务">
                    <Option v-for="item in databases" :value="item.tags" :key="item.tags" :label="item.tags"></Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="数据库名称"
                          label-position="top"
                          prop="database_name">
                  <Select v-model="formData.database_name"
                          placeholder="选择数据库名称">
                    <Option v-for="item in databasestables" :value="item.tags" :key="item.tags"
                            :label="item.tags"></Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div class="demo-drawer-footer" v-show="showfooter">
            <Button @click="create = false"
                    style="margin-right: 8px">取消
            </Button>
            <Button @click="handleSubmit('formData')"
                    type="primary">提交
            </Button>
          </div>
        </Drawer>

      </Row>
    </Card>
  </Row>
</template>

<script>
import {
  createMonitoringRun,
  deleteMonitoringRun,
  getMonitoringRun,
  updateMonitoringRun,
  getDatabasesTables,
  getMonitoringConfig
} from '@/api/monitoring'
import { getMysqlList } from '@/api/assets'
import { formatDate, hasOneOf } from '@/libs/tools'

export default {
  data () {
    return {
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          sortable: true
        },
        {
          title: '检测项目名称',
          key: 'name',
          width: 300
        },
        {
          title: '数据库服务',
          key: 'monitoring_run_id',
          width: 300
        },
        {
          title: '数据库名称',
          key: 'database_name',
          width: 300
        },

        {
          title: '添加时间',
          key: 'check_time',
          width: 140,
          render: (h, params) => {
            return h('div',
              formatDate(new Date(params.row.check_time), 'yyyy-MM-dd hh:mm')
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {

                  click: () => {
                    this.show = true
                    this.view(params.index)
                  }
                }
              }, '详情'),
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  display: (this.updateAccessAll !== true) ? 'none' : 'inline-block'
                },
                on: {
                  click: () => {
                    this.update(params.index)
                  }
                }
              }, '编辑'),
              h('Poptip', {
                props: {
                  confirm: true,
                  title: '确定要删除吗！',
                  transfer: true
                },
                style: {
                  marginRight: '5px',
                  display: (this.deleteAccessAll !== true) ? 'none' : 'inline-block'
                },
                on: {
                  'on-ok': () => {
                    this.remove(params.index, params.row.id)
                  }
                }
              }, [h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  display: (this.deleteAccessAll !== true) ? 'none' : 'inline-block'
                }
              }, '删除')]
              )
            ])
          }
        }
      ],
      data: [],
      monitoringconfiglist: [],
      databases: [],
      databasestables: [],
      count: 0,
      page_size: 10,
      monitoring_name_search: '',
      create: false,
      showfooter: true,
      close: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      updateId: null,
      formData: {
        type: '',
        name: '',
        judge_sql: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.get_monitoring_run_list()
  },
  computed: {
    access () {
      return this.$store.state.user.access
    },
    addAccessAll () {
      return hasOneOf(['monitoring.add_monitoringrun'], this.access)
    },
    updateAccessAll () {
      return hasOneOf(['monitoring.change_monitoringrun'], this.access)
    },
    deleteAccessAll () {
      return hasOneOf(['monitoring.delete_monitoringrun'], this.access)
    }
  },
  methods: {
    get_monitoring_run_parameter (parameter) {
      console.log(parameter)
      this.get_monitoring_run_list(`page=${parameter}`)
    },
    search () {
      console.log(this.monitoring_name_search)
      this.get_monitoring_run_list(`name=${this.monitoring_name_search}`)
    },
    clear_search () {
      this.monitoring_name_search = ''
      this.get_monitoring_run_list()
    },

    get_monitoring_run_list (parameter) {
      getMonitoringRun(parameter).then(res => {
        this.data = res.data.results
        this.count = res.data.count
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取告警配置信息错误 ${err}`)
      })
    },

    get_monitoring_config_list (parameter) {
      getMonitoringConfig(parameter).then(res => {
        this.monitoringconfiglist = res.data.results
        console.log(this.monitoringconfiglist)
      }).catch(err => {
        this.$Message.error(`获取数据库信息错误 ${err}`)
      })
    },
    get_databases_list (parameter) {
      getMysqlList(parameter).then(res => {
        this.databases = res.data.results
        console.log(this.databases)
      }).catch(err => {
        this.$Message.error(`获取数据库信息错误 ${err}`)
      })
    },
    get_databases_tables_list (parameter) {
      getDatabasesTables(parameter).then(res => {
        this.databasestables = res.data.results
        console.log(this.databasestables)
      }).catch(err => {
        this.$Message.error(`获取数据库表信息错误 ${err}`)
      })
    },
    view (index) {
      this.update(index)
      this.showfooter = false
      this.close = true
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        console.log()
        if (valid) {
          if (!this.updateId) {
            createMonitoringRun(this.formData).then(res => {
              console.log(res)
              this.$Message.success('新增告警配置成功!')
              this.get_monitoring_run_list()
              this.create = false
            }).catch(err => {
              console.log(err.response)
              this.$Message.error({
                content: `新增告警配置错误 ${Object.entries(err.response.data)}`,
                duration: 10,
                closable: true
              })
            })
          } else {
            console.log(this.updateId)
            updateMonitoringRun(this.updateId, this.formData).then(res => {
              console.log(res)
              this.$Message.success('更新告警配置成功!')
              this.get_monitoring_run_list()
              this.create = false
            }).catch(err => {
              console.log(err.response)
              this.$Message.error({
                content: `更新告警配置错误 ${Object.entries(err.response.data)}`,
                duration: 10,
                closable: true
              })
            })
          }
        } else {
          this.$Message.error('错误!')
        }
      })
    },
    add () {
      this.get_monitoring_config_list()
      this.get_databases_list()
      this.get_databases_tables_list()
      this.create = true
      this.showfooter = true
      this.close = false
      this.updateId = null
      this.formData.name = ''
      this.formData.mysql_list_id = ''
      this.formData.monitoring_run_id = ''
      this.formData.database_name = ''
    },
    remove (index, id) {
      console.log(index, id)
      deleteMonitoringRun(id).then(res => {
        console.log(res)
        this.$Message.success('删除配置成功!')
        this.data.splice(index, 1)
      }).catch(err => {
        console.log(err.response)
        this.$Message.error({
          content: `删除配置错误 ${Object.entries(err.response.data)}`,
          duration: 10,
          closable: true
        })
      })
    },
    update (index) {
      this.get_monitoring_config_list()
      this.get_databases_list()
      this.get_databases_tables_list()

      this.create = true
      this.showfooter = true
      this.close = false
      this.formData.name = this.data[index].name
      this.formData.mysql_list_id = this.data[index].mysql_list_id
      this.formData.monitoring_run_id = this.data[index].monitoring_run_id
      this.formData.database_name = this.data[index].database_name
      this.updateId = this.data[index].id
    }
  }
}
</script>
<style>
  .demo-drawer-footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
  }
</style>
