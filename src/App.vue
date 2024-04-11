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
  </div>
</template>

<style lang="scss" scoped>
#container {
  color: var(--text-color);
  transition: color 0.25s ease;
  position: relative;
  background-color: var(--bg-color);
  width: 100%;
  min-height: 100vh;
}
</style>
