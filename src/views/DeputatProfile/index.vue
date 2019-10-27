<template>
  <v-layout fill-height>
    <v-layout v-if="!person" fill-height justify-center align-center>
      <v-progress-circular
        :size="270"
        :width="4"
        color="#ff7878"
        indeterminate
      ></v-progress-circular>
    </v-layout>

    <v-layout v-else justify-center wrap mt-12>
      <v-flex xs9>
        <div class="display-1 font-weight-light text-center">{{ person.main.person.name }}</div>
        <div class="title font-weight-light grey--text text-center"><a :href="person.main.office.url">{{ person.main.office.name }}</a></div>
      </v-flex>

      <v-flex xs5>
        <div class="text-center headline mb-6">Доходы за последний год</div>
        <highcharts :options="chartOptions"></highcharts>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
import axios from 'axios';
import { Highcharts } from 'highcharts';

export default {
  name: 'DeputatProfile',
  props: {
    id: [String, Number],
  },
  created() {
    this.loadPerson();
  },
  data: () => ({
    person: null,
    chartOptions: {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        height: '40%',
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      colors: ['#283593', '#ff7878'],
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: ''
        }

      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
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
        name: "Личные",
        colorByPoint: false,
        data: []
      }, {
        name: "Родственники",
        colorByPoint: false,
        data: []
      }],
    }
  }),
  methods: {
    async loadPerson() {
      this.person = (await axios.get('http://localhost:5000/api/persons/' + this.id)).data;

      if (this.person.incomes && this.person.incomes.length) {
        this.chartOptions.series[0].data.push({
          y: this.person.incomes[0].size,
        });
        if (this.person.incomes.length > 1) {
          this.chartOptions.series[1].data.push({
          y: this.person.incomes[1].size,
        });
        }
      }
    },
  },
};
</script>
