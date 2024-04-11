<template>
  <div id="page-not-found">
    <div class="content">
      <h1>Ошибка 404</h1>
      <h2>Страница не найдена!</h2>
      <div class="buttons">
        <Button @click="$router.go(-1)">
          <span>Возвращаться</span>
        </Button>
        <Button @click="$router.push({ name: 'Products' })">
          <span>Товары</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  document.title = '404 | DeviceShopMaster'
})
</script>

<style lang="scss" scoped>
#page-not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  .content {
    width: 460px;
    * {
      text-align: center;
    }
    .buttons {
      margin-top: 32px;
      width: 100%;
      display: flex;
      justify-content: center;
      column-gap: 16px;
    }
  }
}
</style>
