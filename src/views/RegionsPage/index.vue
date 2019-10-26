<template>
  <v-layout>
    <v-flex xs7>
      <map-view :objects="currentObjects" />
    </v-flex>

    <v-flex class="sider--left">
      <v-container class="px-10 mt-8">
        <v-layout wrap>
          <v-flex xs8>
            <v-autocomplete
              v-model="selectedCompany"
              :items="values"
              label="Выбор компании"
              item-value="value"
              item-text="text"
            />
          </v-flex>

          <v-layout column v-if="company">
            <v-flex>
              <div class="display-2">{{ getRussianName(company.companyDetail.companyName) }}</div>
              <div class="subtitle">
                <a :href="company.companyDetail.website" class="text--secondary">Website компании</a>
              </div>
            </v-flex>

            <v-flex class="mt-8">
              <div class="display-1 mb-4 font-weight-light">График доходов</div>
              <v-layout v-if="company.entity.length" justify-center>
                <v-flex xs9>
                  <line-chart :chart-data="currentCollection(company.entity)"></line-chart>
                </v-flex>
              </v-layout>
              <div v-else>Данных нет</div>
            </v-flex>

            <v-flex class="mt-8">
              <div class="display-1 mb-4 font-weight-light">Даные о доходах</div>
              <div>
                <v-data-table
                  :items="company.entity"
                  :headers="headers"
                >
                  <template #item.sourceURL="{ item }">
                    <a :href="item.sourceURL">Просмотреть</a>
                  </template>
                </v-data-table>
              </div>
            </v-flex>

            <v-flex class="mt-8">
              <div class="display-1 mb-4 font-weight-light">Отчёты</div>
              <div v-for="report in company.companyDetail.reportYear">
                <a :href="report.link">Отчёт за {{ report.year }} год</a>
              </div>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import LineChart from '@/components/LineChart.js'
import MapView from './Map';
import axios from 'axios';

const headers = [
  { value: 'reportYear', text: 'Год' },
  { value: 'country', text: 'Страна' },
  { value: 'payment', text: 'Прибыль' },
  { value: 'paymentType', text: 'Прибль за' },
  { value: 'sourceURL', text: 'Документ' },  
];

export default {
  name: 'RegionsPage',
  components: {
    LineChart,
    MapView,
  },
  created() {
    // this.initMarkers();
  },
  data: () => ({
    selectedCompany: 'PAO Gazprom',
    russianName: 'ПАО Газпром',
    objects: [],
    values: [],

    company: null,
    headers,
  }),
  computed: {
    currentObjects() {
      return this.objects.filter(o => o.reportingCompany[0] === this.selectedCompany);
    },
  },
  methods: {
    currentCollection(data) {
      const labels = [];
      data.forEach(d => {
        if (!labels.includes(d.reportYear)) labels.push(d.reportYear);
      });

      const datasets = [{
        label: 'Доход компании за весь период',
        backgroundColor: '#5cc0eb',
        data: [],
      }];

      labels.forEach(year => {
        const price = data.reduce((summ, current) => {
          return current.reportYear === year
            ? summ + current.payment
            : summ;
        }, 0);

        datasets[0].data.push(Number(parseFloat(price).toFixed(2)));
      })

      return { labels, datasets };
    },

    getRussianName(value) {
      return this.values.find(v => v.value === value).text;
    },

    async initMarkers() {
      this.objects = (await axios.get('get_country')).data.result[1];
      console.log(this.objects);

      this.rus = (await this.getTranslate(this.objects.map(o => o.reportingCompany[0]).join('|')))[0].split('|');

      this.values = [];
      this.objects.forEach((item, index) => {
        this.values.push({
          value: item.reportingCompany[0],
          text: this.rus[index],
        })
      });
      this.loadCompanyData();

      // const companiesRus = (await this.getTranslate(this.objects.map(o => o.reportingCompany[0]).join('|'))).split('|');

      // companiesRus.forEach((rus, index) => {
      //   console.log(rus);
      //   this.values.push({
      //     value: this.objects[index].reportingCompany[0],
      //     text: rus,
      //   });
      // });
    },
    async getTranslate(text) {
      const result = await axios.get(`
        https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20191020T092535Z.f3b868825bc76bde.94c2c40e5741768db6a07640e28c83592b7d065a&text=${text}&lang=en-ru
      `);

      return result.data.text;
    },
    async loadCompanyData() {
      this.company = (await axios.get('get_company' + this.selectedCompany.split(' ').join('+'))).data;
      console.log(this.company);
    }
  },
  watch: {
    selectedCompany() {
      this.loadCompanyData();
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
