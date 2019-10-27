import personDAL from "../DAL/person";

export default {
  async loadPersons() {
    const persons = (await this.apiClient.get('persons')).data.results;
    return persons.map(p => personDAL(p));
  },
};
