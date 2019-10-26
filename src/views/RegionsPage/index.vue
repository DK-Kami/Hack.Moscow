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
      <map-view :country="selectedCountry" />
    </v-flex>

    <v-flex class="sider--left">
      <v-container class="px-10 mt-8">
        <v-layout wrap>
          here
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import SelectPrimary from '@/components/SelectPrimary';
import MapView from './Map';
import axios from 'axios';

export default {
  name: 'RegionsPage',
  components: {
    SelectPrimary,
    MapView,
  },
  data: () => ({
    selectedCountry: 'RU',
  }),
  computed: {
    countries() {
      return this.$store.getters.getCountries;
    },
  },
};
</script>

<style>
  .sider--left {
    height: 100vh;
    overflow-y: scroll;
  }
</style>
