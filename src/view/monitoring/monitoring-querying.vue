<template>
  <card>
    <div>
    <Row>
      <Input  id="search_info"
              placeholder="请输入业务名称"
              style="width: 200px"
              v-model="monitoring_name_search"/>&nbsp;
      <Button @click="search"
              type="primary">搜索</Button>&nbsp;
      <Button @click="clear_search"
              type="success">重置</Button>
    </Row>
   <row>
    <div id="text-left" class="send-left">
      <Form ref="formData"
            :model="formData"
            :rules="ruleValidate" >
        <Col>
          <FormItem label="mysq查询"
                    label-position="top"
                    prop="sql_data">
                <textarea id="input_str" value="" type="text" v-model="formData.sql_data"
                          placeholder="请输入自定义sql:请按照sql语法进行输入!!!"></textarea>
          </FormItem>
        </Col>
      </Form>
      <Button @click="SaveToDatabase"
              type="primary">添加保存至数据库</Button>&nbsp;
      <Button type="primary"
              @click="submit">执行</Button>&nbsp;
     <!-- <div class="expot-message">
        <Row>-->
          <Button
            type="success" icon="ios-download-outline"
          @click="exportData">导出执行结果</Button>
        <!--</Row>
      </div>-->
    </div>
     <div id="scor-right" class="send-right">
      <!-- <h>实例列表项</h>-->
       <monitoringOptionsList></monitoringOptionsList>
     </div>
    </row>
    <div class="text_title"><span>查询结果：</span></div>
    <div id="message-right" class="show-message">
      <div class="show-messages">
    <row>
      <table border="1" cellpadding="1" class="show-table" ref="table">
        <thead>
        <tr>
          <!-- 循环出表头，用英文的逗号拆分字串 -->
          <th v-for="(item,index) in headerList" :key="index">{{item}}</th>
        </tr>
        </thead>
        <tbody>
        <!-- 循环出有多少行数据，即 list 中有多少条数据，得到 list 中的每个元素 -->
        <tr v-for="(item,index) in bodyInfoList" :key="index">
          <!-- 循环取到元素的每个属性，并展示 -->
          <td v-for="(val,index) in item" :key="index" class="col_td">{{val}}</td>
        </tr>
        </tbody>
      </table>
    </row>
    </div>
    </div>
    </div>
    <!--模态框-->
    <Modal width="1000"
           v-model="tostatus"
           title="请选择配置信息"
           @on-ok="success_save"
           @on-cancel="cancel_save" class="model-ssh">

      <Form :model="formData"
            :rules="ruleValidate"
            ref="formData">
        <Alert show-icon>基础信息</Alert>
        <Row :gutter="32">
          <Col span="6">
            <FormItem label="SQL类型"
                      label-position="top"
                      prop="type">
              <Select placeholder=""
                      v-model="formData.type">
                <Option value='1'>Oracle</Option>
                <Option value='2'>MySQL</Option>
                <Option value='3'>MariaDB</Option>
                <Option value='4'>PostgreSQL</Option>
                <Option value='5'>SQL Server</Option>
                <Option value='6'>Redis</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="SQL检测指标名称"
                      label-position="top"
                      prop="name">
              <Input placeholder="请输入SQL检测指标名称"
                     v-model="formData.name">
              </Input>
            </FormItem>
          </Col>
        </Row>
        <Alert show-icon>重新写入SQL配置</Alert>
        <Row :gutter="32">
          <Col span="24">
            <FormItem prop="judge_sql">
              <Input :rows="10" type="textarea" v-model="formData.judge_sql"
              >
              </Input>
            </FormItem>
          </Col>
        </Row>
      </Form>

    </Modal>
  </card>
