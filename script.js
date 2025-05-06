document.addEventListener('DOMContentLoaded', function() {
    // Get all elements
    const titleInput = document.getElementById('videoTitle');
    const channelInput = document.getElementById('channelName');
    const fileInput = document.getElementById('thumbnailUpload');
    const previewButton = document.querySelector('.preview-button');
    const titleCount = document.getElementById('titleCount');
    const thumbnailPreview = document.getElementById('thumbnailPreview');

    
    function updateCharacterCount() {
        titleCount.textContent = titleInput.value.length;
    }

    async function handleFileSelect() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = async function(e) {
                thumbnailPreview.innerHTML = '';
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '180px';
                thumbnailPreview.appendChild(img);
                
                // Add analysis results
                const analysis = await analyzeThumbnail(e.target.result);
                const analysisDiv = document.createElement('div');
                analysisDiv.className = 'thumbnail-analysis';
                analysisDiv.innerHTML = `
                    <h4>Thumbnail Analysis</h4>
                    <ul>
                        <li>Resolution: ${analysis.resolution}</li>
                        <li>Aspect Ratio: ${analysis.aspectRatio} 
                            ${analysis.isRecommendedRatio ? '✓' : '⚠️'}</li>
                        <li>Brightness: ${analysis.brightnessNote}</li>
                    </ul>
                `;
                thumbnailPreview.appendChild(analysisDiv);
            };
            
            reader.readAsDataURL(this.files[0]);
        }
    }
    
    function generatePreview() {
        const title = titleInput.value.trim();
        const channel = channelInput.value.trim();
        const file = fileInput.files[0];
        
        console.log("Debug:", {
            title: title,
            channel: channel,
            file: file
        });
        
        if (!title || !channel || !file) {
            alert(`Please complete all fields:
            ${!title ? "✓ Video title\n" : ""}
            ${!channel ? "✓ Channel name\n" : ""}
            ${!file ? "✓ Thumbnail upload" : ""}`);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            renderFeed(e.target.result, title, channel);
        };
        reader.onerror = function() {
            alert("Error reading image file. Please try another image.");
        };
        reader.readAsDataURL(file);
    }

    // Attach event listeners
    titleInput.addEventListener('input', updateCharacterCount);
    fileInput.addEventListener('change', handleFileSelect);
    previewButton.addEventListener('click', generatePreview);
});

function analyzeThumbnail(imageSrc) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = imageSrc;
        
        img.onload = function() {
            // Basic checks
            const aspectRatio = img.width / img.height;
            const is16to9 = Math.abs(aspectRatio - 16/9) < 0.1;
            
            // Create a canvas to analyze colors
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Calculate brightness variance
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
            
            const avgBrightness = brightnessSum / (brightnessValues.length);
            
            resolve({
                resolution: `${img.width}×${img.height}`,
                aspectRatio: aspectRatio.toFixed(2),
                isRecommendedRatio: is16to9,
                averageBrightness: Math.round(avgBrightness),
                brightnessNote: avgBrightness > 150 ? 
                    'May be too bright' : avgBrightness < 50 ? 
                    'May be too dark' : 'Good brightness',
                textContrast: 'Check text contrast', // Would need text detection
                faceDetected: false
            });
        };
    });
}

async function renderFeed(userThumb, userTitle, userChannel) {
    const feed = document.getElementById("youtubeFeed");
    if (!feed) return;
    
    feed.innerHTML = "";

    const fakeVideos = await loadFakeVideos();

    // Insert user's video randomly in the fake feed
    const insertIndex = Math.floor(Math.random() * (fakeVideos.length + 1));
    fakeVideos.splice(insertIndex, 0, {
        thumbnail: userThumb,
        title: userTitle,
        channel: userChannel,
        views: Math.floor(Math.random() * 1000000).toLocaleString() + " views",
        time: Math.floor(Math.random() * 30) + " days ago"
    });

    fakeVideos.forEach(video => {
        const tile = document.createElement("div");
        tile.className = "video-tile";
        tile.innerHTML = `
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="Video Thumbnail" />
            </div>
            <div class="video-info">
                <div class="channel-icon">${video.channel.charAt(0)}</div>
                <div class="video-details">
                    <h3>${video.title}</h3>
                    <p>${video.channel}</p>
                    <div class="metadata">
                        <span>${video.views}</span>
                        <span>•</span>
                        <span>${video.time}</span>
                    </div>
                </div>
            </div>
        `;
        feed.appendChild(tile);
    });
}

const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'light';

document.getElementById('themeToggle').addEventListener('click', () => {
    document.documentElement.toggleAttribute('data-theme', 'dark');
  });

// Apply the saved theme
document.documentElement.setAttribute('data-theme', currentTheme);
themeToggle.innerHTML = currentTheme === 'dark' ? 
  '<i class="material-icons">brightness_7</i>' : 
  '<i class="material-icons">brightness_4</i>';


themeToggle.addEventListener('click', () => {
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  themeToggle.innerHTML = newTheme === 'dark' ? 
    '<i class="material-icons">brightness_7</i>' : 
    '<i class="material-icons">brightness_4</i>';
});

async function loadFakeVideos() {
    const response = await fetch('videos.json');
    const data = await response.json();
    return data;
}