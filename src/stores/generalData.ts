import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useRouter } from 'vue-router'
import type { ToastMessageOptions } from 'primevue/toast'

export const useGeneralDataStore = defineStore('generalData', () => {
  const baseURL = 'https://deviceshopmaster-api.ecomputics.uz'

  const router = useRouter()

  const language = ref('ru')
  const isAuthenticated = ref<boolean>(false)

  const user = ref()

  const AUTH_TOKEN = ref<string>('')

  const openMenu = ref<boolean>(false)

  const alertMessage = ref<null | ToastMessageOptions>(null)

  if (localStorage.getItem('AUTH_TOKEN')) {
    AUTH_TOKEN.value = localStorage.getItem('AUTH_TOKEN')
    isAuthenticated.value = true
  }

  if (localStorage.getItem('user')) {
    user.value = JSON.parse(localStorage.getItem('user'))
  }

  if (localStorage.getItem('openmenu')) {
    openMenu.value = Boolean(localStorage.getItem('openmenu'))
  } else {
    openMenu.value = true
    localStorage.setItem('openmenu', openMenu.value.toString())
  }

  function toggleMenu() {
    openMenu.value = !openMenu.value
    localStorage.setItem('openmenu', openMenu.value.toString())
  }

  function setAuthToken(token: string) {
    AUTH_TOKEN.value = `Token ${token}`
    localStorage.setItem('AUTH_TOKEN', `Token ${token}`)
    isAuthenticated.value = true
    axios.defaults.headers.common['Authorization'] = `Token ${token}`
  }

  async function fullLogoutAction() {
    AUTH_TOKEN.value = ''
    user.value = null
    localStorage.removeItem('user')
    isAuthenticated.value = false
    axios.defaults.headers.common['Authorization'] = ''
    localStorage.removeItem('AUTH_TOKEN')
    router.push('/login')
    alertMessage.value = {
      severity: 'success',
      summary: 'Успех',
      detail: 'Вы успешно вышли из своей учетной записи!',
      life: 3000
    }
  }

  return {
    language,
    isAuthenticated,
    AUTH_TOKEN,
    setAuthToken,
    fullLogoutAction,
    alertMessage,
    baseURL,
    openMenu,
    toggleMenu,
    user
  }
})
