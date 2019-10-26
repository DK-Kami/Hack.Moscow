<template>
  <v-toolbar class="toolbar app fixed" light>
    <div class="headline primary--text">
      Civilian_Money
    </div>
    <v-spacer />
    <v-toolbar-items>
      <v-btn depressed class="mx-3" to="/">Общее</v-btn>
      <v-btn depressed class="mx-3" to="/regions">Регионы</v-btn>
      <v-btn depressed class="mx-3" to="/deputats">Депутаты</v-btn>
      <v-btn depressed class="mx-3" to="/compare">Сравнение</v-btn>
      <!-- <v-btn depressed class="mx-3" to="/n-tab">N-вкладка</v-btn> -->
    </v-toolbar-items>
  </v-toolbar>
</template>

<style>
  .toolbar {
    max-height: 64px;
    width: 100%;
    position: fixed;
    z-index: 1000;
  }
  .toolbar,
  .toolbar .v-btn {
    background-color: #fff !important;
  }
  .toolbar .v-btn--active {
    color: #FF4546 !important
  }
  .toolbar .v-toolbar__content {
    padding-right: 0 !important;
  }
  .toolbar .v-btn--active:before {
    background-color: inherit !important;
    opacity: 1 !important;
  }
</style>
