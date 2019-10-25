const module = {
  state: {
    show: false,
    message: '',
    type: '',
  },
  mutations: {
    SET(state, { type, message }) {
      state.type = type;
      state.message = message;
    },
    CHANGE_SHOW: (state, show) => state.show = show,
  },
  actions: {
    set({ commit }, notification) {
      commit('SET', notification);
      commit('CHANGE_SHOW', true);
    },
  },
  namespaced: true,
};

export default module;
