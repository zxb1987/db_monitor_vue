<template>

  <div class="layout">
    <div class="left">
      <div style="width: 50%;height: 50%;">
        <!--  multiple  filterable allow-create    获取上到的服务器主机-->
        <div>
          <span style="margin-left: 20px">已选择的：</span>
          <span style="margin-left: 10px" v-for="val in formValfile" :key="val.tags">{{val.tags}}</span>
        </div>
<!--       ref="formValfile" :model="formValfile"-->
        <Form  :label-width="80">
          <FormItem label="数据列表" prop="get_linux_tags">
            <Select
              multiple
              :max-tag-count="1"
              v-model="formValfile" filterable allow-create>
              <Option v-for="item in linuxdata" :value="item" :key="item.tags" :label="item.tags">{{item.tags}}</Option>
            </Select>
          </FormItem>
        </Form>
        <!--        开始进行拖拽上传-->
        <Upload
          multiple
          ref="upload"
          type="drag"
          action=""
          :before-upload="handleUpload"
          :loading="loadingStatus"
          :show-upload-list="true"
          :on-success="uploadSucess"
          :on-error="uploadError"
          :show-file-list="false"
          paste
          class="uploadfile">
          <div style="width: 50%;height:80%; margin: auto ;">
            <Icon type="ios-cloud-upload" style="color: #3399ff;" size="130" ></Icon>
            <p>点击或拖拽文件上传</p>
          </div>
        </Upload>

      </div>
    </div>
    <div class="right">
      <div style="width: 100%;height: 50%;">
        <row class="ssh_date">
          <Col class="showssh">
            <div >
              <Tree :data="data"></Tree>
            </div>
          </Col>

        </row>
        <row class="down">
          <Col class="showdwon">
            <Upload
              multiple
              type="drag"
              :action="upload"
              class="uploadfile"
              :http-request='uploadFileMethod'
              :show-file-list="false">
              <div style="width: auto;margin: auto">
                <Icon type="ios-cloud-upload" size="50" style="color: #3399ff;align-content: center"></Icon>
                <p>点击或拖拽文件上传</p>
              </div>
            </Upload>
          </Col>
        </row>

      </div>
    </div>
    <div class="footer">
      <div style="width: 100%;height: 50%;">
        <card>
          <Row>
            <Input v-model="filename_search"
                   placeholder="文件名称"
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
        </card>
        <Row>
          <br>
          <Page :total="count"
                :page_size='page_size'
                @on-change="get_updown_parameter"
                show-elevator
                show-total/>
        </Row>

      </div>
    </div>

  </div>
</template>

<script>
import { getLinuxList, getUploadDownFileList, upload_file } from '@/api/maintaintools'
import { formatDate } from '@/libs/tools'
import { Tag } from 'iview'

