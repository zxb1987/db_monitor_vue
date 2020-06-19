<template>

  <div class="layout">
    <div class="body_top">
      <div class="top_left">
        <Card style="height: 100%">
          <row>
            <div style="width: 50%;height: auto;">
              <!--  multiple  filterable allow-create    获取上到的服务器主机-->
              <div>
                <span style="margin-left: 20px">已选择的：</span>
                <span style="margin-left: 10px" v-for="val in formValfile" :key="val.tags">{{val.tags}}</span>
              </div>
              <!--       ref="formValfile" :model="formValfile"-->
              <Form :label-width="80">
                <FormItem label="数据列表" prop="get_linux_tags">
                  <Select
                    multiple
                    :max-tag-count="1"
                    v-model="formValfile" filterable allow-create>
                    <Option v-for="item in linuxdata" :value="item.id" :key="item.tags" :label="item.tags">{{item.tags}}</Option>
                  </Select>
                </FormItem>
              </Form>
              <!--        开始进行拖拽上传-->
              <Upload
                multiple
                :ref="upload"
                type="drag"
                :action="uploadurl"
                :before-upload="handleUpload"
                :loading="loadingStatus"
                :show-upload-list="true"
                :on-success="uploadSucess"
                :on-error="uploadError"
                :show-file-list="false"
                :data="uploadData"
                paste
                class="uploadfile">
                <div style="width: 60%;height:auto; margin: auto ;">
                  <Icon type="ios-cloud-upload" style="color: #3399ff;" size="130"></Icon>
                  <p>点击或拖拽文件上传</p>
                </div>
              </Upload>

            </div>
          </row>
        </Card>
      </div>
      <div class="top_right">
        <Card style="height: 15%">
          <row style="width: 20%">
            <Form :label-width="80">
              <!--          //ref="formsshtags" :model="formsshtags"-->
              <FormItem label="主机列表" prop="get_linux_tags">
                <Select

                  :max-tag-count="1"
                  v-model="getformsshtags" filterable allow-create @on-change="sshval">
                  <Option v-for="item in linuxdata" :value="item.id" :key="item.tags" :label="item.tags">{{item.tags}}
                  </Option>
                </Select>
              </FormItem>
            </Form>
          </row>

        </Card>
        <div class="folder_window">
          <div class="getssh_left" >
            <div class="left_content" >
              <Cell style="background: #8B8091" >
                <div class="rootpage" @click="toroot(1)">.</div>
              </Cell>
              <Cell style="background: #8B8091" >
                <div class="rootpage" @click="toroot(2)">..</div>
              </Cell>
              <CellGroup v-for="getall in ssh_Folderall" :value="getall" :key="getall" style="">
                <Cell >
                  <Checkbox @on-change="getpath(getall)" style=""><span>{{getall}}</span></Checkbox>
<!--                  <span @on-change="getpath(getall)">{{getall}}</span>-->
                </Cell>
              </CellGroup>
            </div>
          </div>
          <div class="getssh_regth">
            <div class="right_content">

              {{pathval}}

            </div>
          </div>

        </div>
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
import { getLinuxList, getUploadDownFileList, upload_file, ssh_Folder } from '@/api/maintaintools'
import { formatDate } from '@/libs/tools'
import { Tag } from 'iview'

