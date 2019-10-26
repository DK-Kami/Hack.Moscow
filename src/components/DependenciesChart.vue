<template>
  <line-chart v-if="datacollection" :chart-data="datacollection"></line-chart>
</template>

<script>
import LineChart from './LineChart.js'
import axios from 'axios';

export default {
  components: {
    LineChart
  },
  data () {
    return {
      datacollection: null
    }
  },
  mounted () {
    this.fillData()
  },
  methods: {
    async fillData () {
      const { l_m, n_p, c } = (await axios.get('http://localhost:8000/api/diagram/lm')).data;
      const data = (await axios.get('http://localhost:8000/api/vvp')).data;

      let vvp = [];
      for (let i = 0; i < 15; i++) {
        const year = 2005 + i;
        for (let quarter = 0; quarter < 4; quarter++) {
          const vvpYear = data.find(d => d.year === year)
          if (!vvpYear) continue;
          vvp.push((parseFloat(vvpYear.vvp.split(' ').join('').split(',').join('.')) / 60) / vvpYear.curs);
        }
      }
      vvp = vvp.splice(0, vvp.length - 2);
      console.log(vvp);

      this.datacollection = {
        labels: this.getLabels(),
        datasets: [
          {
            label: 'ВВП',
            backgroundColor: '#777',
            data: vvp,
          },
          {
            label: 'Цена нефти',
            backgroundColor: '#000',
            data: n_p.map(x => parseFloat(x.price).toFixed(2)),
          },
          {
            label: 'Прожиточный минимум',
            backgroundColor: '#5cc0eb',
            data: l_m.map(x => {
              const course = c.find(c => (x.year === c.year) && (x.quarter === c.quarter));
              return +x.total / +course.value;
            })
          },
        ]
      };
    },
    getLabels() {
      const labels = [];

      for (let i = 0; i < 15; i++) {
        const year = 2005 + i;
        for (let quarter = 0; quarter < 4; quarter++) {
          labels.push(year + '/' + (quarter + 1));
        }
      }
      return labels.splice(0, labels.length - 2);
    },
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    },
  },
};
</script>

<style>
</style>