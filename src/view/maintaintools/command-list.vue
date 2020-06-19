<template>
  <div class="layout">
    <Layout>
      <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
        <Card>
          <Row>
            <Button @click="add"
                    v-if="addAccessAll"
                    type="primary">添加
            </Button>&nbsp;
            <Input v-model="commname_search"
                   placeholder="命令名称"
                   style="width: 100px"/>&nbsp;
            <Button @click="search"
                    type="primary">搜索
            </Button>&nbsp;
            <Button @click="clear_search"
                    type="success">刷新
            </Button>
          </Row>
          <br>
          <Table border
                 ref="selection"
                 :columns="columns"
                 :data="data"
                 size="small">
          </Table>
          <Button @click="handleSelectAll(true)">全选</Button>
          <Button @click="handleSelectAll(false)">全不选</Button>
          <br>
          <!--          分页-->
          <Page
            size="small"
            :page_size='page_size'
            :total="count"
            @on-change="get_maintain_parameter"
            show-elevator
            show-total/>
          <!--      命令列表添加    -->
          <Row>
            <Drawer title="命令列表添加"
                    v-model="create"
                    width="720"
                    :mask-closable="this.close"
                    :styles="styles">
              <Form ref="formData"
                    :model="formData"
                    :rules="ruleValidate">
                <Alert show-icon>命令列表添加</Alert>
                <Row :gutter="32">
                  <Col span="6">
                    <FormItem label="命令名称"
                              label-position="top"
                              prop="commname">
                      <Input v-model="formData.commname"
                             placeholder="自定义唯一命令名称"/>
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem label="执行命令"
                              label-position="top"
                              prop="usecommand">
                      <Input v-model="formData.usecommand"
                             placeholder="请填写执行的命令"/>
                    </FormItem>
                  </Col>
                  <Col span="4">
                    <FormItem label="命令参数"
                              label-position="top"
                              prop="commandparam">
                      <Input v-model="formData.commandparam"
                             placeholder="添加需要执行的参数">
                      </Input>
                    </FormItem>
                  </Col>
                </Row>
                <Row :gutter="32">
                  <Col span="8">
                    <Col span="16">
                      <FormItem label="备注"
                                label-position="top"
                                prop="remark">
                        <Input v-model="formData.remark"
                               placeholder="命令详情备注和作用！">
                        </Input>
                      </FormItem>
                    </Col>
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
          <!--模态框-->
          <Modal width="1000"
                 v-model="ssh"
                 title="ssh命令执行窗口"
                 @on-ok="ok_ssh"
                 @on-cancel="cancel_ssh" class="model-ssh">
            <div>
              <div>
                <span style="margin-left: 20px">已选择的：</span>
                <span style="margin-left: 10px" v-for="val in formValisshdate.linux_tags_val" :key="val.tags">{{val.tags}}</span>
              </div>
              <Form ref="formValisshdate" :model="formValisshdate" :rules="ruleValidate" :label-width="80">
                <FormItem label="数据列表" prop="linux_tags_val">
                  <Select
                    multiple
                    :max-tag-count="1"
                    v-model="formValisshdate.linux_tags_val">
                    <Option v-for="item in linuxdata" :value="item" :key="item.tags" :label="item.tags"></Option>
                  </Select>
                </FormItem>

                <FormItem>
                  <Button type="primary" @click="handleSubmitssh('formValisshdate')">提交</Button>
                  <Button @click="handleReset('formValisshdate')" style="margin-left: 8px">重置</Button>
                </FormItem>
              </Form>

            </div>
            <div
              style="background-color: #000c17;font-size: small;color: #00FF00;height: 400px;margin: auto 30px ;content: initial;overflow-y: scroll;white-space: pre-wrap"
              id="ssh_result">
              {{ssh_results}}
<!--          接收后台返回数据-->
            </div>
          </Modal>

        </Card>
      </Content>
    </Layout>
  </div>
</template>

