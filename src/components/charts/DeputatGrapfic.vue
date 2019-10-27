<template>
  <v-layout wrap justify-center>
    <v-flex v-if="loading" shrink>
      <v-progress-circular
        :size="270"
        :width="4"
        color="#ff7878"
        indeterminate
      ></v-progress-circular>
    </v-flex>

    <template v-else>
      <v-flex xs7 class="text-center ml-12 pl-12 pb-5">
        <select-primary
          v-model="selectedData"
          :items="data"
          title-class="headline"
          item-value="value"
          item-text="name"
        />
      </v-flex>
      <v-flex xs12>
        <highcharts :options="chartOptions"></highcharts>
      </v-flex>
    </template>
  </v-layout>
</template>

<script>
import { Highcharts } from 'highcharts';
import SelectPrimary from '@/components/SelectPrimary';
import axios from 'axios';

export default {
  name: 'DeputatGrapfic',
  created() {
    this.loadData();
  },
  components: { SelectPrimary },
  data: () => ({
    selectedData: true,
    loading: true,
    data: [
      { name: 'Доходы с родственниками', value: true },
      { name: 'Доходы без родственников', value: false },
    ],
    chartOptions: {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        height: '70%',
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      colors: ['#ff7878'],
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: ''
        }

      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: false,
            format: '{point.y:.1f}%'
          }
        }
      },

      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.year}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.year}</span>: <b>{point.y:.2f}</b> рублей<br/>'
      },

      series: [{
        name: "",
        colorByPoint: false,
        data: [{
          name: "",
          y: 62.74,
          drilldown: "Chrome"
        }]
      }],
    }
  }),
  methods: {
    async loadData() {
      this.loading = true;
      this.chartOptions.series[0].data = [];
      const data = (await axios.get(`http://localhost:5000/api/metric/money_by_year?inclusive_end=${this.selectedData}&start_key=[true,1998]&end_key=[true,2019]&include_docs=true`)).data.rows;
      for (let year = 1998; year < 2020; year++) {
        const dataForYear = data.filter(d => +d.key[1] === +year);
        this.chartOptions.series[0].data.push({
          y: dataForYear.reduce((summ, current) => summ + current.value, 0),
          year,
        });
      }
      this.loading = false;
    }
  },
  watch: {
    selectedData() {
      this.loadData();
    },
  },
};
</script>