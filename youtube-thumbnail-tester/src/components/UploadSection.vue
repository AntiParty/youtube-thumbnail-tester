<template>
  <div class="upload-preview-container">
    <div class="upload-form">
      <div class="form-group">
        <label for="channelName">Channel Name</label>
        <input
          type="text"
          id="channelName"
          v-model="channelName"
          placeholder="Enter your channel name"
        />
      </div>
      <div class="form-group">
        <label for="videoTitle">Video Title</label>
        <input
          type="text"
          id="videoTitle"
          v-model="videoTitle"
          @input="updateCharacterCount"
          placeholder="Enter your video title"
        />
        <div class="character-count">
          <span>{{ titleCount }}</span>/100
        </div>
      </div>
      <div class="form-group file-upload">
        <label for="thumbnailUpload">Thumbnail Image</label>
        <div class="upload-box" @click="triggerFileInput">
          <i class="material-icons">image</i>
          <span v-if="!thumbnailPreview">Click to upload thumbnail</span>
          <img v-if="thumbnailPreview" :src="thumbnailPreview" />
        </div>
        <input
          type="file"
          id="thumbnailUpload"
          ref="fileInput"
          @change="handleFileSelect"
          accept="image/*"
          style="display: none"
        />
        <div class="upload-hint">Recommended size: 1280x720 pixels (16:9 ratio)</div>
      </div>
    </div>

    <!-- Always visible preview section -->
    <div class="preview-section">
      <h2>Video Preview</h2>
      <div class="preview-content">
        <div class="video-tile">
          <div class="video-thumbnail">
            <img v-if="thumbnailPreview" :src="thumbnailPreview" alt="Thumbnail Preview">
            <div v-else class="thumbnail-placeholder">
              <i class="material-icons">image</i>
              <span>Thumbnail Preview</span>
            </div>
          </div>
          <div class="video-info">
            <div class="channel-icon">
              {{ channelInitial || 'C' }}
            </div>
            <div class="video-details">
              <h3>{{ videoTitle || "Your Video Title" }}</h3>
              <p>{{ channelName || "Your Channel Name" }}</p>
              <div class="metadata"><span>New upload</span></div>
            </div>
          </div>
        </div>

        <!-- Analysis sidebar -->
        <div class="thumbnail-analysis" v-if="thumbnailAnalysis">
          <h4>Thumbnail Analysis</h4>
          <ul>
            <li>Resolution: {{ thumbnailAnalysis.resolution }}</li>
            <li>Aspect Ratio: {{ thumbnailAnalysis.aspectRatio }}
              <span>{{ thumbnailAnalysis.isRecommendedRatio ? "✓" : "⚠️" }}</span>
            </li>
            <li>Brightness: {{ thumbnailAnalysis.brightnessNote }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UploadSection",
  data() {
    return {
      videoTitle: "",
      channelName: "",
      thumbnailFile: null,
      thumbnailPreview: null,
      thumbnailAnalysis: null,
      titleCount: 0,
    };
  },
  computed: {
    channelInitial() {
      return this.channelName?.charAt(0) || "";
    },
  },
  methods: {
    updateCharacterCount() {
      this.titleCount = this.videoTitle.length;
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async handleFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.thumbnailFile = file;

      const reader = new FileReader();
      reader.onload = async (e) => {
        this.thumbnailPreview = e.target.result;
        this.thumbnailAnalysis = await this.analyzeThumbnail(e.target.result);
      };

      reader.readAsDataURL(file);
    },
    async analyzeThumbnail(imageSrc) {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = imageSrc;

        img.onload = function () {
          const aspectRatio = img.width / img.height;
          const is16to9 = Math.abs(aspectRatio - 16 / 9) < 0.1;

          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          let brightnessSum = 0;

          for (let i = 0; i < data.length; i += 4) {
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            brightnessSum += brightness;
          }

          const avgBrightness = brightnessSum / (data.length / 4);

          resolve({
            resolution: `${img.width}×${img.height}`,
            aspectRatio: aspectRatio.toFixed(2),
            isRecommendedRatio: is16to9,
            averageBrightness: Math.round(avgBrightness),
            brightnessNote:
              avgBrightness > 150
                ? "May be too bright"
                : avgBrightness < 50
                ? "May be too dark"
                : "Good brightness",
          });
        };
      });
    },
  },
};
</script>

<style scoped>
.upload-preview-container {
  display: grid;
  grid-template-columns: minmax(300px, 400px) minmax(500px, 1fr);
  gap: 2rem;
  align-items: start;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.upload-form {
  background-color: var(--bg-primary);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 500;
  color: var(--text-primary);
}

input[type="text"] {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: border-color 0.3s ease;
}

input[type="text"]:focus {
  border-color: var(--youtube-red);
  outline: none;
}

.character-count {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.upload-box {
  cursor: pointer;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  padding: 1rem; /* Reduced padding */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background-color: var(--bg-primary);
  transition: all 0.3s ease;
  aspect-ratio: 16/9; /* Enforce 16:9 ratio */
  box-sizing: border-box; /* Include padding in dimensions */
  width: 100%; /* Ensure full width */
}

.upload-box:hover {
  border-color: var(--youtube-red);
  background-color: var(--bg-secondary);
}

.upload-box img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Show full image with letterboxing */
  border-radius: 4px;
}

.upload-hint {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

.preview-button {
  background-color: var(--youtube-red);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.preview-button:hover {
  opacity: 0.9;
}

.preview-section {
  background-color: var(--bg-primary);
  padding: 1.5rem;
  size: auto;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}

.preview-content {
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
  align-items: stretch; /* ensures both sides stay even height */
}

.video-tile {
  flex: 1;
  min-width: 400px;
  min-height: 225px; /* Optional: based on 16:9 ratio for 400px width */
  background-color: var(--bg-secondary);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.video-thumbnail {
  position: relative;
  background-color: var(--bg-primary);
  aspect-ratio: 16/9;
  width: 100%;
  height: auto;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* already correct */
  display: block;
}

.thumbnail-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
  color: var(--text-secondary);
}

.video-info {
  padding: 1rem;
  display: flex;
  gap: 1rem;
  background-color: var(--bg-primary);
}

.channel-icon {
  background-color: var(--youtube-light-dark);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.video-details {
  flex: 1;
}

.video-details h3 {
  font-size: 1.1rem;
  margin: 0;
  color: var(--text-primary);
}

.video-details p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0.25rem 0 0;
}

.metadata {
  font-size: 0.75rem;
  color: #66bb6a;
  margin-top: 0.5rem;
}

.thumbnail-analysis {
  width: 300px;
  background-color: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.thumbnail-analysis h4 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.thumbnail-analysis ul {
  list-style: none;
  padding: 0;
  margin: 0;
  color: var(--text-secondary);
}

.thumbnail-analysis li {
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 1200px) {
  .upload-preview-container {
    grid-template-columns: 1fr;
  }
  
  .preview-content {
    flex-direction: column;
  }
  
  .thumbnail-analysis {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .upload-preview-container {
    padding: 1rem;
  }
  
  .video-tile {
    min-width: unset;
  }
  
  .video-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .channel-icon {
    margin-bottom: 1rem;
  }
}
</style>