<template>
  <div class="layout">
    <Layout>
      <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
        <Card>
          <Table :columns="columns"
                 :data="data"
                 size="small">
          </Table>
          <br>
          <Page :page_size='page_size'
                :total="count"
                @on-change="get_monitoring_info_parameter"
                show-elevator
                show-total/>
        </Card>
      </Content>
    </Layout>
  </div>
</template>

<script>
import { getMonitoringInfo } from '@/api/monitoring'
import { formatDate } from '@/libs/tools'

export default {
  data () {
    return {
      show: false,
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '服务器',
          key: 'tags',
          width: 120
        },
        {
          title: '检测项目类型',
          key: 'monitoring_type',
          width: 200
        },
        {
          title: '检测项目类容',
          key: 'monitoring_content',
          width: 500
        },
        {
          title: '执行时间',
          key: 'monitoring_time',
          width: 200,
          sortable: true,
          render: (h, params) => {
            return h('div',
              formatDate(new Date(params.row.monitoring_time), 'yyyy-MM-dd hh:mm')
            )
          }
        }
      ],
      data: [],
      count: 0,
      page_size: 10,
      create: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      updateId: null
    }
  },
  computed: {
    access () {
      return this.$store.state.user.access
    }
  },
  created () {
    this.get_monitoring_info()
  },
  methods: {
    get_monitoring_info (parameter) {
      getMonitoringInfo(parameter).then(res => {
        this.data = res.data.results
        this.count = res.data.count
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取告警信息错误 ${err}`)
      })
    },
    get_monitoring_info_parameter (parameter) {
      console.log(parameter)
      this.get_monitoring_info(`page=${parameter}`)
    }
  }
}
</script>
<style>
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

  .ivu-table .demo-table-info-cell-danger {
    background-color: #d40f35;
    color: #fff;
  }

  .ivu-table .demo-table-info-cell-mormal {
    background-color: #22d489;
    color: #fff;
  }
</style>
