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
        <input type="text" placeholder="Search">
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
      <i class="material-icons">notifications</i>
      <div class="user-avatar">U</div>
    </div>
  </header>
</template>

<script>
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
    }
  },
  methods: {
    toggleTheme() {
      this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', this.currentTheme)
      localStorage.setItem('theme', this.currentTheme)
    }
  },
  mounted() {
    document.documentElement.setAttribute('data-theme', this.currentTheme)
  }
}
</script>