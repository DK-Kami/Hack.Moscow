<template>
  <v-layout align-center justify-start>
    <v-flex shrink>
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        close-on-click
        offset-y
      >
        <template #activator="{ on }">
          <v-btn
            class="text-lowercase"
            color="secondary lighten-2"
            text
            v-on="on"
          >
            <v-icon class="mr-3">tune</v-icon>
            Выбрать колонки
          </v-btn>
        </template>

        <v-list>
          <v-list-tile
            v-ripple
            @click="toggleAll"
          >
            <v-list-tile-action>
              <v-icon color="primary" class="mr-3">
                {{ selectAllIcon }}
              </v-icon>
            </v-list-tile-action>

            <v-list-tile-title>Выбрать все</v-list-tile-title>
          </v-list-tile>

          <template v-for="header in headers">
            <v-list-tile
              v-if="header.text"
              :key="header.value"
              v-ripple
              @click="toggleHeader(header)"
            >
              <v-list-tile-action>
                <v-icon color="primary" class="mr-3">
                  {{ currentIcon(header.isSelected) }}
                </v-icon>
              </v-list-tile-action>

              <v-list-tile-title>{{ header.text }}</v-list-tile-title>
            </v-list-tile>
          </template>
        </v-list>
      </v-menu>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'FooterTable',
  props: {
    headers: { type: Array },
  },
  data: () => ({
    menu: false,
  }),
  computed: {
    headersComp: {
      get() {
        return this.$store.getters['settings/getConfigure'][this.name] || this.headers;
      },
      set(headers) {
        this.saveInSettings();
        this.$emit('update:headers', headers);
      },
    },

    name() {
      return this.$route.name;
    },

    isSelectAll() {
      return this.headers.every(h => h.isSelected);
    },
    isUnSelectAll() {
      return this.headers.every(h => !h.isSelected);
    },

    selectAllIcon() {
      if (this.isSelectAll) return 'check_box';
      if (this.isUnSelectAll) return 'check_box_outline_blank'
      return 'indeterminate_check_box';
    }
  },
  methods: {
    currentIcon(isSelected) {
      return isSelected
        ? 'check_box'
        : 'check_box_outline_blank';
    },

    async saveInSettings() {
      this.$store.dispatch('settings/saveConfigure', {
        value: this.headers,
        name: this.name,
      })
    },

    toggleHeader(header) {
      header.isSelected = !header.isSelected;
      this.saveInSettings();
    },
    toggleAll() {
      const isSelectAll = this.isSelectAll;
      this.headersComp = this.headersComp.map(h => {
        h.isSelected = !isSelectAll;
        return h;
      });
      this.saveInSettings();
    }
  },
};
</script>
