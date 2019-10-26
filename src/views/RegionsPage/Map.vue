<template>
  <v-layout
    class="map-container"
    justify-center
    align-center
    fill-height
  >
    <yandex-map
      :controls="['zoomControl']"
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
    country: String,
  },
  data: () => ({
    coords: [61.52401, 105.318756],
    objectManager: null,
    ymaps: null,
    map: null,
  }),
  methods: {
    mapInit(map) {
      this.map = map;
      this.objectManager = new ymaps.ObjectManager();
      this.ymaps = ymaps;

      ymaps.borders.load(this.country, {
        lang: 'ru',
        quality: 3
      })
        .then(async result => {
          // const regions = (await axios.get('http://localhost:8000/api/regions')).data;
          console.log(result);

          result.features.forEach(feature => {
            var iso = feature.properties.iso3166;
            feature.id = iso;
            // const data = regions.find(r => r.region === feature.properties.name);

            // feature.properties.balloonContentHeader = feature.properties.name;
            // if (data) {
            //   const template =
            //   `
            //     <div>Налог нефтегаза: ${data.nalog_ng}</div>
            //     <div>Доход по акцизам (Дизель): ${data.income_akz_dizel}</div>
            //     <div>Доход по акцизам (Нефть): ${data.income_akz_machin_oil}</div>
            //     <div>Доход по акцизам (Бензин): ${data.income_akz_macine_benz}</div>
            //   `;
            //   if (!!Number(data.akz_machine_benz)) {
            //     template += `<div>Акцизы (Бензин): ${data.akz_machine_benz}</div>`
            //   }
            //   if (!!Number(data.akz_dizel)) {
            //     template += `<div>Акцизы (Дизель): ${data.akz_dizel}</div>`
            //   }
            //   if (!!Number(data.akz_motor_oil)) {
            //     template += `<div>Акцизы (Машинное масло): ${data.akz_motor_oil}</div>`
            //   }
            //   feature.properties.balloonContentBody = template;
            // }

            feature.options = {
              fillColor: '#000000',
              strokeColor: '#000000',
              opacity: 0.2,
              strokeWidth: 2,
            }
          });

          this.objectManager.add(result);
          this.objectManager.objects.events.add('click', this.handleClick);
          this.map.geoObjects.add(this.objectManager)
          setTimeout(() => {
            this.map.setBounds(this.objectManager.getBounds());
          }, 0);
        });
    },

    handleClick(e) {
      const id = e.get('objectId'),
        coords = e.get('coords'),
        geoObject = this.objectManager.objects.getById(id);

      this.objectManager.objects.each(obj => {
        this.objectManager.objects.setObjectOptions(obj.id, {
          opacity: id === obj.id ? 0.5 : 0.2,
        });
      });

      this.map.setCenter(coords);
      console.log(geoObject);
      this.$emit('select-region');
    },
  },
  watch: {
    country() {
      if (this.map) {
        if (this.objectManager) {
          this.objectManager.removeAll();
        }
        this.mapInit(this.map);
      }
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
