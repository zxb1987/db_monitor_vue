<template>

  <div class="layout">
    <div class="left">
      <div style="width: 50%;height: 50%;">
        <!--  multiple  filterable allow-create    获取上到的服务器主机-->
        <div>
          <span style="margin-left: 20px">已选择的：</span>
          <span style="margin-left: 10px" v-for="val in formsshtags" :key="val.tags">{{val.tags}}</span>
        </div>
        <Form ref="formsshtags" :model="formsshtags" :label-width="80">
          <FormItem label="数据列表" prop="get_linux_tags">
            <Select
              multiple
              :max-tag-count="1"
              v-model="formsshtags" filterable allow-create>
              <Option v-for="item in linuxdata" :value="item" :key="item.tags" :label="item.tags">{{item.tags}}</Option>
            </Select>
          </FormItem>
        </Form>
        <!--        开始进行拖拽上传-->

<!--        :on-success="uploadSucess"-->
<!--        :on-error="uploadError"-->
<!--        :loading="loadingStatus"-->
<!--        :action="actionUrl"-->
<!--        :show-upload-list="true"-->
<!--        :show-file-list="false"-->
        <Upload
          multiple
          ref="upload"
          type="drag"
          :before-upload="handleUpload"
          class="uploadfile">
          <div style="width: 50%;height:80%; margin: auto ;">
            <Icon type="ios-cloud-upload" style="color: #3399ff;" size="130" ></Icon>
            <p>点击或拖拽文件上传</p>
          </div>
        </Upload>

      </div>
    </div>

  </div>
</template>

<script>
import { getLinuxList } from '@/api/maintaintools'

export default {
  // name: 'maintaintools-file',

  data () {
    return {
      linuxdata: [], // 数据集合
      formsshtags: [], // 获取选中的服务器数据
      actionUrl: this.$config.upload,
      file: null,
      fileName: '',
      loadingStatus: false,
      resultdate: '',
      uploadFile: []

    }
  },

  // vue生命周期，打开页面就加载的数据放在这里

  methods: {
    // 获取主机信息
    get_linux_list (parameter) {
      getLinuxList(parameter).then(res => {
        this.linuxdata = res.data.results
      }).catch(err => {
        this.$Message.error(`获取Linux主机资源信息错误 ${err}`)
      })
    },
    created () {
      this.get_linux_list()
    },

    // uploadSucess (response, file) { // 上传成功钩子
    //   // console.log('3333333333')
    //   // console.log(this.file)
    //   if (response.msg === '上传成功') {
    //     this.$Message.success('导入成功')
    //   } else {
    //     this.$Message.error(response.msg)
    //   }
    //   file.url = response.data.actionUrl
    //   console.log(response.data.actionUrl)
    //   this.files = null
    //   this.fileName = ''
    // },
    // uploadError () { // 失败
    //   this.$Message.error('导入失败')
    // },
    // handleUpload (file) {
    //   upload_file(this.formsshtags,this.file).then(res=>{
    //     this.resultdate=res.data.result
    //     this.$Message.success('上传成功',)
    //   }).catch(err => {
    //     this.$Message.error(`上传错误 ${err}`)
    //   })
    //   this.file = file;
    //   return false;
    // },

    handleUpload (file) {
      // console.log('00000000000000this.formsshtags')
      // console.log(file)
      // for (let i in file) {
      //   console.log('...............................................')
      //   console.log(i)
      //   this.fileName = i.name
      // }
      // this.file = file
      // this.fileName = file.name
      // //截取文件名
      // let pointPos = this.fileName.indexOf('.');
      // this.fileName = this.fileName.substring(0, pointPos);
      // console.log(this.filename)
      return new Promise((resolve, reject) => {
        let fileName = file.name
        // 截取文件名
        let pointPos = fileName.indexOf('.')
        this.fileName = fileName.substring(0, pointPos)
        console.log(this.filename)
        return resolve(true)
      })
    }

    // handleUpload (res, file) {
    //   console.log('00000000000000this.formsshtags')
    //   upload_fileall(this.formsshtags).then(res => {
    //     this.resultdate = res.data.result
    //     this.$Message.success('上传成功')
    //     console.log('111111111111111')
    //   }).catch(err => {
    //     this.$Message.error(`上传错误 ${err}`)
    //   })
    //   this.file = file
    //   return false
    // },
    // upload () {
    //   this.loadingStatus = true
    //   console.log(this.$refs.upload.post(this.file))
    //   this.$refs.upload.post(this.file)
    // },

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
