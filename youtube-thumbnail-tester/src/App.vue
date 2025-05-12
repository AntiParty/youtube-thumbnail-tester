<template>
  <div>
    <LoadingScreen v-if="isLoading" @loaded="isLoading = false" />
    <template v-else>
      <Header />
      <div class="container">
        <Sidebar />
        <div class="main-content">
          <UploadSection @generate-preview="handlePreview" />
          <FeedSection :userVideo="currentVideo" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import UploadSection from './components/UploadSection.vue'
import FeedSection from './components/FeedSection.vue'
import LoadingScreen from './components/LoadingScreen.vue'


export default {
  name: 'Youtube thumbnail Test',
  components: {
    Header,
    Sidebar,
    UploadSection,
    FeedSection,
    LoadingScreen
  },
  data() {
    return {
      isLoading: true,
      currentVideo: null,
      performanceMode: 'low'
    }
  },
  created() {
    this.detectPerformanceMode();
  },
  methods: {
    detectPerformanceMode() {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl')
      if (!gl) {
        this.performanceMode = 'low'
        return;
      }

      const isSlowDevice = navigator.hardwareConcurrency < 4 || 
                          (navigator.deviceMemory || 4) < 4
      this.performanceMode = isSlowDevice ? 'low' : 'high'
    },

    handlePreview(videoData) {
      this.currentVideo = videoData
    }
  }
}
</script>

<style src="@/assets/style.css"></style>