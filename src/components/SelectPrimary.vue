<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <div class="primary-select" v-on="on">
        <v-layout align-center>
          <span class="mx-3 primary--text" :class="[titleClass, withBorder ? 'primary-select__content--border' : '']">{{ itemText ? selected[itemText] : selected }}</span>
          <v-flex xs1>
            <v-img style="height:20px; width:25px" contain :src="require('@/assets/arrow.png')" />
          </v-flex>
        </v-layout>
      </div>
    </template>

    <v-list>
      <v-list-item
        v-for="item in items"
        :key="itemValue ? item[itemValue] : item"
        @click="selected = item"
      >
        <div
          class="headline py-4 primary-select__menu-item text-center"
          :class="isSelected(item) ? 'primary--text' : ''"
          align-center
        >{{ itemText ? item[itemText] : item }}</div>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'SelectPrimary',
  props: {
    value: [Object, String, Number, Boolean],
    items: {
      type: Array,
      default: () => [],
    },
    withBorder: Boolean,
    titleClass: String,
    itemValue: String,
    itemText: String,
  },
  computed: {
    selected: {
      get() {
        const value = this.value;
        if (this.itemValue) {
          return this.items.find(i => i[this.itemValue] === value);
        }
        return value;
      },
      set(value) {
        if (this.itemValue) {
          this.$emit('input', value[this.itemValue]);
        }
        else {
          this.$emit('input', value);
        }
      },
    },
  },
  methods: {
    isSelected(item) {
      if (this.itemValue) {
        return this.selected === item[this.itemValue];
      }
      else {
        return this.selected === item;
      }
    }
  }
};
</script>

<style>
  .primary-select__content--border {
    border-bottom: 3px solid #FF4546
  }
  .primary-select,
  .primary-select__menu-item {
    cursor: pointer;
  }
</style>
