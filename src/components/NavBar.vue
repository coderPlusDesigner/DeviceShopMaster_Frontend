<template>
  <nav :class="{ open: generalData.openMenu }">
    <div class="top">
      <div>
        <div class="menu-button" @click="generalData.toggleMenu">
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </div>
        <span>Панель приборов</span>
      </div>
    </div>
    <div id="menu">
      <div class="menu" :class="{ active: shopActive, open: shopOpen }">
        <div class="title" @click="shopOpen = !shopOpen">
          <router-link :to="{ name: 'Shop' }" data-title="Магазин">
            <img src="/src/assets/icons/shop.svg" class="icon" alt="shop" />
            <span>Магазин</span>
          </router-link>
          <img src="/src/assets/icons/arrow.svg" alt="arrow" class="icon" />
        </div>
        <ul>
          <router-link :to="{ name: 'Products' }" data-title="Продукты">
            <li>Продукты</li>
          </router-link>
          <router-link :to="{ name: 'Orders' }" data-title="Заказы">
            <li>Заказы</li>
          </router-link>
          <router-link :to="{ name: 'Customers' }" data-title="Клиенты">
            <li>Клиенты</li>
          </router-link>
          <router-link :to="{ name: 'Reviews' }" data-title="Отзывы">
            <li>Отзывы</li>
          </router-link>
        </ul>
      </div>
      <router-link class="menu" :to="{ name: 'Stats' }">
        <img src="/src/assets/icons/stats.svg" class="icon" alt="stats" />
        <span>Статистика</span>
      </router-link>
      <router-link class="menu" :to="{ name: 'Users' }">
        <img src="/src/assets/icons/users.svg" class="icon" alt="users" />
        <span>Пользователи</span>
      </router-link>
      <router-link class="menu" :to="{ name: 'Notifications' }">
        <img src="/src/assets/icons/bell.svg" class="icon" alt="notifications" />
        <span>Уведомления</span>
      </router-link>
      <router-link class="menu" :to="{ name: 'Chat' }">
        <img src="/src/assets/icons/chat.svg" class="icon" alt="chat" />
        <span>Чат</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useGeneralDataStore } from '@/stores/generalData'
const generalData = useGeneralDataStore()
import { watch, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const shopActive = ref(false)
const shopOpen = ref(false)
watch(route, (newRoute) => {
  if (newRoute.matched[newRoute.matched.length - 2].name === 'Shop') {
    shopActive.value = true
    shopOpen.value = true
  } else {
    shopActive.value = false
    shopOpen.value = false
  }
})
onMounted(() => {
  if (route.matched[route.matched.length - 2].name === 'Shop') {
    shopActive.value = true
    shopOpen.value = true
  } else {
    shopActive.value = false
    shopOpen.value = false
  }
})
</script>

<style scoped lang="scss">
nav {
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  width: 54px;
  transition: var(--transition);
  border-right: 1px solid var(--line);
  background-color: var(--bg-color-2);
  display: flex;
  flex-direction: column;
  .top {
    display: flex;
    width: 280px;
    flex-direction: column;
    padding: 6px 16px;
    height: 60px;
    justify-content: center;
    & > div {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      column-gap: 20px;
    }
    .menu-button {
      cursor: pointer;
      width: 24px;
      height: 24px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      row-gap: 3px;
      .bar {
        width: 100%;
        height: 2px;
        border-radius: 4px;
        background-color: var(--text-color);
        transition: var(--transition);
      }
    }
    span {
      font-size: 14px;
    }
  }
  #menu {
    display: flex;
    flex-direction: column;
    .menu {
      display: flex;
      align-items: center;
      overflow: hidden;
      height: 48px;
      padding: 6px 16px;
      column-gap: 20px;
      transition: var(--transition);
      position: relative;
      img {
        height: 18px;
      }
      span {
        color: var(--text-color);
        font-size: 14px;
        font-weight: 600;
      }
      &:first-child {
        flex-direction: column;
        padding: 0;
        column-gap: 0;
      }
      .title {
        cursor: pointer;
        width: 100%;
        height: 48px;
        padding: 6px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        & > img {
          height: 12px;
          transform: rotate(90deg);
          transition: var(--transition);
        }
        a {
          display: flex;
          align-items: center;
          height: 48px;
          column-gap: 20px;
          img {
            height: 18px;
          }
          span {
            color: var(--text-color);
            font-size: 14px;
            font-weight: 600;
          }
        }
      }
      ul {
        margin: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        a {
          opacity: 0.7;
          transition: var(--transition);
          transition-duration: 0.125s;
          li {
            padding-left: 16px;
            height: 42px;
            font-size: 14px;
            display: flex;
            align-items: center;
            position: relative;
            color: var(--text-color);
            &::before {
              content: '';
              position: absolute;
              left: -18px;
              top: 50%;
              transform: translateY(-50%);
              width: 8px;
              height: 8px;
              border: 2px solid var(--text-color);
              border-radius: 1000px;
              transition: var(--transition);
              transition-duration: 0.125s;
            }
          }
          &.router-link-exact-active,
          &:hover {
            li {
              &::before {
                background-color: var(--text-color);
              }
            }
            opacity: 1;
          }
        }
      }
      &:hover,
      &.router-link-exact-active,
      &.active {
        background-color: var(--bg-color);
      }
      &.open {
        height: 216px;
        .title {
          & > img {
            transform: rotate(270deg);
          }
        }
      }
    }
  }

  &.open {
    width: 280px;
    .top {
      .menu-button {
        .bar:nth-child(2) {
          width: 80%;
        }
        .bar:nth-child(3) {
          width: 60%;
        }
      }
    }
  }
}
</style>
