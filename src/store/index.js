import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import modules from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    companies: [],
    regions: [],
  },
  mutations: {
    SET_COMPANIES: (state, companies) => state.companies = companies,
    SET_REGIONS: (state, regions) => state.regions = regions,
  },
  actions: {
    async loadRegions({ commit }) {

      commit('SET_COMPANIES', companies);
      commit('SET_REGIONS', regions);

      return { companies, regions };
    }
  },
  getters: {
    getCompanies: state => state.companies,
    getRegions: state => state.regions,
  },
  modules,
});
