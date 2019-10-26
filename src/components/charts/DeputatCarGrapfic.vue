<template>
  <v-layout wrap justify-center>
    <v-flex xs7 class="text-center ml-12">
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
  name: 'DeputatCarGrapfic',
  created() {
    this.loadData();
  },
  components: { SelectPrimary },
  data: vm => ({
    selectedData: 'car',
    data: [
      { name: 'Недвижимость (км кв.)', value: 'house' },
      { name: 'Машины (кол.)', value: 'car' },
    ],
    chartOptions: {
      chart: {
        backgroundColor: 'transparent',
        type: 'packedbubble',
        height: '90%',
      },
      title: {
        text: ''
      },
      // tooltip: {
      //   useHTML: true,
      //   pointFormat: '<b>{point.name}:</b> {point.value}<sub>2</sub>'
      // },
      plotOptions: {
        packedbubble: {
          minSize: '20%',
          maxSize: '100%',
          zMin: 0,
          zMax: 1000,
          layoutAlgorithm: {
            gravitationalConstant: 0.05,
            splitSeries: true,
            seriesInteraction: false,
            dragBetweenSeries: true,
            parentNodeLimit: true
          },
          dataLabels: {
            enabled: true,
            format: '{point.name}',
            filter: {
              property: 'y',
              operator: '>',
              value: 50
            },
            style: {
              color: 'black',
              textOutline: 'none',
              fontWeight: 'normal'
            }
          }
        },
      },
      legend: {
        enabled: false,
      },
      series: [{
        color: '#FF9898',
        name: '',
        data: [{
          name: "Australia",
          value: 409.4
        },
        {
          name: "New Zealand",
          value: 55
        },
        {
          name: "Papua New Guinea",
          value: 7.1
        }]
      }],
    },
  }),
  methods: {
    async loadData() {
      // const data = (await axios.get('http://admin:vbyjvtn@tseluyko.ru:5984/mim/_design/index/_view/money_by_year?inclusive_end=true&start_key=[true,1998]&end_key=[true,2019]&include_docs=true')).data;
      // console.log(data);
    }
  },
  watch: {
    selectedData() {
      this.loadData();
    }
  }
};
</script>