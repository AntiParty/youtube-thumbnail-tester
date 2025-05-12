<template>
  <div class="feed-section">
    <div class="feed-header">
      <h2><i class="material-icons">home</i> Home Feed Preview</h2>
    </div>
    <div id="youtubeFeed" class="feed">
      <!-- User's video -->
      <div class="video-tile" v-if="userVideo && userVideo.thumbnail">
        <div class="video-thumbnail">
          <img :src="userVideo.thumbnail" alt="User Thumbnail" />
        </div>
        <div class="video-info">
          <div class="channel-icon">{{ userVideo.channel?.charAt(0) || '?' }}</div>
          <div class="video-details">
            <h3>{{ userVideo.title || 'Untitled' }}</h3>
            <p>{{ userVideo.channel || 'Unknown channel' }}</p>
            <div class="metadata">
              <span>New upload</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Comparison videos -->
      <div 
        class="video-tile" 
        v-for="(video, index) in comparisonVideos" 
        :key="index"
      >
        <div class="video-thumbnail">
          <img :src="video.thumbnail" :alt="video.title" loading="lazy" />
        </div>
        <div class="video-info">
          <div class="channel-icon">{{ video.channel.charAt(0) }}</div>
          <div class="video-details">
            <h3>{{ video.title }}</h3>
            <p>{{ video.channel }}</p>
            <div class="metadata">
              <span>{{ video.views }}</span>
              <span>•</span>
              <span>{{ video.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Staggered animation */
.video-tile {
  transition: all 0.3s ease;
}
.video-tile:hover {
  transform: translateY(-5px) scale(1.02);
}
</style>

<script>
export default {
  name: 'FeedSection',
  props: {
    userVideo: {
      type: Object,
      default: null,
      validator: (value) => {
        if (value && !value.thumbnail) {
          console.warn('userVideo prop should have a thumbnail property')
        }
        return true
      }
    }
  },
  data() {
    return {
      comparisonVideos: []
    }
  },
  async created() {
    await this.loadComparisonVideos()
  },
  methods: {
    async loadComparisonVideos() {
      try {
        const response = await fetch('/videos.json')
        const data = await response.json()
        this.comparisonVideos = data.map(video => ({
          ...video,
          views: this.formatViews(Math.floor(Math.random() * 1000000)),
          time: this.formatTime(Math.floor(Math.random() * 30))
        }))
      } catch (error) {
        console.error('Error loading videos:', error)
        this.comparisonVideos = []
      }
    },
    formatViews(count) {
      if (count >= 1000000) {
        return `${(count/1000000).toFixed(1)}M views`
      }
      if (count >= 1000) {
        return `${(count/1000).toFixed(1)}K views`
      }
      return `${count} views`
    },
    formatTime(days) {
      if (days === 0) return 'Today'
      if (days === 1) return 'Yesterday'
      if (days < 7) return `${days} days ago`
      if (days < 30) return `${Math.floor(days/7)} weeks ago`
      return `${Math.floor(days/30)} months ago`
    }
  }
}
</script>