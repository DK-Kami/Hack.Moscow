<template>
  <v-layout
    class="map-container"
    justify-center
    align-center
    fill-height
  >
    <yandex-map
      :controls="['zoomControl']"
      :settings="settings"
      :coords="coords"
      style="width: 100%; max-width: 100%; height: 100%;"
      zoom="4"
      @map-was-initialized="mapInit"
    />
  </v-layout>
</template>

<script>
import axios from 'axios';
import { yandexMap, ymapMarker } from 'vue-yandex-maps'

export default {
  name: 'Map',
  components: { yandexMap, ymapMarker },
  props: {
    allLoading: Boolean,
  },
  data: () => ({
    coords: [61.52401, 105.318756],
    objectManager: null,
    objectCompanyManager: null,
    ymaps: null,
    map: null,

    settings: {
      restrictMapArea: [[10, 10], [85,-160]],
    },
  }),
  methods: {
    mapInit(map) {
      this.map = map;
      this.objectManager = new ymaps.ObjectManager();
      this.ymaps = ymaps;

      // ymaps.borders.load('RU', {
      //   lang: 'ru',
      //   quality: 3
      // })
      //   .then(async result => {
      //     const regions = (await axios.get('http://localhost:8000/api/regions')).data;
      //     console.log(result);

      //     result.features.forEach(feature => {
      //       var iso = feature.properties.iso3166;
      //       feature.id = iso;
      //       const data = regions.find(r => r.region === feature.properties.name);

      //       feature.properties.balloonContentHeader = feature.properties.name;
      //       if (data) {
      //         const template =
      //         `
      //           <div>Налог нефтегаза: ${data.nalog_ng}</div>
      //           <div>Доход по акцизам (Дизель): ${data.income_akz_dizel}</div>
      //           <div>Доход по акцизам (Нефть): ${data.income_akz_machin_oil}</div>
      //           <div>Доход по акцизам (Бензин): ${data.income_akz_macine_benz}</div>
      //         `;
      //         if (!!Number(data.akz_machine_benz)) {
      //           template += `<div>Акцизы (Бензин): ${data.akz_machine_benz}</div>`
      //         }
      //         if (!!Number(data.akz_dizel)) {
      //           template += `<div>Акцизы (Дизель): ${data.akz_dizel}</div>`
      //         }
      //         if (!!Number(data.akz_motor_oil)) {
      //           template += `<div>Акцизы (Машинное масло): ${data.akz_motor_oil}</div>`
      //         }
      //         feature.properties.balloonContentBody = template;
      //       }

      //       feature.options = {
      //         fillColor: '#000000',
      //         strokeColor: '#000000',
      //         opacity: 0.2,
      //         strokeWidth: 2,
      //       }
      //     });

      //     this.objectManager.add(result);
      //     this.objectManager.objects.events.add('click', this.handleClick);
      //     this.map.geoObjects.add(this.objectManager);
      //   });

      // this.initMarkers();
    },

    async initMarkers() {
      console.log('kakogo')
      const objects = (await axios.get('api_region')).data.result[1];

      this.objectCompanyManager = new ymaps.ObjectManager();

      const features = objects.map(async object => {
        const [projectNameRus, projectTypeRus, commodityRus, reportingCompanyRus] = await this.getTranslateObject(object);

        return {
          type: "Feature",
          id: object._id,
          options: {
            id: object._id,
            iconLayout: "default#image",
            iconImageHref: this.currentImage(object.projectType)
          },
          geometry: {
            type: "Point",
            coordinates: [+object.lat, +object.lon],
          },
          properties: {
            balloonContentHeader: projectNameRus,
            balloonContentBody:
            `
              <div>Класификация:  ${projectTypeRus}</div>
              <div>Продукция:	${commodityRus}</div>
              <div>Выручка:	${Number(parseFloat(object.payment).toFixed(2)).toLocaleString()}</div>
              <div>Компания:	${reportingCompanyRus}</div>
            `,
            reportingCompany: object.projectTypeRus,
            commodity: object.commodityRus,
            type: object.paymentRus,
            name: object.reportingCompanyRus,
            payment: object.payment,
          }
        };
      });
      console.log(features);
      Promise.all(features)
        .then(res => {
          const featuresCollection = {
            type: "FeatureCollection",
            features: res,
          };

          this.objectCompanyManager.add(featuresCollection);
          this.map.geoObjects.add(this.objectCompanyManager);
        })
    },

    handleClick(e) {
      const id = e.get('objectId'),
        geoObject = this.objectManager.objects.getById(id);

      this.objectManager.objects.each(obj => {
        this.objectManager.objects.setObjectOptions(obj.id, {
          opacity: id === obj.id ? 0.5 : 0.2,
        });
      });

      const result = this.ymaps.geoQuery(this.map.geoObjects);
      this.map.setBounds(this.map.geoObjects.getBounds(), {
        checkZoomRange: true
      });
    },
    currentImage(type) {
      switch(type) {
        case 'Corporate':
          return '/img/corporate.png';

        case 'Mining':
        case 'Other':
          return '/img/mining.png';

        default:
          return '/img/oil.png';
      }
    },

    async getTranslateObject(text) {
      const {
        projectName,
        projectType,
        commodity,
        reportingCompany,
      } = text;

      const result = await axios.get(`
        https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20191020T100434Z.395ba249d0dd7507.6ab300ad2ed430ce6444bd9382274f117ef580d6&text=${projectName}&text=${projectType}&text=${commodity}&text=${reportingCompany[0]}&lang=en-ru
      `);
      
      if (result.data.text[1].trim() === 'Корпоративные') result.data.text[1] = 'Корпoрация';
      if (result.data.text[1].trim() === 'Масло') result.data.text[1] = 'Нефть';
      if (result.data.text[2].trim() === 'масло') result.data.text[2] = 'Нефть';
      if (result.data.text[2].trim() === 'лесоматериалами') result.data.text[2] = 'Лесоматериалы';

      return result.data.text;
    }
  },
};
</script>

<style>
  .map-container {
    height: 100vh;
    width: 100%;
    margin-top: 28px;
  }
  .ymaps-2-1-74-ground-pane {
    filter: grayscale(100);
  }
</style>
