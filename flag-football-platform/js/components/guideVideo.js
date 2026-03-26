// js/components/guideVideo.js
// YouTube embed block — poster only, plays on click (no autoplay)
// Usage: renderVideoBlock(youtubeUrl, label)

export function renderVideoBlock(youtubeUrl, label) {
  if (!youtubeUrl) return '';

  const videoId = extractYouTubeId(youtubeUrl);
  if (!videoId) return '';

  const thumbUrl   = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const embedUrl   = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  const blockId    = 'vid-' + videoId;

  return `
    <div class="guide-video-block" id="${blockId}">
      <div class="vid-poster" onclick="playGuideVideo('${blockId}', '${embedUrl}')">
        <img
          src="${thumbUrl}"
          alt="${label || 'Watch video'}"
          class="vid-thumb-img"
          onerror="this.style.display='none'"
        />
        <div class="vid-overlay">
          <div class="vid-play-btn" aria-label="Play video">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="11" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
              <path d="M10 8L17 12L10 16V8Z" fill="white"/>
            </svg>
          </div>
        </div>
      </div>
      ${label ? `<div class="vid-label">${label}</div>` : ''}
    </div>`;
}

window.playGuideVideo = function (blockId, embedUrl) {
  const block = document.getElementById(blockId);
  if (!block) return;
  const poster = block.querySelector('.vid-poster');
  if (!poster) return;

  const iframe = document.createElement('iframe');
  iframe.src = embedUrl;
  iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
  iframe.allowFullscreen = true;
  iframe.className = 'vid-iframe';
  iframe.setAttribute('loading', 'lazy');

  poster.replaceWith(iframe);
};

function extractYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}
