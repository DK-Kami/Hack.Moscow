<template>
  <v-layout wrap justify-center>
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
    data: [
      { name: 'Доходы с родственниками', value: true },
      { name: 'Доходы без родственников', value: false },
    ],
    chartOptions: {
      chart: {
        backgroundColor: 'transparent',
        height: '70%',
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      colors: ['#FF4546'],

      yAxis: {
        title: {
          text: 'Доходы'
        }
      },
      legend: {
        enabled: false,
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: true,
          },
          pointStart: 1998,
        },
      },

      series: [
        {
          marker: {
            symbol: 'dot'
          },
          name: 'Доходы',
          data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 23],
        }
      ],

      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }]
      }
    }
  }),
  methods: {
    async loadData() {
      const data = (await axios.get('https://admin:vbyjvtn@tseluyko.ru:5984/mim/_design/index/_view/money_by_year?inclusive_end=true&start_key=[true,1998]&end_key=[true,2019]&include_docs=true')).data;
      console.log(data);
    }
  },
  watch: {
    selectedData() {
      this.loadData();
    }
  }
};
</script>