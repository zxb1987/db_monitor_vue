<template>

  <div class="layout">
    <div class="left">
      <div style="width: 50%;height: 50%;">
        <!--  multiple  filterable allow-create    获取上到的服务器主机-->
        <div>
          <span style="margin-left: 20px">已选择的：</span>
          <span style="margin-left: 10px" v-for="val in formsshtags" :key="val.tags">{{val.tags}}</span>
        </div>
        <Form  :label-width="80">
<!--          //ref="formsshtags" :model="formsshtags"-->
          <FormItem label="数据列表" prop="get_linux_tags">
            <Select
              multiple
              :max-tag-count="1"
              v-model="formsshtags" filterable allow-create>
              <Option v-for="item in linuxdata" :value="item.id" :key="item.tags" :label="item.tags">{{item.tags}}</Option>
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
            <Icon type="ios-cloud-upload" style="color: #3399ff;" size="130" ></Icon>
            <p>点击或拖拽文件上传</p>
          </div>
        </Upload>

      </div>
    </div>

  </div>
</template>

<script>
import { getLinuxList, upload_fileall } from '@/api/maintaintools'

export default {

  data () {
    return {
      linuxdata: [], // 数据集合
      formsshtags: {}, // 获取选中的服务器数据
      get_linux_tags: {},
      filelist: []
    }
  },

  // vue生命周期，打开页面就加载的数据放在这里
  created () {
    this.get_linux_list()
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

    // 上传前操作，判断文件类型，大小
    beforeUpload (file) {
      let from_data = new FormData()
      this.filelist = file
      console.log(this.filelist)
      from_data.append('file', this.filelist)
      from_data.append('data', this.formsshtags)
      console.log(this.formsshtags)
      if (this.formsshtags.length === 0) {
        this.$Message.warning(`上传错误,请选择上传的服务器！`)
      } else {
        upload_fileall(from_data).then(res => {
          console.log(res)
          if (res.status === 200) {
            console.log(res.status)
            this.$Message.success(`上传成功！`)
          } else if (res.status === 401) {
            this.$Message.warning(`没有权限！${error_401}`)
          } else {
            this.$Message.error(`上传失败！${error_404}&&${error_500}`)
          }
        }).then(date => {
          console.log(date)
        }).catch(err => {
          this.$Message.error(`上传错误 ${err}`)
        })
      }

      return false
    },
    // 上传
    upload () {
      this.loadingStatus = true
      console.log(this.$refs.upload.post(this.file))
      this.$refs.upload.post(this.file)
    },
    // 文件上传的状态
    loadingStatus () {
      this.$Message.error('上传失败')
    },
    // 返回成功
    uploadSucess1 (response, file, fileList) {
      // this.$Message.info(response.msg);
      // this.$Message.info(file);
      // this.$Message.info(fileList);
      console.log(response)
      console.log(file)
      console.log(fileList)
      console.log(this.response.data)
    },
    // 返回失败
    uploadError1 () {
      this.$Message.error('导入失败')
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
