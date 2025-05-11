<template>
  <div class="feed-section">
    <div class="feed-header">
      <h2><i class="material-icons">home</i> Home Feed Preview</h2>
      <div class="view-options">
        <button class="view-option active"><i class="material-icons">grid_view</i></button>
        <button class="view-option"><i class="material-icons">view_agenda</i></button>
      </div>
    </div>
    <div id="youtubeFeed" class="feed">
      <div class="video-tile" v-for="(video, index) in videos" :key="index">
        <div class="video-thumbnail">
          <img :src="video.thumbnail" alt="Video Thumbnail" />
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
      default: null
    }
  },
  data() {
    return {
      videos: []
    }
  },
  async created() {
    await this.loadFakeVideos()
  },
  watch: {
    userVideo(newVideo) {
      if (newVideo) {
        this.insertUserVideo(newVideo)
      }
    }
  },
  methods: {
    async loadFakeVideos() {
      try {
        const response = await fetch('/videos.json')
        this.videos = await response.json()
      } catch (error) {
        console.error('Error loading videos:', error)
        this.videos = []
      }
    },
    insertUserVideo(userVideo) {
      const videoWithMetadata = {
        ...userVideo,
        views: Math.floor(Math.random() * 1000000).toLocaleString() + " views",
        time: Math.floor(Math.random() * 30) + " days ago"
      }
      
      const insertIndex = Math.floor(Math.random() * (this.videos.length + 1))
      this.videos.splice(insertIndex, 0, videoWithMetadata)
    }
  }
}
</script>