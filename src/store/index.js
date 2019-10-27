import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import modules from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    rowsPerPage: {
      cards: [6, 12, 24, 48, { text: "$vuetify.dataIterator.rowsPerPageAll", value: -1 }],
      tables: [10, 25, 50, 100, { text: "$vuetify.dataIterator.rowsPerPageAll", value: -1 }],
    },
  },
  mutations: {
  },
  actions: {
  },
  getters: {
    getRowsPerPage: state => state.rowsPerPage,
  },
  modules,
});
