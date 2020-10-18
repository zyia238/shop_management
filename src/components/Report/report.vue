<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import { getReportDiagram } from "../../network/report";
import echarts from "echarts";
import _ from "lodash";
export default {
  name: "",
  data() {
    return {
      diagramData: {},
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      }
    };
  },
  created() {},
  mounted() {
    var myChart = echarts.init(document.getElementById("main"));
    getReportDiagram().then(res => {
      console.log(res);
      this.diagramData = res.data.data;
      var result = _.merge(this.diagramData, this.options);

      console.log(result);
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(this.diagramData);
    });
  },
  computed: {},
  watch: {},
  methods: {}
};
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>
