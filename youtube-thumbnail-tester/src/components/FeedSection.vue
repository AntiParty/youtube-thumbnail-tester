<template>
  <div class="feed-section">
    <div class="feed-header">
      <h2><i class="material-icons">home</i> Home Feed Preview</h2>
    </div>
    <div id="youtubeFeed" class="feed">
      <!-- Combined video list -->
      <div
        class="video-tile"
        v-for="(video, index) in displayedVideos"
        :key="index"
      >
        <div class="video-thumbnail">
          <img :src="video.thumbnail" :alt="video.title" loading="lazy" />
        </div>
        <div class="video-info">
          <div class="channel-icon">
            <template v-if="video.isUserVideo">
              {{ video.channel?.charAt(0) || "?" }}
            </template>
            <img v-else :src="video.channelIcon" alt="Channel Icon" />
          </div>
          <div class="video-details">
            <h3>{{ video.title || "Untitled" }}</h3>
            <p>{{ video.channel || "Unknown channel" }}</p>
            <div class="metadata">
              <span v-if="video.isUserVideo">New upload</span>
              <template v-else>
                <span>{{ video.views }}</span>
                <span>•</span>
                <span>{{ video.time }}</span>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Sentinel element -->
      <div ref="sentinel" class="loading-sentinel">
        <p>Loading more...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.channel-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ddd;
}
.channel-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Staggered animation */
.video-title {
  transition: all 0.3s ease;
}
.video-title:hover {
  transform: translateY(-5px) scale(1.02);
}

.feed {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Default: 3 columns */
  gap: 16px; /* Spacing between items */
  width: 100%;
}

@media (max-width: 1200px) {
  .feed {
    grid-template-columns: repeat(2, 1fr); /* 2 columns for medium screens */
  }
}

@media (max-width: 768px) {
  .feed {
    grid-template-columns: 1fr; /* 1 column for small screens */
  }
}

.card {
  margin: 0;
  padding: 0;
}

/* Thumbnail */
.video-thumbnail img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  background-color: #333;
  display: block;
  border-radius: 12px;
  overflow: hidden;
}

/* Info below the video */
.video-info {
  display: flex;
  padding: 12px;
}

/* Icon and details */
.video-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.video-details h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  line-height: 1.2;
}

.video-details p {
  margin: 4px 0;
  font-size: 0.9rem;
  color: #aaa;
}

.metadata {
  display: flex;
  gap: 6px;
  font-size: 0.85rem;
  color: #999;
  margin-top: 4px;
}

.loading-sentinel {
  grid-column: 1 / -1;
  text-align: center;
  padding: 20px;
  color: #aaa;
}
</style>

<script>
export default {
  name: "FeedSection",
  props: {
    userVideo: {
      type: Object,
      default: null,
      validator: (value) => {
        if (value && !value.thumbnail) {
          console.warn("userVideo prop should have a thumbnail property");
        }
        return true;
      },
    },
  },
  data() {
    return {
      allVideos: [],          // All videos fetched and shuffled
      comparisonVideos: [],   // Currently displayed videos
      videoBatchSize: 20,     // How many to load per batch
      loadedCount: 0,         // How many have been loaded so far
      observer: null,         // IntersectionObserver instance
    };
  },
  async mounted() {
    await this.fetchAllVideos();
    this.loadMoreVideos();

    this.observer = new IntersectionObserver(this.onIntersect, {
      root: null,
      threshold: 1.0,
    });

    if (this.$refs.sentinel) {
      this.observer.observe(this.$refs.sentinel);
    }
  },
  beforeDestroy() {
    if (this.observer && this.$refs.sentinel) {
      this.observer.unobserve(this.$refs.sentinel);
    }
  },

  computed: {
    displayedVideos(){
      const combined = [];

      if (this.userVideo && this.userVideo.thumbnail) {
        combined.push({
          thumbnail: this.userVideo.thumbnail,
          title: this.userVideo.title || 'Your video title',
          channel: this.userVideo.channel || 'Your channel',
          isUserVideo: true,
          // Add mock data for consistency
          views: 'New upload',
          time: 'Just now'
        });
      }
      return combined.concat(this.comparisonVideos);
    }
  },

  methods: {
    async fetchAllVideos() {
      try {
        const response = await fetch("/videos.json");
        const data = await response.json();
        this.allVideos = this.shuffleArray(data);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      }
    },
    async loadMoreVideos() {
      const nextBatch = this.allVideos
        .slice(this.loadedCount, this.loadedCount + this.videoBatchSize)
        .map(video => ({
          ...video,
          isUserVideo: false,
          views: this.formatViews(Math.floor(Math.random() * 1000000)),
          time: this.formatTime(Math.floor(Math.random() * 30)),
          // Ensure comparison videos have channelIcon
          channelIcon: video.channelIcon || '/default-channel-icon.png'
        }));

      this.comparisonVideos = [...this.comparisonVideos, ...nextBatch];
      this.loadedCount += this.videoBatchSize;
    },
    onIntersect(entries) {
      const entry = entries[0];
      if (entry.isIntersecting) {
        // Load more videos only if available
        if (this.loadedCount < this.allVideos.length) {
          this.loadMoreVideos();
        }
      }
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    formatViews(count) {
      if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M views`;
      }
      if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K views`;
      }
      return `${count} views`;
    },
    formatTime(days) {
      if (days === 0) return "Today";
      if (days === 1) return "Yesterday";
      if (days < 7) return `${days} days ago`;
      if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
      return `${Math.floor(days / 30)} months ago`;
    },
  },
};
</script>
