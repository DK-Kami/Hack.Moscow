export default {
  state: {
    countries: [
      {
        name: 'Россия',
        code: 'RU',
      },
      {
        name: 'Казахстан',
        code: 'KZ',
      },
      {
        name: 'Украина',
        code: 'UA',
      },
    ],
  },
  getters: {
    getCountries: state => state.countries,
  },
};
