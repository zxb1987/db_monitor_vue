<!-- 用户管理 -->
<template>
  <Row>
    <Card>
      <Row>
        <Button @click="add"
                type="primary"
                v-if="addAccessAll">添加
        </Button>&nbsp;
        <Input placeholder="应用名称"
               style="width: 100px"
               v-model="app_name_search"/>&nbsp;
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
              @on-change="get_app_parameter"
              show-elevator
              show-total/>
      </Row>
      <Row>
        <Drawer :mask-closable="this.close"
                :styles="styles"
                title="应用信息"
                v-model="create"
                width="720">
          <Form :model="formData"
                :rules="ruleValidate"
                ref="formData">
            <Alert show-icon>应用信息</Alert>
            <Row :gutter="32">
              <Col span="6">
                <FormItem label=" 应用ID"
                          label-position="top"
                          prop="app_id">
                  <Input placeholder="自定义唯一标签"
                         v-model="formData.app_id"/>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="应用名称"
                          label-position="top"
                          prop="app_name">
                  <Input placeholder="请填写姓名"
                         v-model="formData.app_name"/>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="项目名称(英文)"
                          label-position="top"
                          prop="app_obj">
                  <Input placeholder="项目名称"
                         v-model="formData.app_obj">
                  </Input>
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

      <Modal @on-cancel="cancel_webssh"
             @on-ok="ok_webssh"
             title="Common Modal dialog box title"
             v-model="webssh"
             width="80">
        <p>Content of dialog</p>
        <p>Content of dialog</p>
        <p>Content of dialog</p>
        <p>Content of dialog</p>
        <p>Content of dialog</p>
        <p>Content of dialog</p>
        <p>Content of dialog</p>
        <p>Content of dialog</p>
        <p>Content of dialog</p>
      </Modal>
    </Card>
  </Row>
</template>

<script>

import { createApp, deleteApp, getAppList, updateApp } from '@/api/app'
import { formatDate, hasOneOf } from '@/libs/tools'

export default {
  data () {
    return {
      webssh: false,
      columns: [
        {
          title: '应用ID',
          key: 'app_id',
          width: 120
        },
        {
          title: '应用名称',
          key: 'app_name',
          width: 150
        },
        {
          title: '项目名称',
          key: 'app_obj',
          width: 140
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
              }, '删除')])
            ])
          }
        }
      ],

      data: [],
      count: 0,
      page_size: 10,
      app_app_search: '',
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
        app_id: '',
        app_name: '',
        app_obj: ''
      },
      ruleValidate: {
        app_id: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        app_name: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        app_obj: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.get_app_list()
  },
  computed: {
    access () {
      return this.$store.state.user.access
    },
    addAccessAll () {
      return hasOneOf(['app.add_applist'], this.access)
    },
    updateAccessAll () {
      return hasOneOf(['monitoring.change_applist'], this.access)
    },
    deleteAccessAll () {
      return hasOneOf(['monitoring.delete_applist'], this.access)
    }
  },
  methods: {
    ok_webssh () {
      this.$Message.info('确认操作')
    },
    cancel_webssh () {
      this.$Message.info('取消操作')
    },
    search () {
      console.log(this.app_name_search)
      this.get_app_list(`app_name=${this.app_name_search}`)
    },
    clear_search () {
      this.app_name_search = ''
      this.get_app_list()
    },
    get_app_list (parameter) {
      getAppList(parameter).then(res => {
        this.data = res.data.results
        this.count = res.data.count
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取应用信息错误 ${err}`)
      })
    },
    get_app_parameter (parameter) {
      console.log(parameter)
      this.get_app_list(`page=${parameter}`)
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
            createApp(this.formData).then(res => {
              console.log(res)
              this.$Message.success('新增应用信息成功!')
              this.get_app_list()
              this.create = false
            }).catch(err => {
              console.log(err.response)
              this.$Message.error({
                content: `新增应用信息错误 ${Object.entries(err.response.data)}`,
                duration: 10,
                closable: true
              })
            })
          } else {
            console.log(this.updateId)
            updateApp(this.updateId, this.formData).then(res => {
              console.log(res)
              this.$Message.success('更新应用信息成功!')
              this.get_app_list()
              this.create = false
            }).catch(err => {
              console.log(err.response)
              this.$Message.error({
                content: `更新应用信息错误 ${Object.entries(err.response.data)}`,
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
      this.create = true
      this.showfooter = true
      this.close = false
      this.updateId = null
      this.formData.app_id = ''
      this.formData.app_name = ''
      this.formData.app_obj = ''
    },
    remove (index, id) {
      console.log(index, id)
      deleteApp(id).then(res => {
        console.log(res)
        this.$Message.success('删除应用信息成功!')
        this.data.splice(index, 1)
      }).catch(err => {
        console.log(err.response)
        this.$Message.error({
          content: `删除应用信息错误 ${Object.entries(err.response.data)}`,
          duration: 10,
          closable: true
        })
      })
    },
    update (index) {
      this.create = true
      this.showfooter = true
      this.close = false
      this.formData.app_id = this.data[index].app_id
      this.formData.app_name = this.data[index].app_name
      this.formData.app_obj = this.data[index].app_obj
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
