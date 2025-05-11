<template>
  <div class="loading-screen">
    <div class="loader">
      <div class="youtube-loader-icon">
        <i class="material-icons">play_circle_filled</i>
      </div>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingScreen',
  data() {
    return {
      progress: 0
    }
  },
  mounted() {
    const interval = setInterval(() => {
      this.progress += Math.random() * 15
      if (this.progress >= 100) {
        clearInterval(interval)
        this.$emit('loaded')
      }
    }, 300)
  }
}
</script>

<style lang="scss" scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #ff0000 0%, #0f0f0f 100%);
  z-index: 9999;
  
  .loader {
    text-align: center;
    width: 200px;
  }
  
  .youtube-loader-icon {
    color: white;
    font-size: 4rem;
    margin-bottom: 2rem;
    animation: pulse 1.5s infinite;
  }
  
  .progress-bar {
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    overflow: hidden;
  }
  
  .progress {
    height: 100%;
    background: white;
    transition: width 0.3s ease;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
}
</style>