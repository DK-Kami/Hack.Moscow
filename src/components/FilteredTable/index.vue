<template>
  <v-layout column>
    <slot name="seacrh" v-if="!withoutSearch" :search="search">
      <v-layout class="mb-3 mt-0">
        <v-flex>
          <slot name="action-header" :search="search" />
        </v-flex>
        <v-flex xl2 lg3 md4 sm6 xs12>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Поиск"
            class="pt-0"
            hide-details
            single-line
          />
        </v-flex>
      </v-layout>
    </slot>

    <v-data-table
      :no-data-text="noDataText"
      :select-all="selectAll"
      :search="currentSearch"
      :items="filteredItems"
      :headers="headers"
      :loading="loading"
      class="custom-elevation-2"
    >
      <v-progress-linear #progress color="blue" indeterminate />

      <template #headers="{ headers }">
        <slot name="headers" :headers="headers">
          <tr>
            <th
              v-for="header in headers"
              :key="header.text"
              :class="['column sortable', pagination.descending ? 'desc' : 'asc',   header.value === pagination.sortBy ? 'active' : '',
                currentAlign(header.align)]"
              @click="changeSort(header.value)"
            >
              <v-icon small>arrow_upward</v-icon>
              {{ header.text }}
              <v-icon v-if="header.icon" small>{{ header.icon }}</v-icon>
            </th>
            <th v-if="withActions">Действия</th>
          </tr>
        </slot>

        <slot name="filter" :headers="headers">
          <tr class="grey lighten-3">
            <th>
              <v-icon>filter_list</v-icon>
            </th>
            <th v-for="header in headers.slice(1)" :key="header.text">
              <div v-if="header.filter">
                <v-autocomplete
                  v-model="filters[header.value]"
                  :items="columnValueList(header.value)"
                  return-object
                  hide-details
                  clearable
                  multiple
                  text
                />
              </div>
            </th>
            <th v-if="withActions" />
          </tr>
        </slot>
      </template>

      <template #items="props">
        <slot :item="props.item" :index="props.index">
          <td v-for="header in headers" :key="header.value">
            <slot :name="`item.${header.value}`" :item="props.item">
              <div :class="currentAlign(header.align)">
                {{ props.item[header.value] }}
              </div>
            </slot>
          </td>
        </slot>

        <v-layout :class="currentActionAlign(alignAction)">
          <slot
            v-if="withActions"
            :item="props.item"
            :index="props.index"
            name="actions"
          />
        </v-layout>
      </template>

      <template #footer>
        <slot name="footer" />
      </template>
    </v-data-table>
  </v-layout>
</template>

<script>
export default {
  name: 'FilteredTable',
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
    pagination: {
      type: Object,
      default: () => ({
        sortBy: 'name',
      })
    },
    withoutSearch: {
      type: Boolean,
      default: false,
    },
    search: { type: String },
    loading: { type: Boolean },
    selectAll: { type: Boolean },
    rowsPerPage: { type: Array },
    noDataText: { type: String },
    alignAction: { type: String },
    withActions: { type: Boolean },
  },
  created() {
    this.setFilters()
  },
  data: () => ({
    _search: '',
    filters: {},
  }),
  computed: {
    selectedItems: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
    paginationSync: {
      get() {
        return this.pagination;
      },
      set(newVal) {
        this.$emit('update:pagination', newVal);
      },
    },

    currentSearch: {
      get() {
        return this.withoutSearch ? this.search : this._search;
      },
      set(seacrh) {
        if (!this.withoutSearch) {
          this._search = search;
        }
      },
    },

    filteredItems() {
      return this.items.filter(
        d => Object
          .keys(this.filters)
          .every(
            k => !this.filters[k].length
               || this.filters[k].includes(d[k]))
      );
    },
  },
  methods: {
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    columnValueList(val) {
      return this.items
        .map(d => d[val])
        .filter(s => !!s)
        .sort(this.descingSort);
    },

    descingSort(prev, next) {
      if (Number.isSafeInteger(prev) && Number.isSafeInteger(next)) {
        return Number(prev) > Number(next) ? 1 : -1;
      }
      return prev > next ? 1 : -1;
    },

    currentAlign(align) {
      if (!align) return;
      return `text-xs-${align}`;
    },
    currentActionAlign(align) {
      if (!align) return;
      if (align === 'between' || align === 'around') {
        return `justify-space-${align}`;
      }
      return `justify-${align}`;
    },

    setFilters() {
      this.headers.forEach(header => {
        if (!header.filter) return;
        this.$set(this.filters, header.value, []);
      });
    },
  },
  watch: {
    headers() {
      this.setFilters();
    },
  },
};
</script>
