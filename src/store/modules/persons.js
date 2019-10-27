import services from "@/middleware";
const { PersonService } = services;

export default {
  state: {
    persons: [],
  },
  mutations: {
    'SET_PERSONS': (state, persons) => state.persons = persons,
  },
  actions: {
    async loadPersons({ commit }) {
      const persons = await PersonService.loadPersons();
      commit('SET_PERSONS', persons);
    },
  },
  getters: {
    getPersons: state => state.persons,
  },
};
