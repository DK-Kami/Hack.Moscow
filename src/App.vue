<template>
  <div id="app">
    <v-app>
      <notification />
      <the-toolbar-app />

      <v-content>
        <v-container class="pa-0 pt-9 fill-height" fluid>
          <!-- <scroll-button class="scroll-button" /> -->
          <router-view />
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import TheToolbarApp from '@/components/layout/TheToolbarApp';
import ScrollButton from '@/components/layout/ScrollButton';
import Notification from '@/components/Notification';

export default {
  name: 'App',
  components: {
    TheToolbarApp,
    ScrollButton,
    Notification,
  },
};
</script>

<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #2c3e50
  overflow hidden

.main-container
  display flex

.cursor--pointer
  cursor pointer

.primary-shadow
  box-shadow 0px 4px 8px rgba(134, 220, 248, 0.6)
</style>
