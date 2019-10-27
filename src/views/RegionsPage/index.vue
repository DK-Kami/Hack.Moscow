<template>
  <v-layout>
    <v-layout style="position: fixed; z-index: 10000" class="mt-8">
      <v-flex class="pa-4">
        <v-layout class="headline" align-end>
          <select-primary
            v-model="selectedCountry"
            :items="countries"
            title-class="display-1"
            item-value="code"
            item-text="name"
            with-border
          />
        </v-layout>
      </v-flex>
    </v-layout>

    <v-flex xs7>
      <map-view :country="selectedCountry" @select-region="loadRegion" />
    </v-flex>

    <v-flex class="sider--left">
      <v-container class="px-10 mt-8" fill-height>
        <v-layout
          v-if="loading"
          justify-center
          align-center
          fill-height
        >
          <v-flex shrink>
            <div v-if="!allLoad" class="text-center display-1 font-weight-light">
              Выберите на карте регион по которому хотите получить информацию
            </div>
            <v-progress-circular
              v-else
              :size="350"
              :width="4"
              color="#ff7878"
              indeterminate
            />
          </v-flex>
        </v-layout>

        <v-layout v-else>
          <v-tabs
            v-model="tab"
            centered
            grow
          >
            <v-tabs-slider primary />

            <v-tab
              v-for="tab in tabs"
              :key="tab.value"
              :href="'#' + tab.value">
              {{ tab.title }}
            </v-tab>

            <v-tab-item
              v-for="tab in tabs"
              :key="tab.value"
              :value="tab.value"
            >
              <v-layout mt-7 justify-center wrap>
                <v-flex xs9>
                  <div class="display-1 font-weight-light text-center">{{ top.name }}</div>
                  <div class="title font-weight-light grey--text text-center">{{ top.office }}</div>
                </v-flex>

                <v-flex xs12 class="headline font-weight-light text-center mt-6">
                  {{ currentTitle }}: <span class="font-weight-medium">{{ Number(parseFloat(top.value).toFixed(2)).toLocaleString('ru') }} {{ currentUnit }}</span>
                </v-flex>

                <v-flex xs12 class="headline font-weight-light mt-10 mb-5">
                  Остальные депутаты:
                </v-flex>
                <v-flex xs12 class="text-center">
                  <highcharts :options="chartOptions"></highcharts>
                </v-flex>

                <v-flex xs12>
                  <v-list two-line>
                    <v-list-item :key="`data-${index}`">
                      <v-list-item-content>
                        <v-list-item-title>ФИО</v-list-item-title>
                      </v-list-item-content>

                      <v-list-item-action>
                        Доход
                      </v-list-item-action>
                    </v-list-item>
                    <v-divider />

                    <template v-for="(elem, index) in selected">
                      <v-list-item :key="`data-${index}`">
                        <v-list-item-content>
                          <v-list-item-title>{{ elem.name }}</v-list-item-title>
                          <v-list-item-subtitle>{{ elem.office }}</v-list-item-subtitle>
                        </v-list-item-content>

                        <v-list-item-action>
                          {{ Number(parseFloat(elem.value).toFixed(2)).toLocaleString('ru') }}
                        </v-list-item-action>
                      </v-list-item>

                      <v-divider :key="`divider-${index}`" v-if="index + 1 === selected.length" />
                    </template>
                  </v-list>
                  <!-- <v-data-iterator
                    :items="selected"
                    :headers="headers"
                  >
                    s
                  </v-data-iterator> -->
                </v-flex>
              </v-layout>
            </v-tab-item>
          </v-tabs>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import SelectPrimary from '@/components/SelectPrimary';
import MapView from './Map';
import axios from 'axios';
import { Highcharts } from 'highcharts';

const tabs = [
  { value: 'incomes', title: 'Доходы' },
  { value: 'real_estates', title: 'Недвижимость' },
  { value: 'vehicles', title: 'Транспортные средства' },
];

const headers = [
  { text: 'ФИО', value: 'name' },
  { text: 'Должность', value: 'office' },
  { text: 'Доход по субъекту', value: 'value' },
]

export default {
  name: 'RegionsPage',
  components: {
    SelectPrimary,
    MapView,
  },
  data: () => ({
    loading: true,
    selectedCountry: 'RU',
    allLoad: false,

    tab: 'incomes',
    tabs,
    headers,

    incomes: [],
    real_estates: [],
    vehicles: [],
    chartOptions: {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        height: '90%',
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
          }
        }
      },

      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.income}</b><br/>'
      },

      series: [{
        name: "Лидер",
        colorByPoint: false,
        data: []
      },
      {
        name: "Общие",
        colorByPoint: false,
        data: []
      }],
    }
  }),
  computed: {
    countries() {
      return this.$store.getters.getCountries;
    },
    selected() {
      return this[this.tab];
    },
    top() {
      return this.selected[0];
    },
    currentTitle() {
      switch(this.tab) {
        case 'incomes':
          return 'Доход по субъекту РФ';

        case 'real_estates':
          return 'Недвижимости в выбранном субъекте';

        case 'vehicles': 
          return 'Транспортных средств в выьранном субъекте';

        default:
          return '';
      };
    },
    currentUnit() {
      switch(this.tab) {
        case 'incomes':
          return 'руб.';

        case 'real_estates':
          return 'м. кв.';

        case 'vehicles': 
          return 'шт.';

        default:
          return '';
      };
    },
  },
  methods: {
    async loadRegion(regionName) {
      this.allLoad = true;

      this.loading = true;
      const { incomes, real_estates, vehicles } = (await axios.get('http://localhost:5000/api/regions/' + regionName)).data;

      this.incomes = incomes;
      this.real_estates = real_estates;
      this.vehicles = vehicles;

      this.loadCharts()

      this.loading = false;
    },
    loadCharts() {
      this.chartOptions.series[0].data = [];
      this.chartOptions.series[1].data = [];
      
      this.selected.forEach((elem, index) => {
        if (!index) {
          this.chartOptions.series[0].data.push({
            name: elem.name.split(' ')[0],
            y: Number(parseFloat(elem.value).toFixed(2)),
          });
        }
        else {
          this.chartOptions.series[1].data.push({
            income: Number(parseFloat(elem.value).toFixed(2)).toLocaleString('ru'),
            name: elem.name.split(' ')[0],
            y: elem.value,
          });
        }
      })
    },
  },
  watch: {
    tab() {
      this.loadCharts();
    }
  }
};
</script>

<style>
  .sider--left {
    height: 100vh;
    overflow-y: scroll;
  }
</style>
