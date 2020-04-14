<template>
  <card>
    <div>
    <Row>
      <Input  id="search_info"
              placeholder="sql搜索"
              style="width: 200px" />&nbsp;
      <Button
              type="primary">搜索</Button>&nbsp;
      <Button
              type="success">刷新</Button>
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
                <textarea type="text" v-model="formData.sql_data"
                          placeholder="请输入自定义sql:请按照sql语法进行输入!!!"></textarea>
          </FormItem>
        </Col>
      </Form>
      <Button
              type="primary">添加保存至数据库</Button>&nbsp;
      <Button type="primary"
              @click="submit">执行</Button>&nbsp;
     <!-- <div class="expot-message">
        <Row>-->
          <Button
            type="success">导出执行结果</Button>
        <!--</Row>
      </div>-->
    </div>
    </row>
    <div class="text_title"><span>查询结果：</span></div>
    <div id="message-right" class="show-message">
      <div class="show-messages">
    <row>
      <table border="0" cellpadding="1" class="show-table">
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
  </card>
</template>
<script>
import { mysqlExecute } from '@/api/assets'
export default {
  name: 'monitoring-querying.vue',
  data () {
    return {
      headerList: [],
      bodyInfoList: [],
      formData: {
        sql_data: ''
      },
      ruleValidate: {
        sql_data: [
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
  },
  methods: {
    submit: function () {
      let param = {
        'data': this.formData.sql_data
      }
      console.log(this.formData)
      console.log(this.formData.sql_data)
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
    border: 1px solid black;
    /*float: right;*/
  }
  table
  {
    width: 100%;
    border-collapse: collapse;
   /* margin: 0 auto;*/
    text-align: center;
    table-layout:fixed;
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
    height: 300px;
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
    height: 50px;
    display: block;
    width: 100%;
    overflow: auto;
    white-space: normal;
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
    /*text-align: vertical-align;*/
    font-family:PingFangSC-Regular;
    font-weight:400;
    background:rgba(248,248,248,1);
    /*line-height:0.586667rem;*/
  }
  textarea::-webkit-input-placeholder{
    color: #CCCCCC;
  }
</style>
