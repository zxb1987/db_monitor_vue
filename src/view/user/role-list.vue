<!-- 用户管理 -->
<template>
  <Row>
    <Card>
      <Row>
        <Button @click="add"
                v-if="addAccessAll"
                type="primary">添加
        </Button>&nbsp;
        <Input v-model="role_name_search"
               placeholder="角色名称"
               style="width: 100px"/>&nbsp;
        <Button @click="search"
                type="primary">搜索
        </Button>&nbsp;
        <Button @click="clear_search"
                type="success">刷新
        </Button>
        <Button type="primary" size="large" @click="exportData(1)" style="margin-left: 8px;" shape="circle"
                icon="ios-download-outline"> 导出原始数据
        </Button>
        <Button type="primary" size="large" @click="exportData(2)" style="margin-left: 8px;" shape="circle"
                icon="ios-download-outline"> 导出排序和过滤后的数据
        </Button>
        <Button type="primary" size="large" @click="exportData(3)" style="margin-left: 8px;" shape="circle"
                icon="ios-download-outline"> 导出自定义数据
        </Button>
      </Row>
      <br>
      <Row>
        <Table border
               ref="table"
               :columns="columns"
               :data="data">

        </Table>
        <!--    selection    复选按钮 和table的ref值绑定-->
        <Button @click="handleSelectAll(true)">全选</Button>
        <Button @click="handleSelectAll(false)">全不选</Button>
      </Row>
      <Row>
        <br>
        <!--        数据分页-->
        <Page
          size="small"
          :total="count"
          :current="startRow"
          :page_size="page_size"
          @on-change="get_role_parameter"
          @on-page-size-change="page_change"
          show-elevator
          show-sizer
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
                    <Option value="1">正常</Option>
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
import { createRole, getRoleList, updateRole, deleteRole } from '@/api/role'
import { formatDate, hasOneOf } from '@/libs/tools'
import { Tag } from 'iview' // 状态必须的标签选择项

export default {
  data () {
    return {
      webssh: false,
      columns: [
        {
          type: 'selection',
          width: 52,
          align: 'center'
        },
        {
          title: '序号',
          type: 'index',
          width: 80,
          align: 'center'
        },
        {
          title: '角色名称',
          key: 'role_name',
          resizable: true,
          'sortable': true,
          width: 120
        },
        {
          title: '角色代码',
          key: 'role_code',
          resizable: true,
          'sortable': true,
          width: 150
        },
        {
          title: '角色描述',
          key: 'role_remark',
          resizable: true,
          'sortable': true,
          width: 150
        },
        {
          title: '角色添加日期',
          key: 'role_add_date',
          resizable: true,
          'sortable': true,
          width: 200,
          render: (h, params) => {
            return h('div',
              formatDate(new Date(params.row.role_add_date), 'yyyy-MM-dd hh:mm:ss')
            )
          }
        },
        {
          title: '角色修改日期',
          key: 'role_update_date',
          resizable: true,
          'sortable': true,
          width: 200,
          render: (h, params) => {
            return h('div',
              formatDate(new Date(params.row.role_update_date), 'yyyy-MM-dd hh:mm:ss')
            )
          }
        },
        {
          title: '角色状态',
          key: 'role_status',
          width: 120,
          render: (h, params) => {
            const levelMap = {
              1: { color: 'green', desc: '正常' },
              0: { color: 'red', desc: '禁用' }
            }
            const role_status = params.row.role_status
            return h(Tag, { props: { color: levelMap[role_status]['color'] } }, levelMap[role_status]['desc'])
          },
          filters: [
            {
              label: '禁用',
              value: 0
            },
            {
              label: '正常',
              value: 1
            }
          ],
          filterMultiple: false,
          filterMethod (value, row) {
            if (value === 0) {
              return row.role_status === 0
            } else if (value === 1) {
              return row.role_status === 1
            }
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
      startRow: 1,
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
        role_status: '',
        role_remark: ''
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
    // 全选按钮操作实现
    handleSelectAll (status) {
      this.$refs.table.selectAll(status)
    },
    ok_webssh () {
      this.$Message.info('确认操作')
    },
    cancel_webssh () {
      this.$Message.info('取消操作')
    },
    search () {
      console.log(this.role_name_search)
      this.get_role_list(`role_name=${this.role_name_search}` && `role_code=${this.role_name_search}` && `role_remark=${this.role_name_search}`)
    },
    clear_search () {
      this.role_name_search = ''
      this.get_role_list()
    },
    // 获取用户信息就进行分页
    get_role_list (parameter) {
      getRoleList(parameter).then(res => {
        this.data = res.data.results
        this.count = res.data.count
      }).catch(err => {
        this.$Message.error(`获取角色信息错误 ${err}`)
      })
    },

    page_change (parameter) {
      this.page_size = parameter
      console.log(parameter)
      if (this.page_size >= this.count) {
        this.get_role_list(`page=${parameter}`)
      }
    },

    // 分页选择多少页
    get_role_parameter (parameter) {
      console.log(parameter)
      this.showfooter = parameter
      this.get_role_list(`page=${parameter}`)
    },

    view (index) {
      this.update(index)
      this.showfooter = false
      this.close = true
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
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
      this.formData.role_status = ''
      this.formData.role_remark = ''
    },
    remove (index, id) {
      console.log(index, id)
      deleteRole(id).then(res => {
        console.log(res)
        this.$Message.success('删除角色信息成功!')
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
      this.updateId = this.data[index].id
    },

    exportData (type) {
      if (type === 1) {
        this.$refs.table.exportCsv({
          filename: '原始数据'
        })
      } else if (type === 2) {
        this.$refs.table.exportCsv({
          filename: '排序筛选后的数据',
          original: false
        })
      } else if (type === 3) {
        this.$refs.table.exportCsv({
          filename: '自定义数据', // 两种方式取值
          // columns: this.columns.filter((col, index) => index < 4),
          // data: this.data.filter((data, index) => index < 4)
          // 第二种方式取值导出
          columns: this.columns.filter((col, index) => { // 导出数据过滤
            if (index > 0 && index < this.columns.length - 1) {
              return true
            }
          }),
          data: this.data.map((v, index) =>
            ({ ...v,
              lineIndex: index + 1,
              role_status: v.role_status.name
            })
          )

        })
      }
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
