import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    name: 'MainPage',
    path: '/',
    component: () => import('@/views/MainPage'),
  },
  {
    name: 'RegionsPage',
    path: '/regions',
    component: () => import('@/views/RegionsPage'),
  },
  {
    name: 'ComparePage',
    path: '/compare',
    component: () => import('@/views/ComparePage'),
  },
  {
    name: 'DeputatPage',
    path: '/deputats',
    component: () => import('@/views/DeputatPage'),
  },
  {
    path: '/*',
    redirect: '/',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
