<template>
  <div id="admin-panel">
    <NavBar />
    <div class="data">
      <HeaderSection />
      <main>
        <div class="top">
          <Breadcrumb :model="items">
            <template #item="{ item, props }">
              <router-link
                v-if="item.route.length"
                v-slot="{ href, navigate }"
                :to="item.route"
                custom
              >
                <a :href="href" v-bind="props.action" @click="navigate">
                  <span class="text-primary font-semibold">{{ item.label }}</span>
                </a>
              </router-link>
              <router-link to="/" v-else-if="item.label == 'Дом'">
                <img
                  src="/src/assets/icons/home.svg"
                  class="icon"
                  style="height: 18px; transform: translateY(-1px)"
                />
              </router-link>
              <span v-else class="current">{{ item.label }}</span>
            </template>
          </Breadcrumb>
          <div
            class="print"
            @click="
              generalData.alertMessage = {
                severity: 'info',
                summary: `Пока недоступно`,
                detail: 'Эта функция будет доступна позже.',
                life: 4000
              }
            "
          >
            <img src="/src/assets/icons/print.svg" alt="print" class="icon" />
          </div>
        </div>
        <router-view v-slot="{ Component }">
          <transition name="route" mode="out-in" appear>
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
import { useGeneralDataStore } from '@/stores/generalData'
const generalData = useGeneralDataStore()

const items = ref<{ label: string; route: string }[]>([])

onMounted(() => {
  updateBreadcrumb()
})

watch(route, () => {
  updateBreadcrumb()
})

function updateBreadcrumb() {
  items.value = route.matched.map((eachRoute) => {
    return {
      label: eachRoute.meta.title,
      route: eachRoute.path
    }
  })
  items.value[items.value.length - 1].route = ''
}
</script>

<style lang="scss" scoped>
#admin-panel {
  min-height: 100vh;
  width: 100%;
  display: flex;
  .data {
    width: 100%;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 60px calc(100vh - 60px);
    main {
      overflow-y: auto;
      padding: 32px 24px;
      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        column-gap: 40px;
        .print {
          width: 32px;
          height: 32px;
          border-radius: 1000px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-color-2);
          cursor: pointer;
          img {
            height: 12px;
          }
        }
      }
    }
  }
}
</style>
