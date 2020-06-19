<template>
  <layout>

    <body class="body">
      <div class="left" >

        <Row>
          <Alert show-icon>选择主机进行端口/进程检测</Alert>
          <Row :gutter="80">
            <Col span="6">
              <Form :label-width="80">
                <FormItem label="数据列表" prop="get_file_linux_tags"  >
                  <Select
                    multiple
                    :max-tag-count="1"
                    v-model="ipport" filterable allow-create>
                    <Option v-for="item in linuxdata" :value="item.id" :key="item.tags" :label="item.tags">{{item.tags}}</Option>
                  </Select>
                </FormItem>
              </Form>
            </Col>
          </Row>
        </row>

        <row>
          <Row :gutter="2">
            <Alert show-icon>选择端口/进程</Alert>
            <Col span="6">
              <RadioGroup v-model="disabledGroup" >
                <Radio value= 'sour_type' label="进程" disabled></Radio>
                <Radio value= 'sour_type' label="端口"></Radio>
                <Radio value= 'sour_type' label="进程"></Radio>
              </RadioGroup>
            </Col>
          </Row>
        </row>

        <row>
<!--          <Row :gutter="2">-->
<!--            <Alert show-icon>选择服务</Alert>-->
<!--            <Col span="10">-->
<!--              <span> 选择服务：</span>-->
              <Select v-model="mode" clearable style="width:200px">
                <Option value="Tomcat">Tomcat</Option>
                <Option value="NGINX">NGINX</Option>
                <Option value="java">java</Option>
                <Option value="PHP">PHP</Option>
                <Option value="oracle">oracle</Option>
                <Option value="mysql">mysql</Option>
                <Option value="ftp">ftp</Option>
                <Option value="docker">docker</Option>
              </Select>
<!--            </Col>-->
<!--          </Row>-->
        </row>
        </div>
      <div class="regth">

      </div>
    </body>
    <footer>

    </footer>
  </layout>

</template>

<script>
export default {
  // name: "portchecker",
  data () {
    return {
      create: true,
      ruleValidate: '',
      showfooter: '',
      handleSubmit: '',
      formData: '',
      check_name: '',
      ipport: '',
      disabledGroup: '',
      linuxdata: {}

    }
  }

}
</script>

<style scoped>
  .layout{
    height: 100%;
    width: 100%;
  }
  .body{
    height: 50%;
    width: 100%;
  }
  .left{
    height: 100%;
    width: 50%;
  }
  .regth{
    height: 100%;
    width: 50%;
  }

</style>
