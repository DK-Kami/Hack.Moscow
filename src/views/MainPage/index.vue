<template>
  <v-layout>
    <v-slide-y-transition>
      <v-layout v-if="isMap" style="position: fixed; z-index: 10000" class="mt-8">
        <v-flex>
          <v-layout class="headline" align-end>
            Открыть <span class="primary--text cursor--pointer mx-2" @click="hideMap">статистику</span> по стране
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
    </v-slide-y-transition>
    <map-view :all-loading="allHidden" :country="selectedCountry" />

    <v-fade-transition>
      <v-layout
        v-if="!allHidden"
        fill-height
        column
        dark
        class="pa-12 statistic-layout"
      >
        <v-slide-y-transition>
          <v-flex v-if="!isMap" xs2 class="pa-8 display-1 font-weight-light">
            <v-layout align-end>
              102 чиновника на 10 тыс. человек в стране
              <select-primary
                v-model="selectedCountry"
                :items="countries"
                title-class="display-2"
                item-value="code"
                item-text="name"
                with-border
              />
            </v-layout>
          </v-flex>
        </v-slide-y-transition>

        <v-flex xs6>
          <v-layout fill-height align-center justify-space-around class="mx-8">
            <v-slide-x-transition>
              <v-flex xs5 v-if="!isMap">
                <deputat-grapfic />
              </v-flex>
            </v-slide-x-transition>

            <v-slide-x-reverse-transition>
              <v-flex xs4 v-if="!isMap">
                <deputat-car-grapfic />
              </v-flex>
            </v-slide-x-reverse-transition>
          </v-layout>
        </v-flex>

        <v-flex xs1 />
        <v-flex xs2>
          <v-slide-y-reverse-transition>
            <v-layout justify-center v-if="!isMap">
              <v-btn
                class="map-button"
                outlined
                primary
                light
                @click="openMap"
              >Карта</v-btn>
            </v-layout>
          </v-slide-y-reverse-transition>
        </v-flex>
      </v-layout>
    </v-fade-transition>
  </v-layout>
</template>

<script>
import DeputatCarGrapfic from '@/components/charts/DeputatCarGrapfic';
import DeputatGrapfic from '@/components/charts/DeputatGrapfic';
import SelectPrimary from '@/components/SelectPrimary';
import MapView from './Map';

export default {
  name: 'mainPage',
  components: {
    DeputatCarGrapfic,
    DeputatGrapfic,
    SelectPrimary,
    MapView,
  },
  data: () => ({
    isMap: false,
    allHidden: false,

    selectedCountry: 'RU',
  }),
  computed: {
    year() {
      return new Date().getFullYear();
    },
    countries() {
      return this.$store.getters.getCountries;
    },
  },
  methods: {
    openMap() {
      this.isMap = true;
      setTimeout(() => {
        this.allHidden = true;
      }, 350);
    },
    hideMap() {
      this.allHidden = false;
      setTimeout(() => {
        this.isMap = false;
      }, 150);
    }
  },
};
</script>

<style>
  /* .map > .v-responsive .v-image {
    overflow: visible;
  } */
  .map-button {
    width: 300px;
    height: 60px !important;
    border-radius: 0;
    font-size: 19px !important;
    border: 2px solid #FF4546;
    color: #FF4546 !important;
    box-shadow: 0px 1px 2px #da1f1f66;
  }

  .statistic-layout {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #ffffffd7;
  }
</style>
