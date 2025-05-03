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

    // Thumbnail preview handler
    function handleFileSelect() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                thumbnailPreview.innerHTML = '';
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '180px';
                thumbnailPreview.appendChild(img);
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

function renderFeed(userThumb, userTitle, userChannel) {
    const feed = document.getElementById("youtubeFeed");
    if (!feed) return;
    
    feed.innerHTML = "";
    const fakeVideos = generateFakeVideos();

    // Insert user's video randomly in the fake feed
    const insertIndex = Math.floor(Math.random() * (fakeVideos.length + 1));
    fakeVideos.splice(insertIndex, 0, {
        thumbnail: userThumb,
        title: userTitle,
        channel: userChannel,
        views: Math.floor(Math.random() * 1000000).toLocaleString() + " views",
        time: Math.floor(Math.random() * 30) + 1 + " days ago"
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

function generateFakeVideos() {
    const thumbnails = [
        "https://i.ytimg.com/vi/ysz5S6PUM-U/hqdefault.jpg",
        "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        "https://i.ytimg.com/vi/tgbNymZ7vqY/hqdefault.jpg",
        "https://i.ytimg.com/vi/eYq7WapuDLU/hqdefault.jpg",
        "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
        "https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg",
        "https://i.ytimg.com/vi/0yUaCPb_P-g/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCFP0ELpGVx17v2gJVslvhTjY3wyw",
        "https://i.ytimg.com/vi/ycJGIKLE9hg/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLAND5fNEg8P2DjX96untalUiW1nnQ",
        "https://i.ytimg.com/vi/6HGat7bJ7Fk/hq720.jpg?sqp=-oaymwFBCNAFEJQDSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-AH-CYAC0AWKAgwIABABGGUgZShlMA8=&rs=AOn4CLA3-xtxgn_Qgx0YvpLdQI3PE75i-g",
        "https://i.ytimg.com/vi/niWpfRyvs2U/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCswtozBDUWBwVrcatxVbdfX8OC2g",
    ];
    
    const titles = [
        "10 Tips You Didn't Know!",
        "You WON'T Believe This!",
        "How to Grow on YouTube",
        "Reacting to My First Video",
        "Daily Vlog #32 – Let's Talk",
        "Best Editing Tricks in 2025",
        "I Tried This for 30 Days... Here's What Happened",
        "The Ultimate Guide to Video Editing",
        "5 Things I Wish I Knew Before Starting YouTube",
        "Behind the Scenes of My Most Popular Video",
        "Apple just got Completely Destroyed in Court...",
        "7 Programming Myths that waste your time"
    ];
    
    const channels = ["TechGuy", "LifeWithAmy", "FilmTips", "WorldExplorer", "CookingMaster", "TravelDiaries", "GamerPro", "FitnessCoach", "Antiparty", "SomeOrdinaryGamers", "Fireship"];
    const views = ["1.2M views", "456K views", "7.8M views", "23K views", "112K views", "3.4M views", "200 views", "1.2k views"];
    const times = ["30 minutes ago","1 hour ago", "2 hours ago", "3 days ago", "1 week ago", "2 months ago", "1 year ago"];

    let videos = [];
    for (let i = 0; i < 10; i++) {
        videos.push({
            title: titles[Math.floor(Math.random() * titles.length)],
            channel: channels[Math.floor(Math.random() * channels.length)],
            thumbnail: thumbnails[Math.floor(Math.random() * thumbnails.length)],
            views: views[Math.floor(Math.random() * views.length)],
            time: times[Math.floor(Math.random() * times.length)]
        });
    }
    return videos;
}