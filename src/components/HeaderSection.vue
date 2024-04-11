<template>
  <header>
    <router-link to="/" class="logo">
      <img src="/src/assets/logo.svg" alt="logo" />
      <span>DeviceShopMaster</span>
    </router-link>
    <div class="controls">
      <div>
        <div class="langs" @click="toggleLang = !toggleLang" :class="{ active: toggleLang }">
          <div class="mark">
            <img src="/src/assets/icons/world.svg" alt="world" class="icon" />
            <img src="/src/assets/icons/down.svg" alt="world" class="icon" />
          </div>
          <div class="values">
            <span
              @click.self="
                generalData.alertMessage = {
                  severity: 'info',
                  summary: `Пока недоступно`,
                  detail: 'Этот язык будет добавлен позже.',
                  life: 4000
                }
              "
              >англ</span
            >
            <span class="active">рус</span>
            <span
              @click.self="
                generalData.alertMessage = {
                  severity: 'info',
                  summary: `Пока недоступно`,
                  detail: 'Этот язык будет добавлен позже.',
                  life: 4000
                }
              "
              >узб</span
            >
          </div>
        </div>
        <div
          class="day-night"
          @click="themeControls.toggleTheme"
          :class="{ light: themeControls.currentTheme === 'light' }"
        >
          <div class="block">
            <div class="mode">
              <img src="/src/assets/icons/dark_mode.svg" alt="dark-mode" class="icon" />
            </div>
            <div class="mode">
              <img src="/src/assets/icons/light_mode.svg" alt="light-mode" class="icon" />
            </div>
          </div>
        </div>
      </div>
      <div class="v-devider"></div>
      <div>
        <router-link class="r-links" :to="{ name: 'Chat' }" alt="Чат">
          <img src="/src/assets/icons/chat.svg" alt="chat" class="icon" />
        </router-link>
        <router-link
          class="r-links"
          :to="{ name: 'Notifications' }"
          alt="Уведомления"
          :class="{ active: true }"
        >
          <img src="/src/assets/icons/bell.svg" alt="notifications" class="icon" />
        </router-link>
      </div>
      <div class="v-devider"></div>
      <div>
        <div
          class="user"
          @click="toggleAccount = !toggleAccount"
          :class="{ active: toggleAccount }"
        >
          <div class="avatar">
            <img src="/src/assets/icons/user.svg" alt="user" class="icon" />
          </div>
          <span>{{ generalData.user.username }}</span>
          <img src="/src/assets/icons/down.svg" alt="down" class="icon" />
          <div class="values">
            <span
              @click="
                generalData.alertMessage = {
                  severity: 'info',
                  summary: `Пока недоступно`,
                  detail: 'Эта страница будет добавлена позже.',
                  life: 4000
                }
              "
              >Личный кабинет</span
            >
            <span @click="generalData.fullLogoutAction">Выйти</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useThemeControlStore } from '../stores/themeControls'
const themeControls = useThemeControlStore()
import { useGeneralDataStore } from '@/stores/generalData'
const generalData = useGeneralDataStore()
const toggleLang = ref(false)
const toggleAccount = ref(false)
</script>

<style scoped lang="scss">
header {
  z-index: 990;
  padding: 8px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 60px;
  border-bottom: 1px solid var(--line);
  background-color: var(--bg-color-2);
  .logo {
    display: flex;
    column-gap: 12px;
    align-items: center;
    img {
      height: 20px;
    }
    span {
      font-size: 18px;
      font-weight: 600;
    }
  }
  .controls {
    display: flex;
    column-gap: 14px;
    align-items: center;
    .v-devider {
      height: 24px;
      width: 1px;
      background-color: var(--line);
    }
    & > div {
      display: flex;
      align-items: center;
      column-gap: 12px;
      .day-night {
        height: 32px;
        width: 32px;
        border: 1px solid var(--line);
        border-radius: 1000px;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        .block {
          display: flex;
          justify-content: center;
          flex-direction: column;
          position: relative;
          top: 0;
          left: 0;
          width: 100%;
          height: 200%;
          transition: var(--transition);
          .mode {
            width: 100%;
            height: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              height: 20px;
            }
          }
        }
        &.light {
          .block {
            top: -100%;
          }
        }
      }
      .langs {
        cursor: pointer;
        position: relative;
        z-index: 0;
        .mark {
          padding: 4px;
          border: 1px solid var(--line);
          background-color: var(--bg-color-2);
          border-radius: 4px;
          display: flex;
          align-items: center;
          column-gap: 2px;
          img {
            &:first-child {
              height: 22px;
            }
            &:last-child {
              height: 16px;
              transition: var(--transition);
              transition-duration: 0.125s;
            }
          }
        }
        .values {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 4px;
          row-gap: 4px;
          width: 100%;
          top: 10px;
          opacity: 0;
          z-index: -1;
          transition: var(--transition);
          transition-duration: 0.125s;
          span {
            border-radius: 4px;
            width: 90%;
            background-color: var(--bg-color);
            padding: 2px;
            border: 1px solid var(--line);
            font-size: 12px;
            font-weight: 600;
            text-align: center;
            &.active,
            &:hover {
              background-color: var(--primary-color);
              color: white;
            }
          }
        }
        &.active {
          .values {
            top: 32px;
            opacity: 1;
          }
          .mark {
            img {
              &:last-child {
                transform: rotate(180deg);
              }
            }
          }
        }
      }
      .r-links {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        img {
          height: 20px;
        }
        &::before {
          content: '';
          position: absolute;
          right: 4px;
          top: 4px;
          width: 8px;
          height: 8px;
          border-radius: 1000px;
          background-color: var(--red);
          z-index: 5;
          opacity: 0;
        }
        &.active {
          &::before {
            opacity: 1;
          }
        }
      }
      .user {
        display: flex;
        column-gap: 0px;
        align-items: center;
        cursor: pointer;
        position: relative;
        z-index: 0;
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 1000px;
          border: 1px solid var(--line);
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            height: 24px;
          }
          margin-right: 8px;
        }
        & > img {
          height: 20px;
          transition: var(--transition);
          transition-duration: 0.125s;
        }
        .values {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 4px;
          row-gap: 4px;
          width: 100%;
          top: 10px;
          opacity: 0;
          z-index: -1;
          transition: var(--transition);
          transition-duration: 0.125s;
          span {
            border-radius: 4px;
            width: 90%;
            background-color: var(--bg-color);
            padding: 2px;
            border: 1px solid var(--line);
            font-size: 12px;
            font-weight: 600;
            text-align: center;
            &.active,
            &:hover {
              background-color: var(--primary-color);
              color: white;
            }
          }
        }
        &.active {
          .values {
            top: 36px;
            opacity: 1;
          }
          & > img {
            transform: rotate(180deg);
          }
        }
      }
    }
  }
}
</style>
