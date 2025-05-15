<template>
  <header class="youtube-header">
    <div class="header-left" v-once>
      <div class="menu-icon">
        <i class="material-icons">menu</i>
      </div>
      <div class="youtube-logo">
        <i class="material-icons">play_circle_filled</i>
        <span>YouTube</span>
      </div>
    </div>

    <div class="header-center">
      <div class="search-bar">
        <input type="text" placeholder="Search" />
        <button class="search-button">
          <i class="material-icons">search</i>
        </button>
      </div>
    </div>

    <div class="header-right">
      <button class="theme-toggle" @click="toggleTheme">
        <i class="material-icons">{{ themeIcon }}</i>
      </button>
      <i class="material-icons">video_call</i>

      <!-- Toggle between Changelog and Home -->
      <button class="changelog-toggle" @click="toggleChangelog">
        {{ isChangelogPage ? '← Back' : '📄 Changelog' }}
      </button>

      <i class="material-icons">notifications</i>
      <div class="user-avatar">U</div>
    </div>
  </header>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'Header',
  data() {
    return {
      currentTheme: localStorage.getItem('theme') || 'light'
    }
  },
  computed: {
    themeIcon() {
      return this.currentTheme === 'dark' ? 'brightness_7' : 'brightness_4'
    },
    isChangelogPage() {
      return this.$route.path === '/changelog'
    }
  },
  methods: {
    toggleTheme() {
      this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', this.currentTheme)
      localStorage.setItem('theme', this.currentTheme)
    },
    toggleChangelog() {
      const target = this.isChangelogPage ? '/' : '/changelog'
      this.$router.push(target)
    }
  },
  mounted() {
    document.documentElement.setAttribute('data-theme', this.currentTheme)
  }
}
</script>

<style scoped>
.changelog-toggle {
  background: transparent;
  border: none;
  font-weight: bold;
  cursor: pointer;
  margin: 0 10px;
  color: white;
}
</style>