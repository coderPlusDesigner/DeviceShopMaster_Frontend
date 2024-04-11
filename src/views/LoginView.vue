<template>
  <div id="login-view">
    <div class="content">
      <h1>Авторизоваться:</h1>
      <form @submit.prevent>
        <div>
          <label for="password">Имя пользователя:</label>
          <InputText type="text" id="username" v-model="username" />
        </div>
        <div>
          <label for="password">Пароль:</label>
          <Password id="password" v-model="password" toggleMask :feedback="false" />
        </div>
        <span>
          <Button label="Отравить" @click="adminLogin" :loading="loading">
            <span>Отравить</span>
          </Button>
        </span>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useGeneralDataStore } from '@/stores/generalData'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
const generalData = useGeneralDataStore()
const router = useRouter()

const username = ref<string>('')
const password = ref<string>('')

onMounted(() => {
  document.title = 'Авторизоваться | DeviceShopMaster'
})

const errors = ref<string[]>([])
const loading = ref(false)

async function adminLogin() {
  errors.value = []
  if (!username.value.length) {
    errors.value.push('Вам необходимо заполнить поле имени пользователя!')
  }
  if (!password.value.length) {
    errors.value.push('Вам необходимо заполнить поле пароля!')
  } else if (password.value.length < 8) {
    errors.value.push('Пароли всегда длиннее 8 символов!')
  }
  if (!errors.value.length) {
    loading.value = await true
    await axios
      .post('/auth/token/login/', {
        username: username.value,
        password: password.value
      })
      .then(async (res) => {
        await generalData.setAuthToken(res.data.auth_token)
        axios.defaults.headers.common['Authorization'] = await `Token ${res.data.auth_token}`
        await axios.get('/auth/users/me').then((innerRes) => {
          generalData.user = innerRes.data
          localStorage.setItem('user', JSON.stringify(innerRes.data))
          generalData.alertMessage = {
            severity: 'success',
            summary: 'Успех',
            detail: 'Вы успешно вошли в свою учетную запись!',
            life: 3000
          }
          router.push('/')
        })
      })
      .catch((err) => {
        generalData.alertMessage = {
          severity: 'error',
          summary: 'Ошибка сервера',
          detail: 'Ваше имя пользователя или пароль неверны. ' + err.message,
          life: 3000
        }
      })
    loading.value = false
  } else {
    for (let i = 0; i < errors.value.length; i++) {
      generalData.alertMessage = await {
        severity: 'error',
        summary: 'Ошибка',
        detail: errors.value[i],
        life: 3000
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#login-view {
  h1 {
    font-size: 24px;
    margin-bottom: 24px;
  }
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    width: 360px;
    min-height: 560px;
    form {
      display: flex;
      flex-direction: column;
      row-gap: 20px;
      & > div {
        display: flex;
        flex-direction: column;
        row-gap: 8px;
      }
      button {
        margin-top: 16px;
      }
    }
  }
}
</style>
