<script setup lang="ts">
import { watch } from 'vue'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
const toast = useToast()

import { useThemeControlStore } from './stores/themeControls'
const themeStore = useThemeControlStore()

import { useGeneralDataStore } from './stores/generalData'
const generalData = useGeneralDataStore()

watch(
  () => generalData.alertMessage,
  (new_message) => {
    if (new_message) {
      toast.add(new_message)
      generalData.alertMessage = null
    }
  }
)
</script>

<template>
  <div
    id="container"
    :class="
      themeStore.currentTheme === 'light' ? 'light-theme-customization' : 'dark-theme-customization'
    "
  >
    <Toast />
    <router-view v-slot="{ Component }">
      <transition name="route" mode="out-in" appear>
        <component :is="Component" />
      </transition>
    </router-view>
    <div class="mobile-tablet">
      <h3>
        Вы видите это сообщение, потому что, возможно, открыли его на своем мобильном устройстве или
        планшете. Этот проект доступен на настольных компьютерах и ноутбуках, поэтому используйте их
        для ознакомления с проектом.
      </h3>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../src/assets/breakpoints';

#container {
  color: var(--text-color);
  transition: color 0.25s ease;
  position: relative;
  background-color: var(--bg-color);
  width: 100%;
  min-height: 100vh;
  .mobile-tablet {
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: none;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-color);
    padding: 100px;
    h3 {
      font-size: 24px;
      color: var(--text-color);
      text-align: justify;
    }
    @include media('<=tablet') {
      display: flex;
    }
  }
}
</style>
