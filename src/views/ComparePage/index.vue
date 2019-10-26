<template>
  <v-layout justify-center class="mt-10 pt-12" wrap>
    <v-flex xs11 class="display-1 font-weight-light text-center">
      Как менялись численность, фонд оплаты труда и средняя зарплата госслужащих всех уровней
    </v-flex>

    <v-flex xs12>
      <v-layout align-center justify-space-around>
        <v-flex xs5>
          <v-img :src="require('@/assets/compare-grafic.png')" contain  />
        </v-flex>
        <v-flex xs6>
          <v-img :src="require('@/assets/compare-money.png')" contain  />
        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex shrink>
      Источник: расчёты РБК на основе данных Росстата и Федерального казначейства
    </v-flex>
  </v-layout>
</template>
