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
    </template>
  </v-layout>
</template>

<script>
import { Highcharts } from 'highcharts';
import SelectPrimary from '@/components/SelectPrimary';
import axios from 'axios';

export default {
  name: 'DeputatCarGrapfic',
  created() {
    console.log('da');
    this.loadData();
  },
  components: { SelectPrimary },
  data: vm => ({
    selectedData: 'possessions',
    loading: true,
    data: [
      { name: 'Недвижимость (км кв.)', value: 'possessions' },
      { name: 'Машины (кол.)', value: 'cars' },
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
      tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.name}:</b> {point.trueValue}'
      },
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
        data: []
      }],
    },
  }),
  methods: {
    async loadData() {
      this.loading = true;
      this.chartOptions.series[0].data = [];

      console.log(this.selectedData);

      const data = (await axios.get('http://localhost:5000/api/metric/' + this.selectedData)).data.rows;
      data.sort((x, y) => x.value[1] < y.value[1] ? 1 : -1).splice(0, 50).forEach(elem => {
        this.chartOptions.series[0].data.push({
          trueValue: Number(parseFloat(elem.value[1]).toFixed(2)).toLocaleString('ru'),
          value: elem.value[1] * (this.selectedData === 'cars' ? 11 : 0.00001),
          name: elem.value[0],
        });
      });
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