</template>
<script>
import { mysqlExecute } from '@/api/assets'
import { createMonitoringConfig, getMonitoringConfig } from '@/api/monitoring'
import monitoringOptionsList from './monitoringOptionsList'
export default {
  name: 'monitoring-querying.vue',
  data () {
    return {
      tostatus: false,
      headerList: [],
      bodyInfoList: [],
      formData: {
        sql_data: '',
        type: '',
        name: '',
        judge_sql: ''
      },
      monitoring_name_search: '',
      dataquering: '',
      ruleValidate: {
        sql_data: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ]

      }
    }
  },
  computed: {
    access () {
      return this.$store.state.user.access
    }
  },
  components: {
    monitoringOptionsList
  },
  methods: {
    submit: function () {
      let param = {
        'data': this.formData.sql_data
      }
      /* console.log(this.formData)
      console.log(this.formData.sql_data) */

      console.log(param)
      mysqlExecute(this.formData.sql_data).then(res => {
        this.headerList = []
        this.bodyInfoList = []
        console.log(res)
        let item = {}
        let title_item = {}
        if (res.data.length > 0) {
          for (item in res.data[0]) {
            console.log(item)
            this.headerList.push(item)
          }
        }
        console.log(this.headerList)
        for (title_item of res.data) {
          /* console.log(title_item) */
          this.bodyInfoList.push(title_item)
        }
        console.log(this.bodyInfoList)
        if (res.data.length > 0) { this.$Message.success('执行成功!') } else { this.$Message.success('无数据!') }
      }).catch(err => {
        this.$Message.error(`执行错误!! ${err}`)
      })
    },
    exportData () {
      let tableHtml = document.getElementsByClassName('show-table')
      let appendHtml = ''
      for (let i = 0; i < tableHtml.length; i++) {
        appendHtml += tableHtml[i].outerHTML
      }
      let html = "<html><head><meta charset='utf-8' /></head><body>" + appendHtml + '</body></html>'
      // 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
      let blob = new Blob([html], { type: 'application/vnd.ms-excel' }) // application/octet-stream
      // 创建一个a标签
      let a = document.createElement('a')
      // var a = document.getElementsByTagName("a")[0];
      // 利用URL.createObjectURL()方法为a元素生成blob URL
      a.href = URL.createObjectURL(blob)
      // 设置文件名加时间戳
      let aData = new Date()
      /* console.log(aData) */
      this.aDatevalue =
            aData.getFullYear() + '-' + (aData.getMonth() + 1) + '-' + aData.getDate() + '-' + aData.getTime()
      /* console.log(this.aDatevalue) */
      a.download = '查询信息表' + this.aDatevalue + '.xls' // xlsx
      a.click()
    },

    clear_search () {
      this.monitoring_name_search = ''
      this.formData.sql_data = ''
      this.headerList = []
      this.bodyInfoList = []
    },
    SaveToDatabase () {
      this.tostatus = true
      /* this.tostatus(params.index) */
    },
    cancel_save () {
      this.$Message.info('取消操作')
    },
    success_save () {
      // to do
      if (!this.formData.sql_data && !this.formData.judge_sql) { this.$Message.error({ content: '没有写入sql ！！', duration: 5, closable: true }) }
      if (this.formData.sql_data && !this.formData.judge_sql) {
        this.formData.judge_sql = this.formData.sql_data
        createMonitoringConfig(this.formData).then(res => {
          console.log(res)
          this.$Message.success('新增SQL配置成功!')
        }).catch(err => {
          console.log(err.response)
          this.$Message.error({
            content: `新增SQL配置错误 ${Object.entries(err.response.data)}`,
            duration: 10,
            closable: true
          })
        })
      } else {
        createMonitoringConfig(this.formData).then(res => {
          console.log(res)
          this.$Message.success('新增SQL配置成功!')
          /* this.get_monitoring_config_list()
                  this.create = false */
        }).catch(err => {
          console.log(err.response)
          this.$Message.error({
            content: `新增SQL配置错误 ${Object.entries(err.response.data)}`,
            duration: 10,
            closable: true
          })
        })
        /* this.$Message.success({ content: '保存成功，请到SQL配置中查看', duration: 5 }) */
      }
    },
    search () {
      console.log(this.monitoring_name_search)
      if (this.monitoring_name_search.length > 0) { this.get_monitoring_config_list(`name=${this.monitoring_name_search}`) }
    },
    get_monitoring_config_list (parameter) {
      getMonitoringConfig(parameter).then(res => {
        console.log(res.data.results)
        document.getElementById('input_str').value = res.data.results[0].judge_sql
        this.formData.sql_data = res.data.results[0].judge_sql
        console.log(this.dataquering)
      }).catch(err => {
        this.$Message.error(`配置信息错误 ${err}`)
      })
    }
  },

  created () {
  },
  mounted () {
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
  .send-left{
    float: left;
    width: 50%;
    height: 300px;
    border: 1px;
    solid-color: #87d068;
  }
  .send-right{
    float: right;
    width: 50%;
    height: 300px;
    /*background: antiquewhite;*/
  }
  .text_title{
    width: 100%;
    overflow-y: auto;
    margin-top: 110px;
    display: inline-block;
    position:relative;
    float: left;
  }
  .expot-message{
    position:absolute;
    float: right;
    width: 100%;
    margin-top: 10px;
    display: inline-block;
  }
  .show-message{
    width: 100%;
    height: 300px;
    overflow-y: auto;
    margin-top: 10px;
    display: inline-block;
    position:relative;
    float: left;
    /*border: 0.5px solid black;*/
    /*float: right;*/
  }
  table
  {
    width: 100%;
    border-collapse: collapse;
   /* margin: 0 auto;*/
    text-align: center;
    /*table-layout:fixed;*/
  }
  table thead,
  tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }
  table thead{
    width: calc(100% - 1.2em)
  }
  table tbody{
    width: 100%;
    height: 260px;
    overflow-y:scroll;
    display:block
  }
 /* table thead tbody{
    width: 10%;
  }*/
  table td, table th
  {
    /*width: 100px;*/
    border: 1px solid #cad9ea;
    color: #666;
    height: 30px;
  }
  table tbody td{
    overflow:hidden;
    white-space:nowrap;
    /*text-overflow:ellipsis;*/
  }
  td:hover{
    height: 40px;
    display: block;
    width: 100%;
    overflow: auto;
    white-space: normal;
    text-align: center;
  }
  table thead th
  {
    background-color: #CCE8EB;
    width: 100px;
  }
  table tr:nth-child(odd)
  {
    background: #fff;
  }
  table tr:nth-child(even)
  {
    background: #F5FAFA;
  }

  form{
    width: 100%;
  }
  textarea{
    width: 100%;
    height: 285px;
    position:relative;
    padding-left: 0.533333rem;
    border-radius:0.4rem;
    color:#333333;
    font-size: 0.426667rem;
    font-family:PingFangSC-Regular;
    font-weight:400;
    background:rgba(248,248,248,1);
    /*line-height:0.586667rem;*/
  }
  textarea::-webkit-input-placeholder{
    color: #CCCCCC;
  }
</style>
