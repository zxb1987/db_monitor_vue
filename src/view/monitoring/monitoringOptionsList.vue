<template>
  <div style="background: #f8f8f9;height: 320px">
  <Form :model="formData"
        :rules="ruleValidate"
        ref="formData">
    <row>
      <Row>
        <div class="form_one">
            <FormItem label="选择主机"
                      label-position="top"
                      prop="host"
                      style="margin-bottom: 0px">
              <Select placeholder="请选择主机"
                v-model="formValisshdate.host">
                <Option v-for="item in linuxdata" v-bind:value="item.host" :key="item.host" :label="item.host"></Option>
              </Select>
            </FormItem>
        </div>
        <div class="form_five">
          <Button type="primary" @click="handleSubmitssh()">连接主机</Button>
          <!--<Button @click="handleReset('formValisshdate')" style="margin-left: 8px">重置</Button>-->
        </div>
      </Row>
      <!--<Row>
        <div class="form_two">
           <FormItem label="SQL类型"
                    label-position="top"
                    prop="databasetype" style="margin-bottom: 0px">
            <Select placeholder="请选择数据库类型"
                    v-model="formData.databasetype">
              <Option value='1'>Oracle</Option>
              <Option value='2'>MySQL</Option>
              <Option value='3'>MariaDB</Option>
              <Option value='4'>PostgreSQL</Option>
              <Option value='5'>SQL Server</Option>
              <Option value='6'>Redis</Option>
            </Select>
          </FormItem>
        </div>
        </row>-->
      <row span="8">
        <div class="form_three">
        <FormItem label="数据库"
                  label-position="top"
                  prop="database" style="margin-bottom: 0px">
          <Select placeholder="请选择数据库"
                  v-model="formValisshdate.databases_list" @on-change="indexselect">
            <Option v-for="(dbase,index) in databases" :key="index" :value="dbase.basedb" >{{dbase.basedb}}</Option>
          </Select>

        </FormItem>
        </div>
      </row>

      <row span="9">
        <div class="form_fourth">
          <FormItem label="查看表结构"
                    label-position="top"
                    prop="databasetables" style="margin-bottom: 0px">
            <Select placeholder="表结构"
                    v-model="formValisshdate.databases_tables">
              <Option v-for="(tabs,index) in datatables" :key="index" :value="tabs" >{{tabs}}</Option>
            </Select>
          </FormItem>
        </div>
      </row>
    </Row>
  </Form>
  </div>
</template>

<script>
import { getLinuxList, logintoserver } from '@/api/assets'
export default {
  name: 'monitoringOptionsList',
  data () {
    return {
      columns: [],
      data: [],
      linuxdata: [],
      databases: [],
      datatables: [],
      indexNum: 0,
      create: false,
      updateId: null,
      formData: {
        databasetype: '',
        databasetables: '',
        database: '',
        rowsnumber: '',
        master: ''
      },
      formValisshdate: {
        linux_tags_val: [],
        databases_list: [],
        databases_tables: [],
        host: '',
        sshport: '',
        user: '',
        password: ''
      },
      ruleValidate: {
        host: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        /* master: [
              { required: true, message: '此项目必填', trigger: 'blur' }
            ], */
        databasetype: [
          { required: false, message: '此项目必填', trigger: 'blur' }
        ],
        databasetables: [
          { required: false, message: '此项目必填', trigger: 'blur' }
        ],
        database: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getalllinuxlist()
  },
  computed: {},
  components: {},
  methods: {
    getalllinuxlist (event) {
      getLinuxList().then(res => {
        console.log(res.data.results)
        this.linuxdata = res.data.results
      }).catch(err => {
        this.$Message.error(`获取主机信息错误!! ${err}`)
      })
    },
    // 登录SSH
    handleSubmitssh: function () {
      console.log('IP端口' + this.formValisshdate.host)
      let linux_data_msgs = []
      for (let i in this.linuxdata) {
        if (this.formValisshdate.host === this.linuxdata[i].host) {
          let obj = {}
          obj.host = this.formValisshdate.host
          obj.user = this.linuxdata[i].user
          obj.password = this.linuxdata[i].password
          obj.sshport = this.linuxdata[i].sshport
          linux_data_msgs.push(obj)
        }
      }
      console.log(linux_data_msgs)
      logintoserver(linux_data_msgs).then(res => {
        if (res.data.length != null) {
          this.databases = []
          console.log(res.data)
          this.databases = res.data
        }
      }).catch(err => {
        this.$Message.error(`登录错误!! ${err}`)
      })
    },
    indexselect (event) {
      this.formValisshdate.databases_tables = ''
      this.datatables = []
      console.log(this.databases[0])
      for (let k = 0; k <= this.databases.length; k++) {
        if (this.formValisshdate.databases_list === this.databases[k]['basedb']) {
          this.datatables = this.databases[k]['tables']
        }
      }
    }
  }
}
</script>

<style scoped>
  .form_one ,.form_two,.form_three,.form_fourth{
    width: 25%;
    float: left;
    /*margin: 0 auto;*/
    margin-left: 80px;
    margin-top: 10px;
    /*margin-left: 30px;*/
  }
  .form_five{
    position: absolute;
    margin-left: 300px;
    margin-top: 43px;
  }
</style>
