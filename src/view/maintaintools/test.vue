<template>

  <div class="layout">
    <div style="height: 40%">
      <div class="left">
        <div style="width: 50%;height: 50%;">
          <!--  multiple  filterable allow-create    获取上到的服务器主机-->
          <div>
            <span style="margin-left: 20px">已选择的：</span>
            <span style="margin-left: 10px" v-for="val in formsshtags" :key="val.tags">{{val.tags}}</span>
          </div>
          <Form :label-width="80">
            <!--          //ref="formsshtags" :model="formsshtags"-->
            <FormItem label="主机列表" prop="get_linux_tags">
              <Select
                multiple
                :max-tag-count="1"
                v-model="formsshtags" filterable allow-create>
                <Option v-for="item in linuxdata" :value="item.id" :key="item.tags" :label="item.tags">{{item.tags}}
                </Option>
              </Select>
            </FormItem>
          </Form>
          <Upload
            multiple
            ref="upload"
            type="drag"
            :before-upload="beforeUpload"
            action=""
            :show-upload-list="true"
            :on-success="uploadSucess1"
            :on-error="uploadError1"
            :show-file-list="false"
            :loading="loadingStatus"
            class="uploadfile">
            <div style="width: 50%;height:80%; margin: auto ;">
              <Icon type="ios-cloud-upload" style="color: #3399ff;" size="130"></Icon>
              <p>点击或拖拽文件上传</p>
            </div>
          </Upload>

        </div>
      </div>

      <div class="right">

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
        <!--      <br>-->
        <row style="width: 100%;height: 100%;margin: auto">
          <div class="ssh_left">
            <!--         {{this.ssh_Folderall}}-->
            <list v-for="getall in ssh_Folderall" :value="getall" :key="getall">
              {{getall.split('\r\n')}}
            </list>
          </div>

          <div class="ssh_right">
            gsf
          </div>
        </row>
      </div>
    </div>

  </div>
</template>

<script>
import { getLinuxList, ssh_Folder } from '@/api/maintaintools'

export default {

  data () {
    return {
      linuxdata: [], // 数据集合
      getformsshtags: {}, // 获取选中的服务器数据
      get_linux_tags: {},
      formsshtags: {},
      filelist: [],
      ssh_Folderall: []
    }
  },

  // vue生命周期，打开页面就加载的数据放在这里
  created () {
    this.get_linux_list()
    // this.getCatalogPath(this.ssh_Folderall)
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
    // 获取服务器目录树
    sshval (val) {
      console.log(val)
      let folder = []
      let fileListall = []
      ssh_Folder(val).then(resdate => {
        // console.log(resdate.data)
        // this.ssh_Folderall=resdate.data .split('\r\n')
        folder.push(resdate.data.split('\r\n'))
        console.log(folder)
        // this.ssh_Folderall =folder
        for (let b in folder) {
          fileListall.push(folder[b])
        }
        // this.ssh_Folderall=fileListall
        for (let fal in fileListall) {
          console.log(fileListall[fal])
          this.ssh_Folderall = fileListall[fal]
        }
      })
    },
    // 判断后带缀的的文件
    GetExtName (fileName) {
      let extArr = fileName.split('.')
      let exts = ['folder', 'folder-unempty', 'sql', 'c', 'cpp', 'cs', 'flv', 'css', 'js', 'htm', 'html', 'java', 'log', 'mht', 'php', 'url', 'xml', 'ai', 'bmp', 'cdr', 'gif', 'ico', 'jpeg', 'jpg', 'JPG', 'png', 'psd', 'webp', 'ape', 'avi', 'flv', 'mkv', 'mov', 'mp3', 'mp4', 'mpeg', 'mpg', 'rm', 'rmvb', 'swf', 'wav', 'webm', 'wma', 'wmv', 'rtf', 'docx', 'fdf', 'potm', 'pptx', 'txt', 'xlsb', 'xlsx', '7z', 'cab', 'iso', 'bz2', 'rar', 'zip', 'gz', 'bt', 'file', 'apk', 'bookfolder', 'folder', 'folder-empty', 'folder-unempty', 'fromchromefolder', 'documentfolder', 'fromphonefolder', 'mix', 'musicfolder', 'picturefolder', 'videofolder', 'sefolder', 'access', 'mdb', 'accdb', 'sql', 'c', 'cpp', 'cs', 'js', 'fla', 'flv', 'htm', 'html', 'java', 'log', 'mht', 'php', 'url', 'xml', 'ai', 'bmp', 'cdr', 'gif', 'ico', 'jpeg', 'jpg', 'JPG', 'png', 'psd', 'webp', 'ape', 'avi', 'flv', 'mkv', 'mov', 'mp3', 'mp4', 'mpeg', 'mpg', 'rm', 'rmvb', 'swf', 'wav', 'webm', 'wma', 'wmv', 'doc', 'docm', 'dotx', 'dotm', 'dot', 'rtf', 'docx', 'pdf', 'fdf', 'ppt', 'pptm', 'pot', 'potm', 'pptx', 'txt', 'xls', 'csv', 'xlsm', 'xlsb', 'xlsx', '7z', 'gz', 'cab', 'iso', 'rar', 'zip', 'bt', 'file', 'apk', 'css']
      let extLastName = extArr[extArr.length - 1]
      for (let i = 0; i < exts.length; i++) {
        if (exts[i] === extLastName) {
          return exts[i]
        }
      }
      return 'file'
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
    }

  }
}
</script>

<style scoped>
  html, body {
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

  .uploadfile {
    margin-left: 20px;
  }

  .ssh_right {
    width: 50%;
    height: 100%;
    float: left;
    content: initial;
    overflow-y: scroll;
    white-space: pre-wrap;
    border-style: double; /*border-style 边框属性*/
    border-width: 2px;
    border-color: #348EED;
    /*padding-right: 10%;*/
    background: #97d4b7;
  }
  .right {
    height: 30%;
    width: 60%;
    padding: 16px;
  /*background-color: #86d0f0;*/
  float: right;
  }

  .ssh_left {
    width: 50%;
    float: left;
    height: 100%;
    font-size: large;
    content: initial;
    overflow-y: scroll; /*内容可拉伸*/
    white-space: pre-wrap; /*内容可拉伸 */
    border-style: double; /*border-style 边框属性*/
    border-width: 2px;
    border-color: #348EED;
  /*background: #348EED;*/
  }

  .footer {
    height: 60%;
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
