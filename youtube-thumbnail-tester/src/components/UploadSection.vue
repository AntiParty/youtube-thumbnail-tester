<template>
  <div class="upload-section">
    <h1><i class="material-icons">preview</i> YouTube Thumbnail Tester</h1>
    <p class="subtitle">
      See how your video will look in the YouTube feed before you publish
    </p>

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
        <div class="upload-box" id="thumbnailPreview" @click="triggerFileInput">
          <i class="material-icons">image</i>
          <span>Click to upload thumbnail</span>
          <input
            type="file"
            id="thumbnailUpload"
            ref="fileInput"
            @change="handleFileSelect"
            accept="image/*"
            style="display: none"
          />
        </div>
        <div class="upload-hint">
          Recommended size: 1280x720 pixels (16:9 ratio)
        </div>
      </div>
      <button class="preview-button" @click="generatePreview">
        <i class="material-icons">visibility</i> Generate Preview
      </button>
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
      titleCount: 0,
      thumbnailPreview: null,
    };
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
        // Set the base64 URL to thumbnailPreview
        this.thumbnailPreview = e.target.result; 

        const thumbnailElement = document.getElementById("thumbnailPreview");
        thumbnailElement.innerHTML = "";

        const img = document.createElement("img");
        img.src = e.target.result;
        img.style.maxWidth = "100%";
        img.style.maxHeight = "180px";
        thumbnailElement.appendChild(img);

        const analysis = await this.analyzeThumbnail(e.target.result);
        const analysisDiv = document.createElement("div");
        analysisDiv.className = "thumbnail-analysis";
        analysisDiv.innerHTML = `
          <h4>Thumbnail Analysis</h4>
          <ul>
            <li>Resolution: ${analysis.resolution}</li>
            <li>Aspect Ratio: ${analysis.aspectRatio} 
                ${analysis.isRecommendedRatio ? "✓" : "⚠️"}</li>
            <li>Brightness: ${analysis.brightnessNote}</li>
          </ul>
        `;
        thumbnailElement.appendChild(analysisDiv);

        thumbnailElement.classList.add("animate__animated", "animate__zoomIn");
        setTimeout(() => {
          thumbnailElement.classList.remove("animate__animated", "animate__zoomIn");
        }, 1000);
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
          let brightnessValues = [];

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const brightness = (r + g + b) / 3;
            brightnessSum += brightness;
            brightnessValues.push(brightness);
          }

          const avgBrightness = brightnessSum / brightnessValues.length;

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
    generatePreview() {
      if (!this.videoTitle || !this.channelName || !this.thumbnailPreview) {
        alert(`Please complete all fields`);
        return;
      }

      this.$emit("generate-preview", {
        thumbnail: this.thumbnailPreview, // Use the base64 URL
        title: this.videoTitle,
        channel: this.channelName,
      });
    },
  },
};
</script>
