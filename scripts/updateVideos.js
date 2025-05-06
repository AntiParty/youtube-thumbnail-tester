const fs = require('fs');
const axios = require('axios');

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_IDS = [
  'UC-lHJZR3Gqxm24_Vd_AJ5Yw', // PewDiePie
  'UCsTcErHg8oDvUnTzoqsYeNw', // Fireship
  'UC4QobU6STFB0P71PMvOGN5A', // Marques Brownlee
  'UCBR8-60-B28hp2BmDPdntcQ', // YouTube Spotlight
];

const MAX_RESULTS = 10;
const OUTPUT_PATH = './videos.json';

async function fetchVideoDuration(videoId) {
  const url = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoId}&part=contentDetails`;
  const response = await axios.get(url);
  const video = response.data.items[0];
  if (video) {
    // Parse the duration string (e.g., PT10M30S)
    const duration = video.contentDetails.duration;
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    console.log(totalSeconds)
    return totalSeconds;
  }
  return 0;
}

async function fetchVideosFromChannel(channelId) {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet&order=date&type=video&maxResults=${MAX_RESULTS}`;
  const response = await axios.get(url);
  const items = response.data.items;

  const videos = [];
  for (const item of items) {
    const videoId = item.id.videoId;
    const videoDuration = await fetchVideoDuration(videoId);

    // Only include videos that are longer than 60 seconds (non-Shorts)
    if (videoDuration >= 120) {
      videos.push({
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
        views: "442k views",  // This can be updated if you fetch view counts as well
        time: new Date(item.snippet.publishedAt).toLocaleDateString(),
      });
    }
  }
  return videos;
}

async function updateVideoJSON() {
  let allVideos = [];

  for (const channelId of CHANNEL_IDS) {
    try {
      const videos = await fetchVideosFromChannel(channelId);
      allVideos.push(...videos);
      console.log(...videos)
    } catch (error) {
      console.error(`Failed to fetch from channel ${channelId}:`, error.message);
    }
  }

  let existing = [];
  if (fs.existsSync(OUTPUT_PATH)) {
    const raw = fs.readFileSync(OUTPUT_PATH, 'utf-8');
    try {
      existing = JSON.parse(raw);
    } catch {
      console.warn("Couldn't parse existing JSON. Starting fresh.");
    }
  }

  const combined = [...existing, ...allVideos];
  const unique = Array.from(new Map(combined.map(v => [v.title, v])).values());

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(unique, null, 2));
  console.log(`Updated ${OUTPUT_PATH} with ${unique.length} total videos.`);
}

updateVideoJSON();