export default {
  // name: 'maintaintools-file',

  data () {
    return {
      linuxdata: [], // 数据集合
      formValfile: [], // 获取选中的服务器数据
      filename_search: '', // 搜索字段
      // uploadHost:'',//上传的地址
      actionUrl: '',
      file: null,
      fileName: '',
      loadingStatus: false,
      resultdate: '',
      uploadFile: [],
      data: [],
      count: 0,
      page_size: 10,
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
          title: '文件名称',
          sortable: true,
          key: 'file_name',
          width: 150
        },
        {
          title: '文件大小',
          sortable: true,
          key: 'file_size',
          width: 150
        },
        {
          title: '文件传输路径',
          sortable: true,
          key: 'file_path',
          width: 200
        },
        {
          title: '文件传输主机',
          key: 'file_host',
          width: 200,
          sortable: true
        },
        {
          title: '文件传输类型',
          key: 'file_type',
          width: 200,
          render: (h, params) => {
            const levelMap = {
              1: { color: 'green', desc: '上传' },
              0: { color: 'red', desc: '下载' }
            }
            const file_type = params.row.file_type
            return h(Tag, { props: { color: levelMap[file_type]['color'] } }, levelMap[file_type]['desc'])
          },
          filters: [
            {
              label: '下载',
              value: 0
            },
            {
              label: '上传',
              value: 1
            }
          ],
          filterMultiple: false,
          filterMethod (value, row) {
            if (value === 0) {
              return row.file_type === 0
            } else if (value === 1) {
              return row.file_type === 1
            }
          }
        },
        {
          title: '传输时间',
          key: 'upload_time',
          width: 200,
          sortable: true,
          render: (h, params) => {
            return h('div',
              formatDate(new Date(params.row.upload_time), 'yyyy-MM-dd hh:mm')
            )
          }
        },
        {
          title: '备注',
          key: 'remarks',
          width: 200
        },
        {
          title: '操作',
          key: 'action',
          width: 250,
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
              }, '详情')
            ])
          }
        }
      ]
    }
  },
  formData: {
    file_name: '',
    file_size: '',
    file_path: '',
    file_host: '',
    file_type: '',
    remarks: ''
  },
  // vue生命周期，打开页面就加载的数据放在这里
  created () {
    this.get_linux_list()
    this.get_upload_list()
  },
  methods: {
    // 获取主机信息
    get_linux_list (parameter) {
      getLinuxList(parameter).then(res => {
        this.linuxdata = res.data.results
      }).catch(err => {
        this.$Message.error(`获取Linux主机资源信息错误 ${err}`)
      })
    },

    uploadSucess (response, file) { // 上传成功钩子
      console.log(file)
      // if (response.msg === '上传成功') {
      //   this.$Message.success('导入成功')
      // } else {
      //   this.$Message.error(response.msg)
      // }
      console.log(response.data.actionUrl)
      this.files = null
    },
    uploadError () { // 失败
      this.$Message.error('导入失败')
    },
    // 上传
    handleUpload (file) {
      let from_data = new FormData()
      this.file = file
      from_data.append('file', this.file)
      from_data.append('data', this.formValfile)
      if (this.formValfile.length === 0) {
        this.$Message.warning(`上传错误,请选择上传的服务器！`)
      } else {
        upload_file(from_data).then(res => {
          console.log(res.status)
          if (res.status === 200) {
            this.$Message.success(`上传成功！`)
            // 接收后台返回数据
            // let aa=res.date.result
            // console.log(aa)
          } else if (res.status === 401) {
            this.$Message.warning(`没有权限！${error_401}`)
          } else {
            this.$Message.error(`上传失败！${error_404}&&${error_500}`)
          }
        }).catch(err => {
          this.$Message.error(`上传错误 ${err}`)
        })
      }
      return false
    },
    upload () {
      this.loadingStatus = true
      console.log(this.$refs.upload.post(this.file))
      this.$refs.upload.post(this.file)
    },

    // 表格的相关操作
    // 全选按钮操作实现
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    },
    // 搜索
    search () {
      console.log(this.commname_search)
      console.log(this.formValfile)
      this.get_upload_list(`file_name=${this.filename_search}`)
    },
    // 清空搜索
    clear_search () {
      this.filename_search = ''
      this.get_upload_list()
    },
    // 获取列表记录数据
    get_upload_list (parameter) {
      getUploadDownFileList(parameter).then(res => {
        this.data = res.data.results
        this.count = res.data.count
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取文件信息错误 ${err}`)
      })
    },
    // 分页按钮
    get_updown_parameter (parameter) {
      console.log(parameter)
      this.get_upload_list(`page=${parameter}`)
    }

  }
}
</script>

<style scoped>
  html, body {
    height: 100%;
    padding: 0;
    margin: 0;
  }

  .layout {
    width: 100%;
    height: 100%;
    position: relative;
    /*background-color: #efffbd;*/
  }

  .left {
    /*background-color: #cf63ff;*/
    height: 30%;
    width: 40%;
    float: left;
  }
  .uploadfile{
    margin-left:20px;
  }

  .right {
    height: 30%;
    width: 60%;
    padding: 16px;
    /*background-color: #86d0f0;*/
    float: right;
  }

  .footer {

    height: 70%;
    width: 100%;
    /*background-color: #9145f0;*/
    float: right;

  }
  .ssh_date{
    height: 200%;
    width: 50%;
    /*background-color: #9145f0;*/
    float: left;
  }
  .showssh{
    height: auto;
    width: 100%;
    float: left;

  }
  .down{
    height: 200%;
    width: 50%;
    /*background-color: #666666;*/
    float: right;
  }
  .showdwon{
    height: auto;
    width: 100%;
    float: right;

  }

</style>