<script>
import {
  getLinuxList,
  getCommandList,
  createCommandList,
  updateCommandList,
  exec_command,
  deleteCommandList
} from '@/api/maintaintools'
import { hasOneOf, formatDate } from '@/libs/tools'

export default {
  data () {
    return {
      splitssh: 0.5,
      ssh: false,
      show: false,
      linux_tags_val: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '命令名称',
          sortable: true,
          key: 'commname',
          width: 150
        },
        {
          title: '执行命令',
          sortable: true,
          key: 'usecommand',
          width: 150
        },
        {
          title: '命令参数',
          sortable: true,
          key: 'commandparam',
          width: 200
        },
        {
          title: '创建时间',
          key: 'createtime',
          width: 200,
          sortable: true,
          render: (h, params) => {
            return h('div',
              formatDate(new Date(params.row.createtime), 'yyyy-MM-dd hh:mm')
            )
          }
        },
        {
          title: '更新时间',
          key: 'updatedtime',
          width: 200,
          sortable: true,
          render: (h, params) => {
            return h('div',
              formatDate(new Date(params.row.updatedtime), 'yyyy-MM-dd hh:mm')
            )
          }
        },
        {
          title: '备注',
          key: 'remark',
          width: 200
        },
        {
          title: '操作',
          key: 'action',
          width: 280,
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
                    this.get_linux_list()
                    // this.ssh = true
                    this.sshshowmodel(params.index)
                  }
                }
              }, '执行命令'),
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
      ssh_results: [],
      linux_tags: [],
      linuxdata: [], // 数据集合
      count: 0,
      page_size: 10,
      create: false,
      showfooter: true,
      commname_search: '',
      close: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      updateId: null,
      formData: {
        commname: '',
        usecommand: '',
        commandparam: '',
        remark: ''
      },
      formValisshdate: {
        linux_tags_val: [],
        getsshid: 0,
        host: '',
        sshport: '',
        user: '',
        password: ''
      },
      ruleValidate: {
        commname: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        usecommand: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        commandparam: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        linux_tags_val: [
          { required: true, type: 'array', min: 1, message: '请至少选择一个文件.', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.get_commd_info()
  },
  computed: {
    access () {
      return this.$store.state.user.access
    },
    addAccessAll () {
      return hasOneOf(['maintaintools.add_maintaincommand'], this.access)
    },
    updateAccessAll () {
      return hasOneOf(['maintaintools.change_maintaincommand'], this.access)
    },
    deleteAccessAll () {
      return hasOneOf(['maintaintools.delete_maintaincommand'], this.access)
    }
  },

  methods: {

    // 全选按钮操作实现
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    },
    ok_ssh () {
      this.$Message.info('确认操作')
    },
    cancel_ssh () {
      this.$Message.info('取消操作')
    },
    search () {
      console.log(this.commname_search)
      this.get_commd_info(`commname=${this.commname_search}` && `usecommand=${this.commname_search}`)
    },
    clear_search () {
      this.count = 0
      this.commname_search = ''
      this.get_commd_info()
    },
    // 获取主机信息
    get_linux_list (parameter) {
      getLinuxList(parameter).then(res => {
        this.linuxdata = res.data.results
        // console.log('这是Linuxdate:', this.getsshid)
        // console.log(this.linuxdata)
      }).catch(err => {
        this.$Message.error(`获取Linux主机资源信息错误 ${err}`)
      })
    },
    // 获取用户信息就进行分页
    get_commd_info (parameter) {
      getCommandList(parameter).then(res => {
        this.data = res.data.results
        this.count = res.data.count
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取命令列表信息错误 ${err}`)
      })
    },
    // 分页选择多少页
    get_maintain_parameter (parameter) {
      console.log(parameter)
      this.showfooter = parameter
      if (this.page_size >= this.count) {
        this.get_commd_info(`page=${parameter}`)
      }
    },
    page_change (parameter) {
      this.page_size = parameter
      this.get_commd_info(`page=${parameter}`)
    },
    function (name) {
      document.getElementsByTagName('.ivu-modal').draggable() // 使用jqueryui中的拖拽实现模态框的拖动
    },
    view (index) {
      this.update(index)
      this.showfooter = false
      this.close = true
    },
    // 新增提交
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (!this.updateId) {
            createCommandList(this.formData).then(res => {
              console.log(res)
              this.$Message.success('新增命令成功!')
              this.get_commd_info()
              this.create = false
            }).catch(err => {
              console.log(err.response)
              this.$Message.error({
                content: `新增命令错误 ${Object.entries(err.response.data)}`,
                duration: 10,
                closable: true
              })
            })
          } else {
            console.log(this.updateId)
            updateCommandList(this.updateId, this.formData).then(res => {
              console.log(res)
              this.$Message.success('更新命令成功!')
              this.get_commd_info()
              this.create = false
            }).catch(err => {
              console.log(err.response)
              this.$Message.error({
                content: `更新命令错误 ${Object.entries(err.response.data)}`,
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
      this.formData.commname = ''
      this.formData.usecommand = ''
      this.formData.commandparam = ''
      this.formData.remark = ''
    },
    // 删除
    remove (index, id) {
      console.log(index, id)
      deleteCommandList(id).then(res => {
        console.log(res)
        this.$Message.success('删除命令信息成功!')
        this.data.splice(index, 1)
      }).catch(err => {
        console.log(err.response)
        this.$Message.error({
          content: `删除命令错误 ${Object.entries(err.response.data)}`,
          duration: 10,
          closable: true
        })
      })
    },
    // 更新
    update (index) {
      this.create = true
      this.showfooter = true
      this.close = false
      this.formData.commname = this.data[index].commname
      this.formData.usecommand = this.data[index].usecommand
      this.formData.commandparam = this.data[index].commandparam
      this.formData.remark = this.data[index].remark
      this.updateId = this.data[index].id
    },

    // 重置
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    // 获取选中数据
    linuxsshdateChange (val) {
      let sshparm = []
      let obj = {}
      if (val.length > 0) {
        for (let i in val) {
          obj = {}
          obj.tags = val[i].tags
          obj.host = val[i].host
          obj.user = val[i].user
          obj.password = val[i].password
          obj.sshport = val[i].sshport
          sshparm.push(obj)
        }
      }
      console.log('这是获取前端取到的linux链接数据')
      console.log(sshparm)
      return sshparm
    },
    // 获取选中的命令数据
    sshshowmodel (index) {
      this.ssh = true // 模态框弹出
      this.ssh_results = ''// 点击模态框弹出前清空当前显示值
      this.getsshid = this.data[index].id
      console.log(this.getsshid)
      this.handleSubmitssh(name)
    },
    handleSubmitssh (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          console.log('开始传数据到后台！')
          console.log(this.getsshid, this.linuxsshdateChange(this.formValisshdate.linux_tags_val))
          exec_command(this.getsshid, this.linuxsshdateChange(this.formValisshdate.linux_tags_val)).then(res => {
            console.log('后台返回数据')
            console.log(res)
            this.ssh_results = res.data
            this.$Message.success('执行命令成功!')
            this.create = false
          }).catch(err => {
            console.log('错误信息')
            console.log(err)
            console.log(err.response)
            this.$Message.error({
              content: `执行命令错误 ${Object.entries(err.response.data)}`,
              duration: 10,
              closable: true
            })
          })
          // this.$Message.success('成功!')
        } else {
          this.$Message.error('没有选择的数据!')
        }
      })
    }

  }
}

</script>

<style scoped>

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

  .ivu-table .demo-table-info-cell-danger {
    background-color: #d40f35;
    color: #fff;
  }

  .ivu-table .demo-table-info-cell-mormal {
    background-color: #22d489;
    color: #fff;
  }

  /*分割显示*/
  .ssh-split {
    height: auto;

  }

  /*#Modal {*/
  /*  height: 100%;*/
  /*}*/
  .model-ssh {
    height: 400px;
    border: 1px solid #dcdee2;
  }

  /*  右边弹窗*/

</style>
