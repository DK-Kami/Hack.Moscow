<template>
  <div class="scroll-button">
    <v-layout class="scroll-button__content">
      <v-flex>
        <div class="scroll-button__text title font-weight-light">Скролл для продолжения</div>
        <div class="scroll-button__divider" />
      </v-flex>

      <v-flex shrink>
        <div class="scroll-button__block">
          <svg width="47" height="38" viewBox="0 0 47 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d)">
              <rect x="8" y="4" width="31" height="22" fill="black"/>
            </g>

            <line x1="15.0607" y1="12" x2="23.5131" y2="20.4525" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="0.75" y1="-0.75" x2="12.7036" y2="-0.75" transform="matrix(-0.707107 0.707107 0.707107 0.707107 33.2568 12.2434)" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="15.0607" y1="3" x2="23.5131" y2="11.4525" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="0.75" y1="-0.75" x2="12.7036" y2="-0.75" transform="matrix(-0.707107 0.707107 0.707107 0.707107 33.2568 3.24341)" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            <defs>
              <filter id="filter0_d" x="0" y="0" width="47" height="38" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                <feOffset dy="4"/>
                <feGaussianBlur stdDeviation="4"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.525868 0 0 0 0 0.864042 0 0 0 0 0.970833 0 0 0 0.6 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
              </filter>
            </defs>
          </svg>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<style>
  .scroll-button__divider {
    border-bottom: 2px solid black;
    margin-left: 30px;
    margin-top: -5px;
  }
  .scroll-button {
    position: absolute;
    right: 50px;
    height: 20px !important;
    bottom: 35px;
    z-index: 1000;
  }

  .scroll-button__block {
    margin-top: 5px;
  }

</style>
