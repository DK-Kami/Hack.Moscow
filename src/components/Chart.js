import { Bar } from 'vue-chartjs'
// import the component - chart you need

export default Bar.extend({
  mounted () {
    const labels = [];

    for (let i = 0; i < 15; i++) {
      const year = 2005 + i;
      for (let quarter = 0; quarter < 4; quarter++) {
        labels.push(year + '/' + quarter);
      }
    }

    this.renderChart({
      labels,
      datasets: [
        {
          label: 'Baka',
          backgroundColor: '#3c8dbc',
          data: [12, 20, 12, 18, 10, 6, 9, 32, 29, 19, 12, 11]
        }
      ]
    },)
  }
})