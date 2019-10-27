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
    country: String,
  },
  data: () => ({
    coords: [61.52401, 105.318756],
    objectManager: null,
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

      ymaps.borders.load(this.country, {
        lang: 'ru',
        quality: 3
      })
        .then(async result => {
          const regions = (await axios.get('http://localhost:5000/api/regions')).data.rows;

          result.features.forEach(feature => {
            var iso = feature.properties.iso3166;
            feature.id = iso;
            const region = regions.filter(r => r.key[0].toString().toLowerCase() === feature.properties.name.toString().toLowerCase());

            feature.properties.balloonContentHeader = feature.properties.name;
            if (region.length) {
              const incomes = region.find(r => r.key[1] === 'incomes');
              const real_estates = region.find(r => r.key[1] === 'real_estates');
              const vehicles = region.find(r => r.key[1] === 'vehicles');

              const template =
              `
                <table>
                  <tr>
                    <td>Количество должностых лиц, имеющих доход:</td>
                    <td style="padding-left: 5px">${incomes.value.count} чел.</td>
                  </tr>
                  <tr>
                    <td>Полученный доход по субъекту:</td>
                    <td style="padding-left: 5px">${Number(parseFloat(incomes.value.sum).toFixed(2)).toLocaleString('ru')} руб.</td>
                  </tr>
                  <tr>
                    <td>Недвижимость должностных лиц:</td>
                    <td style="padding-left: 5px">${Number(parseFloat(real_estates.value.sum).toFixed(2)).toLocaleString('ru')} км.<sup>2</sup></td>
                  </tr>
                  <tr>
                    <td>Транспортные средства должностных лиц (кол):</td>
                    <td style="padding-left: 5px">${Number(parseFloat(vehicles.value.sum).toFixed(2)).toLocaleString('ru')}</td>
                  </tr>
                </table>
              `;
              feature.properties.balloonContentBody = template;
            }
            else console.log(feature.properties.name);

            feature.options = {
              fillColor: '#333',
              strokeColor: '#000',
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
          opacity: id === obj.id ? 0.4 : 0.2,
          strokeColor: id === obj.id ? '#da1f1f' : '#000',
        });
      });

      this.map.setCenter(coords);
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
