<template>
  <div>
    <LoadingScreen v-if="isLoading" @loaded="isLoading = false" />
    <template v-else>
      <Header />

      <div class="container">
        <Sidebar />
        <Popup />

        <div class="main-content">
          <!-- Dynamically render Changelog if on that route -->
          <component
            v-if="currentRouteComponent"
            :is="currentRouteComponent"
            :userVideo="currentVideo"
          />
          <template v-else>
            <UploadSection @generate-preview="handlePreview" />
            <FeedSection :userVideo="currentVideo" />
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import UploadSection from './components/UploadSection.vue'
import FeedSection from './components/FeedSection.vue'
import LoadingScreen from './components/LoadingScreen.vue'
import Popup from './components/Popup.vue'
import Changelog from './views/Changelog.vue'

export default {
  name: 'App',
  components: {
    Header,
    UploadSection,
    FeedSection,
    Sidebar,
    LoadingScreen,
    Popup,
    Changelog
  },
  setup() {
    const route = useRoute()

    // Optional mapping if you want more routes in the future
    const routeMap = {
      '/changelog': 'Changelog'
    }

    const currentRouteComponent = computed(() => {
      const componentName = routeMap[route.path]
      return componentName ? componentName : null
    })

    return {
      currentRouteComponent
    }
  },
  data() {
    return {
      isLoading: true,
      currentVideo: null,
      performanceMode: 'low'
    }
  },
  created() {
    this.detectPerformanceMode()
  },
  methods: {
    detectPerformanceMode() {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl')
      if (!gl) {
        this.performanceMode = 'low'
        return
      }

      const isSlowDevice =
        navigator.hardwareConcurrency < 4 || (navigator.deviceMemory || 4) < 4
      this.performanceMode = isSlowDevice ? 'low' : 'high'
    },
    handlePreview(videoData) {
      this.currentVideo = videoData
    }
  }
}
</script>

<style src="@/assets/style.css"></style>