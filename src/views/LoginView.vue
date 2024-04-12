<template>
  <div id="login-view">
    <div class="content">
      <h1>Авторизоваться:</h1>
      <form @submit="onSubmit">
        <div>
          <label for="username">Имя пользователя:</label>
          <InputText
            type="text"
            id="username"
            v-model="username"
            aria-describedby="username-help"
            :class="{ 'p-invalid': errors.username }"
          />
          <small id="username-help" class="p-error">
            {{ errors.username }}
          </small>
        </div>
        <div>
          <label for="password">Пароль:</label>
          <Password
            id="password"
            v-model="password"
            toggleMask
            :feedback="false"
            aria-describedby="password-help"
            :class="{ 'p-invalid': errors.password }"
            @keyup.enter="onSubmit"
          />
          <small id="password-help" class="p-error">
            {{ errors.password }}
          </small>
        </div>
        <span>
          <Button label="Отравить" type="submit" :loading="loading" />
        </span>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import axios from 'axios'
import { ref } from 'vue'
import { useGeneralDataStore } from '@/stores/generalData'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
const generalData = useGeneralDataStore()
const router = useRouter()

const loading = ref(false)

onMounted(() => {
  document.title = 'Авторизоваться | DeviceShopMaster'
})

yup.setLocale({
  mixed: {
    required: 'Пожалуйста, заполните это поле'
  },
  string: {
    min: 'Минимальная длина пароля должна быть не менее 8 символов'
  }
})

const schema = yup.object().shape({
  username: yup.string().required().label('Имя пользователя'),
  password: yup.string().required().min(8).label('Пароль')
})

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: schema
})

const [username] = defineField('username')
const [password] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  loading.value = await true
  await axios
    .post('/auth/token/login/', {
      username: values.username,
      password: values.password
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
})
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
