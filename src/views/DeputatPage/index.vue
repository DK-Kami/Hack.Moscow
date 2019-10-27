<template>
  <v-layout class="mt-10" justify-center>
    <v-flex xs8>
      <filtered-table
        :pagination.sync="pagination"
        :rows-per-page="rowsPerPage"
        :headers="currentHeaders"
        :loading="loading"
        :items="persons"
      >
        <template #footer>
          <td :colspan="currentHeaders.length + 1" class="px-0 mx-0">
            <footer-table :headers.sync="headers" />
          </td>
        </template>
      </filtered-table>
    </v-flex>
  </v-layout>
</template>

<script>
import FilteredTable from '@/components/FilteredTable';
import FooterTable from '@/components/FooterTable';

const headers = [
  { text: 'ФИО', value: 'fullName', isSelected: true },
  { text: 'Последняя должность', value: 'role', isSelected: true },
  { text: 'Пол', value: 'gender', isSelected: true },
  { text: 'Дата рождения', value: 'birthday', isSelected: true },
];

export default {
  name: 'DeputatPage',
  components: {
    FilteredTable,
    FooterTable,
  },
  created() {
    this.loadPersons();
  },
  data: vm => ({
    rowsPerPage: vm.$store.getters.getRowsPerPage.tables,
    pagination: {
      sortBy: 'name',
    },

    loading: false,
    headers,
  }),
  computed: {
    currentHeaders() {
      return this.headers.filter(h => h.isSelected);
    },

    persons() {
      return this.$store.getters.getPersons;
    },
  },
  methods: {
    loadPersons() {
      this.loading = true;
      this.$store.dispatch('loadPersons');
      this.loading = false;
    },
  },
};
</script>