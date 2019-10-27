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
          result.features.forEach(feature => {
            var iso = feature.properties.iso3166;
            feature.id = iso;

            feature.options = {
              fillColor: '#FF4546',
              strokeColor: '#FF4546',
              opacity: 0.2,
              strokeWidth: 2,
            }
          });

          this.objectManager.add(result);
          this.objectManager.objects.events.add('click', this.handleClick);
          this.map.geoObjects.add(this.objectManager)
          // setTimeout(() => {
          //   this.map.setBounds(this.objectManager.getBounds());
          // }, 0);
        });
    },

    handleClick(e) {
      const id = e.get('objectId'),
        coords = e.get('coords'),
        geoObject = this.objectManager.objects.getById(id);

      this.objectManager.objects.each(obj => {
        this.objectManager.objects.setObjectOptions(obj.id, {
          strokeColor: id === obj.id ? '#da1f1f' : '#FF4546',
          opacity: id === obj.id ? 0.4 : 0.2,
        });
      });

      this.map.setCenter(coords, this.map.getZoom(), {
        duration: 1000,
      });
      this.$emit('select-region', geoObject.properties.name);
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
    filter: grayscale(150);
  }
</style>
