<template>
  <div>
  <Form :model="formData"
        :rules="ruleValidate"
        ref="formData">
    <row>
      <Row>
        <div class="form_one">
          <FormItem label="选择主机"
                    label-position="top"
                    prop="type" style="margin-bottom: 0px">
            <Select placeholder=""
                    v-model="formData.master">
              <Option value='1'>192.1681.1.110</Option>
              <Option value='2'>10.0.0.35</Option>
            </Select>
          </FormItem>
        </div>
      </Row>

    <Row>
      <div class="form_two">
         <FormItem label="SQL类型"
                  label-position="top"
                  prop="type" style="margin-bottom: 0px">
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
      </div>
      </row>

      <row span="8">
        <div class="form_three">
        <FormItem label="数据库实例"
                  label-position="top"
                  prop="database" style="margin-bottom: 0px">
          <Select placeholder=""
                  v-model="formData.database">
            <Option value='1'>db_monitor</Option>
            <Option value='2'>MySQL</Option>
          </Select>
        </FormItem>
        </div>
      </row>

      <row span="9">
        <div class="form_fourth">
        <FormItem label="查看表结构"
                  label-position="top"
                  prop="databasetables" style="margin-bottom: 0px">
          <Select placeholder=""
                  v-model="formData.databasetables">
            <Option value='1'>db_monitor</Option>
            <Option value='2'>MySQL</Option>
          </Select>
        </FormItem>
        </div>
      </row>
      <!--<Col span="10">
        <FormItem label="SQL返回行数"
                  label-position="top"
                  prop="rowsnumber">
          <Input placeholder="请输入SQL返回行数"
                 v-model="formData.rowsnumber">
          </Input>
        </FormItem>
      </Col>-->
    </Row>
  </Form>
  </div>
</template>

<script>
export default {
  name: 'monitoringOptionsList',
  data () {
    return {
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          sortable: true
        },
        {
          title: 'SQL类型',
          key: 'type',
          width: 160,
          render: (h, params) => {
            const typeMap = {
              1: { desc: 'Oracle数据库' },
              2: { desc: 'MySQL数据库' },
              3: { desc: 'MariaDB' },
              4: { desc: 'PostgreSQL' },
              5: { desc: 'SQL Server' },
              6: { desc: 'Redis' }
            }
            const type = params.row.type
            return h('div', typeMap[type]['desc'])
          }
        }
      ],
      data: [],
      create: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      updateId: null,
      formData: {
        type: '',
        databasetables: '',
        database: '',
        rowsnumber: '',
        master: ''
      },
      ruleValidate: {
        master: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        databasetables: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ],
        database: [
          { required: true, message: '此项目必填', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style scoped>
  .form_one ,.form_two,.form_three,.form_fourth{
    width: 35%;
    /*float: right;*/
    /*margin: 0 auto;*/
    /*margin-right: 10px;*/
    margin-top: 10px;
    margin-left: 30px;
  }
</style>
