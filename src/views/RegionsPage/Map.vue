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
    objects: [Array, Object],
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
    },

    async initMarkers() {
      this.objectCompanyManager = new ymaps.ObjectManager();

      const features = this.objects.map(async object => {
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
      
      if (result.data.text[1].trim() === 'Корпоративные') result.data.text[1] = 'Коропрация';
      if (result.data.text[1].trim() === 'Масло') result.data.text[1] = 'Нефть';
      if (result.data.text[2].trim() === 'масло') result.data.text[2] = 'Нефть';
      if (result.data.text[2].trim() === 'лесоматериалами') result.data.text[2] = 'Лесоматериалы';

      return result.data.text;
    }
  },
  watch: {
    objects(neVal) {
      if (this.objectCompanyManager) {
        this.objectCompanyManager.removeAll();
      }
      this.initMarkers();
    },
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
