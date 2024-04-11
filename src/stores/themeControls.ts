import { ref, watch, onMounted } from 'vue'
import { defineStore } from 'pinia'
import { usePrimeVue } from 'primevue/config'

export const useThemeControlStore = defineStore('themeControl', () => {
  //   Theme toggle:
  const PrimeVue = usePrimeVue()
  if (!localStorage.getItem('currentTheme')) {
    localStorage.setItem('currentTheme', 'dark')
  }
  const currentTheme = ref<string | null>(localStorage.getItem('currentTheme'))

  watch(currentTheme, (value) => {
    if (value === 'light') {
      PrimeVue.changeTheme('lara-dark-blue', 'lara-light-blue', 'theme-link', () => {})
    } else {
      PrimeVue.changeTheme('lara-light-blue', 'lara-dark-blue', 'theme-link', () => {})
    }
  })

  function toggleTheme(): void {
    if (currentTheme.value === 'light') {
      currentTheme.value = 'dark'
      localStorage.setItem('currentTheme', 'dark')
    } else {
      currentTheme.value = 'light'
      localStorage.setItem('currentTheme', 'light')
    }
  }

  onMounted(() => {
    if (currentTheme.value === 'light') {
      PrimeVue.changeTheme('lara-dark-blue', 'lara-light-blue', 'theme-link', () => {})
    } else {
      PrimeVue.changeTheme('lara-light-blue', 'lara-dark-blue', 'theme-link', () => {})
    }
  })

  return {
    currentTheme,
    toggleTheme
  }
})
