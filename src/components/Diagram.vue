<template>
  <v-layout class="diagram" align-center>
    <v-progress-circular
      :value="value"
      :rotate="270"
      :size="250"
      :width="20"
      color="black"
      class="diagram__svg"
    >
      <div class="diagram__value display-3">
        {{ value }}<span>%</span>
      </div>
    </v-progress-circular>

    <div class="diagram__title display-1 font-weight-light ml-n8">Доля доходов в бюджете</div>
  </v-layout>
</template>

<script>
export default {
  name: 'Diagram',
  props: {
    value: [Number, String],
  },
  mounted() {
    const underlay = document.querySelector('.v-progress-circular__underlay');
    underlay.setAttribute('stroke-width', 0.5);
    underlay.setAttribute('r', 21.5);
    underlay.setAttribute('stroke-dasharray', 150);

    const overlay = document.querySelector('.v-progress-circular__overlay');
  }
};
</script>

<style>
   /* {
    box-shadow: 0px 4px 10px rgba(118, 189, 211, 0.6) !important;
  } */
  .v-progress-circular__overlay {
    -webkit-filter: drop-shadow(0px 4px 10px rgba(118, 189, 211, 0.6));
    filter: drop-shadow(0px 4px 10px rgba(118, 189, 211, 0.6));
    /* Similar syntax to box-shadow */
  }
  .diagram__value {
    font-style: normal;
    transform: scale(-1, 1);
  }

  .diagram__svg {
    transform: scale(-1, 1);
  }
</style>
