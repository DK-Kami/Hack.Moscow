<template>
  
</template>

<script>
import SelectPrimary from '@/components/SelectPrimary';



export default {
  name: 'CountrySelect',
  data: () => ({
    selected: 'RU',
    countries,
  }),
  computed: {
    selectedCountry() {
      return this.countries.find(c => c.code === this.selected);
    },
  },
  methods: {
    selectCountry(country) {
      this.selected = country.code;
      this.$emit('select', country);
    }
  }
};
</script>

<style>
  
  .v-menu__content,
  .country-select__menu {
    /* background: transparent !important; */
    /* box-shadow: none !important; */
  }
</style>
