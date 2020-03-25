<!-- 用户管理 -->
<template>
  <Row>
    <Card>
      <Row>
        <Button @click="add"
                v-if="addAccessAll"
                type="primary">添加</Button>&nbsp;
        <Input v-model="user_name_search"
               placeholder="姓名"
               style="width: 100px" />&nbsp;
        <Button @click="search"
                type="primary">搜索</Button>&nbsp;
        <Button @click="clear_search"
                type="success">刷新</Button>
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
              @on-change="get_user_parameter"
              show-elevator
              show-total />
      </Row>
      <Row>
        <Drawer title="用户信息"
                v-model="create"
                width="720"
                :mask-closable="this.close"
                :styles="styles">
          <Form ref="formData"
                :model="formData"
                :rules="ruleValidate">
            <Alert show-icon>用户信息</Alert>
            <Row :gutter="32">
              <Col span="6">
              <FormItem label=" 用户IDuser"
                        label-position="top"
                        prop="user_id">
                <Input v-model="formData.user_id"
                       placeholder="自定义唯一标签" />
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="姓名"
                        label-position="top"
                        prop="user_name">
                <Input v-model="formData.user_name"
                       placeholder="请填写姓名" />
              </FormItem>
              </Col>
              <Col span="4">
              <FormItem label="部门"
                        label-position="top"
                        prop="department">
                <Input v-model="formData.department"
                       placeholder="部门">
                </Input>
              </FormItem>
              </Col>
            </Row>
            <Row :gutter="32">
              <Col span="8">

                <FormItem label="权限组"
                          label-position="top"
                          prop="permission_group">
                  <Input v-model="formData.permission_group"
                         placeholder="请填写名称"/>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="生日"
                          label-position="top"
                          prop="birthday">
                  <DatePicker placeholder="选择日期" style="width: 200px" type="date" v-model="formData.birthday"
                              value="yyyymmdd"></DatePicker>
                </FormItem>
              </Col>
            </Row>
            <Alert show-icon>联系方式</Alert>
            <Row :gutter="32">
              <Col span="12">
                <FormItem label="办公电话"
                          label-position="top"
                          prop="office_phone">
                  <Input placeholder="办公电话"
                         v-model="formData.office_phone">
                  </Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="E-mail"
                          label-position="top"
                          prop="mail">
                  <Input placeholder="E-mail"
                         v-model="formData.mail">
                  </Input>
                </FormItem>
              </Col>
            </Row>

          </Form>
          <div class="demo-drawer-footer" v-show="showfooter" >
            <Button style="margin-right: 8px"
                    @click="create = false">取消</Button>
            <Button type="primary"
                    @click="handleSubmit('formData')">提交</Button>
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
import { createUser, deleteUser, getUserList, updateUser } from '@/api/archives'
import { formatDate, hasOneOf } from '@/libs/tools'

export default {
  data () {
    return {
      webssh: false,
      columns: [
        {
          title: '用户ID',
          key: 'user_id',
          width: 120
        },
        {
          title: '姓名',
          key: 'user_name',
          width: 150
        },
        {
          title: '部门',
          key: 'department',
          width: 140
        },
        {
          title: '权限组',
          key: 'permission_group',
          width: 120
        },
        {
          title: '生日',
          key: 'birthday',
          width: 120
        },
        {
          title: '手机号',
          key: 'office_phone',
          width: 160
        },
        {
          title: 'E-mail',
          key: 'mail',
          width: 200
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
      user_name_search: '',
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
        user_id: '',
        user_name: '',
        department: '',
        permission_group: '默认',
        birthday: '',
        office_phone: '',
        mail: '',
        fax: ''
      },
      ruleValidate: {
        user_id: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        user_name: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        permission_group: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.get_user_list()
  },
  computed: {
    access () {
      return this.$store.state.user.access
    },
    addAccessAll () {
      return hasOneOf(['user.add_userlist'], this.access)
    },
    updateAccessAll () {
      return hasOneOf(['user.change_userlist'], this.access)
    },
    deleteAccessAll () {
      return hasOneOf(['user.delete_userlist'], this.access)
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
      console.log(this.user_name_search)
      this.get_user_list(`user_name=${this.user_name_search}`)
    },
    clear_search () {
      this.user_name_search = ''
      this.get_user_list()
    },
    get_user_list (parameter) {
      getUserList(parameter).then(res => {
        this.data = res.data.results
        this.count = res.data.count
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取用户信息错误 ${err}`)
      })
    },
    get_user_parameter (parameter) {
      console.log(parameter)
      this.get_user_list(`page=${parameter}`)
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
            createUser(this.formData).then(res => {
              console.log(res)
              this.$Message.success('新增用户信息成功!')
              this.get_user_list()
              this.create = false
            }).catch(err => {
              console.log(err.response)
              this.$Message.error({
                content: `新增用户信息错误 ${Object.entries(err.response.data)}`,
                duration: 10,
                closable: true
              })
            })
          } else {
            console.log(this.updateId)
            updateUser(this.updateId, this.formData).then(res => {
              console.log(res)
              this.$Message.success('更新用户信息成功!')
              this.get_user_list()
              this.create = false
            }).catch(err => {
              console.log(err.response)
              this.$Message.error({
                content: `更新用户信息错误 ${Object.entries(err.response.data)}`,
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
      this.formData.user_id = ''
      this.formData.user_name = ''
      this.formData.department = ''
      this.formData.permission_group = ''
      this.formData.birthday = ''
      this.formData.office_phone = ''
      this.formData.mail = ''
      this.formData.fax = ''
    },
    remove (index, id) {
      console.log(index, id)
      deleteUser(id).then(res => {
        console.log(res)
        this.$Message.success('删除用户信息成功!')
        this.data.splice(index, 1)
      }).catch(err => {
        console.log(err.response)
        this.$Message.error({
          content: `删除用户信息错误 ${Object.entries(err.response.data)}`,
          duration: 10,
          closable: true
        })
      })
    },
    update (index) {
      this.create = true
      this.showfooter = true
      this.close = false
      this.formData.user_id = this.data[index].user_id
      this.formData.user_name = this.data[index].user_name
      this.formData.department = this.data[index].department
      this.formData.permission_group = this.data[index].permission_group
      this.formData.birthday = this.data[index].birthday
      this.formData.office_phone = this.data[index].office_phone
      this.formData.mail = this.data[index].mail
      this.formData.fax = this.data[index].fax
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
