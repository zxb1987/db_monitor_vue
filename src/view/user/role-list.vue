<template>
  <Row>
    <Card>
      <Row>
        <Button @click="add"
                v-if="addAccessAll"
                type="primary">添加
        </Button>&nbsp;
        <Input v-model="role_name"
               placeholder="角色名称"
               style="width: 100px"/>&nbsp;
        <Button @click="search"
                type="primary">搜索
        </Button>&nbsp;
        <Button @click="clear_search"
                type="success">刷新
        </Button>
      </Row>
      <br>
      <Row>
        <Table border
               :columns="columns"
               :data="data">

        </Table>
      </Row>
      <Row>
        <br>
        <Page :total="count"
              :page_size='page_size'
              @on-change="get_role_parameter"
              show-elevator
              show-total/>
      </Row>
      <Row>
        <Drawer title="角色信息"
                v-model="create"
                width="720"
                :mask-closable="this.close"
                :styles="styles">
          <Form ref="formData"
                :model="formData"
                :rules="ruleValidate">
            <Alert show-icon>角色信息</Alert>
            <Row :gutter="32">
              <Col span="6">
                <FormItem label="角色名称"
                          label-position="top"
                          prop="role_name">
                  <Input v-model="formData.role_name"
                         placeholder="自定义唯一角色名称"/>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="角色代码"
                          label-position="top"
                          prop="role_code">
                  <Input v-model="formData.role_code"
                         placeholder="请填写角色代码"/>
                </FormItem>
              </Col>
              <Col span="4">
                <FormItem label="角色备注"
                          label-position="top"
                          prop="role_remark">
                  <Input v-model="formData.role_remark"
                         placeholder="角色备注">
                  </Input>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="32">
              <Col span="8">
                <FormItem label="角色状态"
                          label-position="top"
                          prop="role_status">
                  <Select v-model="formData.role_status"
                          placeholder="">
                    <Option value="0">禁用</Option>
                    <Option value="1">启用</Option>
                  </Select>
                </FormItem>
              </Col>

            </Row>

          </Form>
          <div class="demo-drawer-footer" v-show="showfooter">
            <Button style="margin-right: 8px"
                    @click="create = false">取消
            </Button>
            <Button type="primary"
                    @click="handleSubmit('formData')">提交
            </Button>
          </div>
        </Drawer>

      </Row>

      <Modal width="80"
             v-model="webssh"
             title="Common Modal dialog box title"
             @on-ok="ok_webssh"
             @on-cancel="cancel_webssh">
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
import { createRole, deleteRole, getRoleList, updateRole } from '@/api/role'
import { hasOneOf } from '@/libs/tools'
import { Tag } from 'iview'

export default {
  data () {
    return {
      webssh: false,
      columns: [
        {
          title: '角色名称',
          key: 'role_name',
          width: 120
        },
        {
          title: '角色代码',
          key: 'role_code',
          width: 150
        },

        {
          title: '角色备注',
          key: 'role_remark',
          width: 100
        },
        {
          title: '角色添加日期',
          key: 'role_add_date',
          width: 110
        },
        {
          title: '角色修改日期',
          key: 'role_update_date',
          width: 110
        },
        {
          title: '角色状态',
          key: 'role_status',
          width: 90,
          render: (h, params) => {
            const levelMap = {
              0: { color: 'green', desc: '禁用' },
              1: { color: 'gray', desc: '启用' }

            }
            const system_level = params.row.system_level
            return h(Tag, { props: { color: levelMap[system_level]['color'] } }, levelMap[system_level]['desc'])
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
      role_name_search: '',
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
        role_name: '',
        role_code: '',
        role_status: 1,
        role_remark: ''
        // role_add_date: '',
        // role_update_date: '',
      },
      ruleValidate: {
        role_name: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        role_code: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        role_status: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        role_remark: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ]

      }
    }
  },
  created () {
    this.get_role_list()
  },
  computed: {
    access () {
      return this.$store.state.user.access
    },
    addAccessAll () {
      return hasOneOf(['role.add_rolelist'], this.access)
    },
    updateAccessAll () {
      return hasOneOf(['role.change_rolelist'], this.access)
    },
    deleteAccessAll () {
      return hasOneOf(['role.delete_rolelist'], this.access)
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
      console.log(this.role_name_search)
      this.get_role_list(`role_name=${this.role_name_search}`)
    },
    clear_search () {
      this.role_name_search = ''
      this.get_role_list()
    },
    get_role_list (parameter) {
      getRoleList(parameter).then(res => {
        this.data = res.data.results
        this.count = res.data.count
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取角色信息错误 ${err}`)
      })
    },
    get_role_parameter (parameter) {
      console.log(parameter)
      this.get_role_list(`page=${parameter}`)
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
            createRole(this.formData).then(res => {
              console.log(res)
              this.$Message.success('新增角色成功!')
              this.get_role_list()
              this.create = false
            }).catch(err => {
              console.log(err.response)
              this.$Message.error({
                content: `新增角色错误 ${Object.entries(err.response.data)}`,
                duration: 10,
                closable: true
              })
            })
          } else {
            console.log(this.updateId)
            updateRole(this.updateId, this.formData).then(res => {
              console.log(res)
              this.$Message.success('更新角色成功!')
              this.get_role_list()
              this.create = false
            }).catch(err => {
              console.log(err.response)
              this.$Message.error({
                content: `更新角色错误 ${Object.entries(err.response.data)}`,
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
      this.formData.role_name = ''
      this.formData.role_code = ''
      this.formData.role_status = 1
      this.formData.role_remark = ''
      // this.formData.role_add_date = ''
      // this.formData.role_update_date = ''
    },
    remove (index, id) {
      console.log(index, id)
      deleteRole(id).then(res => {
        console.log(res)
        this.$Message.success('删除角色成功!')
        this.data.splice(index, 1)
      }).catch(err => {
        console.log(err.response)
        this.$Message.error({
          content: `删除角色错误 ${Object.entries(err.response.data)}`,
          duration: 10,
          closable: true
        })
      })
    },
    update (index) {
      this.create = true
      this.showfooter = true
      this.close = false
      this.formData.role_name = this.data[index].role_name
      this.formData.role_code = this.data[index].role_code
      this.formData.role_status = this.data[index].role_status
      this.formData.role_remark = this.data[index].role_remark
      // this.formData.role_add_date = this.data[index].role_add_date
      // this.formData.role_update_date = this.data[index].role_update_date
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