export default {
  // name: 'maintaintools-file',

  data () {
    return {
      getformsshtags: {}, // 获取选中的服务器数据
      ssh_Folderall: [],
      linuxdata: [], // 数据集合
      formValfile: {}, // 获取选中的服务器数据
      filename_search: '', // 搜索字段
      // uploadHost:'',//上传的地址
      uploadurl: '',
      formfile: '',
      actionUrl: '',
      pathval: '',
      file: [],
      fileName: '',
      loadingStatus: false,
      resultdate: '',
      uploadFile: [],
      uploadData: {},
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
    // 获取选中数据
    linuxhostval (hostval) {
      let host = []
      let allhost = {}
      if (hostval.length > 0) {
        for (let i in hostval) {
          allhost = {}
          allhost.tags = hostval[i].tags
          allhost.host = hostval[i].host
          allhost.user = hostval[i].user
          allhost.password = hostval[i].password
          allhost.sshport = hostval[i].sshport
          host.push(allhost)
        }
      }
      return host
    },
    // 上传
    handleUpload (files) {
      this.file = files
      // console.log(this.formValfile)
      let from_data = new FormData()
      from_data.append('data', this.formValfile)
      from_data.append('file', this.file)
      console.log(this.file)
      upload_file(from_data).then(res => {
        console.log(res)
      })

      // if (this.formValfile.length === 0) {
      //   this.$Message.warning(`上传错误,请选择上传的服务器！`)
      // } else {
      //   upload_file(from_data).then(res => {
      //     console.log(res.status)
      //     if (res.status === 200) {
      //       this.$Message.success(`上传成功！`)
      //       // 接收后台返回数据
      //       // let aa=res.date.result
      //       // console.log(aa)
      //     } else if (res.status === 401) {
      //       this.$Message.warning(`没有权限！${error_401}`)
      //     } else {
      //       this.$Message.error(`上传失败！${error_404}&&${error_500}`)
      //     }
      //   }).catch(err => {
      //     this.$Message.error(`上传错误 ${err}`)
      //   })
      // }

      return false
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
    // upload () {
    //
    //   this.loadingStatus = true
    //   console.log(this.$refs.upload.post(this.file))
    //   this.$refs.upload.post(this.file)
    // },

    // regth
    // 获取服务器目录树
    sshval (val) {
      console.log(val)
      let folder = []
      ssh_Folder(val).then(resdate => {
        // console.log(resdate.data)
        // this.ssh_Folderall=resdate.data .split('\r\n')
        folder.push(resdate.data.split('\r\n'))
        console.log(folder[0])
        this.ssh_Folderall = folder[0]
      })
    },
    // 判断后带缀的的文件
    GetExtName (fileName) {
      let extArr = fileName.split('.')
      let exts = ['folder', 'folder-unempty', 'sql', 'c', 'cpp', 'cs', 'flv', 'css', 'js', 'htm', 'html', 'java', 'log', 'mht', 'php', 'url', 'xml', 'ai', 'bmp', 'cdr', 'gif', 'ico', 'jpeg', 'jpg', 'JPG', 'png', 'psd', 'webp', 'ape', 'avi', 'flv', 'mkv', 'mov', 'mp3', 'mp4', 'mpeg', 'mpg', 'rm', 'rmvb', 'swf', 'wav', 'webm', 'wma', 'wmv', 'rtf', 'docx', 'fdf', 'potm', 'pptx', 'txt', 'xlsb', 'xlsx', '7z', 'cab', 'iso', 'bz2', 'rar', 'zip', 'gz', 'bt', 'file', 'apk', 'bookfolder', 'folder', 'folder-empty', 'folder-unempty', 'fromchromefolder', 'documentfolder', 'fromphonefolder', 'mix', 'musicfolder', 'picturefolder', 'videofolder', 'sefolder', 'access', 'mdb', 'accdb', 'sql', 'c', 'cpp', 'cs', 'js', 'fla', 'flv', 'htm', 'html', 'java', 'log', 'mht', 'php', 'url', 'xml', 'ai', 'bmp', 'cdr', 'gif', 'ico', 'jpeg', 'jpg', 'JPG', 'png', 'psd', 'webp', 'ape', 'avi', 'flv', 'mkv', 'mov', 'mp3', 'mp4', 'mpeg', 'mpg', 'rm', 'rmvb', 'swf', 'wav', 'webm', 'wma', 'wmv', 'doc', 'docm', 'dotx', 'dotm', 'dot', 'rtf', 'docx', 'pdf', 'fdf', 'ppt', 'pptm', 'pot', 'potm', 'pptx', 'txt', 'xls', 'csv', 'xlsm', 'xlsb', 'xlsx', '7z', 'gz', 'cab', 'iso', 'rar', 'zip', 'bt', 'file', 'apk', 'css']
      let extLastName = extArr[extArr.length - 1]
      console.log(extArr)
      for (let i = 0; i < exts.length; i++) {
        if (exts[i] === extLastName) {
          return exts[i]
        }
      }
      return 'file'
    },

    Extfile (fileName) {
      let extfile = fileName.split('.')
      console.log(extfile)
      if (extfile.length > 1) {
        console.log('这是文件')
      } else {
        console.log('这是文件夹')
      }
    },

    // 处理换行符
    transformLineBreak (str) {
      if (!str) {
        return []
      }
      let arr = str.split(/\r/g)
      if (!arr[arr.length]) { // 如果最后一行后面有换行符，删除数组最后一项空字符串
        arr.pop()
      }
      return arr
    },

    getpath (val) {
      console.log(val)
      this.pathval = this.Extfile(val)
    },

    toroot (val) {
      alert(val)
      console.log('获取root根目录')
      console.log(val)
    },

    // footer
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
      this.get_upload_list()
      this.count = 0// 刷新页面时重新初始化页数
      this.filename_search = ''
    },
    // 获取列表记录数据
    get_upload_list (parameter) {
      console.log(parameter)
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
/*<!--  整个页面-->*/
  html, body {
    height: 100%;
    padding: 0;
    margin: 0;
  }
/*外面最大盒子*/
  .layout {
    width: 100%;
    height: 100%;
    position: center;
    /*background-color: #efffbd;*/
  }
  /*盒子上部分*/
  .body_top{
    width: 100%;
    height: 40%;
    float: left;
    align-self:center;
  }
  /*盒子下部分，表格*/
  .footer {
    width: 100%;
    height: 60%;
    float: left;
  }
  /*盒子的左边上传*/
  .top_left {
    /*background-color: #cf63ff;*/
    height: 100%;
    width: 40%;
    float: left;
  }

  .uploadfile {
    margin-left: 20px;
  }
  /*盒子的右边文件*/
  .top_right {

    height: 100%;
    width: 60%;
    /*background-color: #86d0f0;*/
    float: left;
  }
  /*外壳*/
  .folder_window{
    width: 100%;
    height: 85%;
    /*background-color: #5c6b77;*/
  }
  .getssh_left{
    height: 100%;
    width: 50%;
    float: left;
    /*background-color: #22d489;*/
  }
  .left_content{
    width: 100%;
    height: 100%;
    /*content: initial;*/
    overflow-y: scroll; /*内容可拉伸*/
    white-space: pre-wrap; /*内容可拉伸 */
    border-style: double; /*border-style 边框属性*/
    border-width: 2px;
    /*background: pink;*/
  }
  /**/
  .right_content{
    width: 100%;
    height: 100%;
    /*content: initial;*/
    overflow-y: scroll; /*内容可拉伸*/
    white-space: pre-wrap; /*内容可拉伸 */
    border-style: double; /*border-style 边框属性*/
    border-width: 2px;
    /*background-color: cornsilk;*/
  }
  .getssh_regth{
    height: 100%;
    width: 50%;
    float: left;
    /*content: initial;*/
    /*overflow-y: scroll; !*内容可拉伸*!*/
    /*white-space: pre-wrap; !*内容可拉伸 *!*/
    /*border-style: double; !*border-style 边框属性*!*/
    /*border-width: 2px;*/
    /*background-color: #00FF00;*/
  }

  /*右边盒子里面的左边盒子*/
  .ssh_left {
    width: 100%;
    height: 100%;
    float: left;
    font-size: large;
    /*content: initial;*/
    overflow-y: scroll; /*内容可拉伸*/
    white-space: pre-wrap; /*内容可拉伸 */
    border-style: double; /*border-style 边框属性*/
    border-width: 2px;
    /*background: #348EED;*/
  }
  /*右边盒子里面的右边盒子*/
  .ssh_right {
    width: 100%;
    height: 100%;
    /*float: right;*/
    /*content: initial;*/
    overflow-y: scroll;
    white-space: pre-wrap;
    border-style: double; /*border-style 边框属性*/
    border-width: 2px;
    border-color: #348EED;
    /*padding-right: 10%;*/
    /*background: #97d4b7;*/
  }

  .rootpage{
    font-size: 50px;
    text-align:center;
    display: table-cell;
    color:#001529;
  }

  .ssh_date {
    height: 200%;
    width: 50%;
    /*background-color: #9145f0;*/
    float: left;
  }

  .showssh {
    height: auto;
    width: 100%;
    float: left;

  }

  .down {
    height: 200%;
    width: 50%;
    /*background-color: #666666;*/
    float: right;
  }

  .showdwon {
    height: auto;
    width: 100%;
    float: right;

  }

  .ssh_left{
    width: 50%;
    float: left;
    height: 100%;
    font-size: large;
    content: initial;
    overflow-y: scroll;
    white-space: pre-wrap;
    border-style: solid;
    border-width: 2px;
    /*background: #348EED;*/
  }
  .ssh_right{
    width: 50%;
    height: 100%;
    float: left;
    content: initial;
    overflow-y: scroll;
    white-space: pre-wrap;
    background: #97d4b7;
  }

</style>
