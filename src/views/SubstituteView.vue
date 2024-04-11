<template>
  <div id="substitute">
    <h3>
      Страница
      <q>{{ $route.matched[$route.matched.length - 1].meta.title }}</q>
      еще не готова.
    </h3>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

onMounted(() => {
  document.title = route.matched[route.matched.length - 1].meta.title + ' | DeviceShopMaster'
})

watch(route, (newRoute) => {
  document.title = newRoute.matched[newRoute.matched.length - 1].meta.title + ' | DeviceShopMaster'
})
</script>

<style scoped lang="scss">
#substitute {
  padding: 32px 0;
  h3 {
    margin: 0;
  }
}
</style>
