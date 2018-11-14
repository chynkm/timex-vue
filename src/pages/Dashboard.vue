<template>
  <div>

    <!--Stats cards-->
    <div class="row">
      <div class="col-md-6 col-xl-4" v-for="stats in statsCards" :key="stats.title">
        <stats-card>
          <div class="icon-big text-center" :class="`icon-${stats.type}`" slot="header">
            <i :class="stats.icon"></i>
          </div>
          <div class="numbers" slot="content">
            <p>{{stats.title}}</p>
            {{stats.value}}
          </div>
          <div class="stats" slot="footer">
            <i :class="stats.footerIcon"></i> {{stats.footerText}}
          </div>
        </stats-card>
      </div>
    </div>

    <!--Charts-->
    <div class="row">
      <div class="col-12">
        <chart-card title="Last 1 month time spent"
                    sub-title=""
                    :chart-data="activityChart.data"
                    :chart-options="activityChart.options">
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> Work
            <i class="fa fa-circle text-warning"></i> Health
          </div>
        </chart-card>
      </div>
    </div>

  </div>
</template>
<script>
import { StatsCard, ChartCard } from "@/components/index";
import Chartist from 'chartist';
export default {
  components: {
    StatsCard,
    ChartCard
  },
  /**
   * Chart data used to render stats, charts. Should be replaced with server data
   */
  data() {
    return {
      statsCards: [
        {
          type: "info",
          icon: "fa fa-clock-o",
          title: "Time utilised",
          value: "",
          footerText: "Current month",
          footerIcon: "ti-calendar",
          key: 'current_month_time',
        },
        {
          type: "success",
          icon: "ti-wallet",
          title: "Salary",
          value: "",
          footerText: "Current month",
          footerIcon: "ti-timer",
          key: 'current_month_rate',
        },
        {
          type: "danger",
          icon: "fa fa-heartbeat",
          title: "Health",
          value: "",
          footerText: "Current month",
          footerIcon: "ti-timer",
          key: 'current_month_health_time',
        },
        {
          type: "info",
          icon: "fa fa-clock-o",
          title: "Total time utilised",
          value: "",
          footerText: "Till date",
          footerIcon: "ti-calendar",
          key: 'total_time',
        },
        {
          type: "success",
          icon: "ti-wallet",
          title: "Total salary",
          value: "",
          footerText: "Till date",
          footerIcon: "ti-timer",
          key: 'total_rate',
        },
        {
          type: "danger",
          icon: "fa fa-heartbeat",
          title: "Total Health",
          value: "",
          footerText: "Till date",
          footerIcon: "ti-timer",
          key: 'health_total_time',
        }
      ],
      activityChart: {
        data: {},
        options: {
          seriesBarDistance: 10,
          axisX: {
            showGrid: false
          },
          height: "245px"
        }
      },
    };
  },

  mounted() {
    this.getStats();
    this.getGraph();
  },

  methods: {
    getStats() {
      axios.get('stats')
        .then((response) => {
          let data = response.data;
          if(data.status) {
            this.statsCards.forEach(stat => {
              stat.value = data.stats[stat.key];
            });
          }
        },(error) => {
          this.$notify({
            message: 'Oops! There was something wrong in fetching the statatics.',
            type: 'danger'
          })
        });
    },

    getGraph() {
      axios.get('graph')
        .then((response) => {
          let data = response.data;
          if(data.status) {
            this.activityChart.data.labels = data.dates;
            this.activityChart.data.series = data.series;
            // So that the chart is rendered
            window.dispatchEvent(new Event('resize'));
          }
        },(error) => {
          this.$notify({
            message: 'Oops! There was something wrong in fetching the graph information.',
            type: 'danger'
          })
        });
    },
  }
};
</script>
<style>
</style>
