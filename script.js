/* ============================================
   GAMING PLAYLIST — JavaScript
   YouTube IFrame API + Custom Player UI
   ============================================ */

(function () {
  'use strict';

  // ---------- Curated Gaming Music Playlist (100% Embeddable) ----------
  // Each entry: { id: YouTube video ID, title, artist }
  const PLAYLIST = [
    // Riot Games & Esports Anthems
    { id: 'h7MYJghRWt0', title: 'Die For You', artist: 'VALORANT Champions 2021 ft. Grabbitz' },
    { id: 'UOxkGD8qRB4', title: 'POP/STARS', artist: 'K/DA (League of Legends)' },
    { id: 'r6zIGXun57U', title: 'Legends Never Die', artist: 'League of Legends ft. Against The Current' },
    { id: 'fB8TyLTD7EE', title: 'RISE', artist: 'League of Legends ft. The Glitch Mob, Mako' },
    { id: 'C3GouGa0noM', title: 'GODS', artist: 'League of Legends & NewJeans' },
    { id: 'D9G1VOjN_84', title: 'Enemy', artist: 'Imagine Dragons x JID (Arcane)' },
    { id: '3VTkBuxU4yk', title: 'MORE', artist: 'K/DA ft. Madison Beer, (G)I-DLE' },
    { id: 'zF5Ddo9JdpY', title: 'Awaken', artist: 'League of Legends ft. Valerie Broussard' },
    { id: 'i1IKnWDecwA', title: 'Phoenix', artist: 'League of Legends ft. Cailin Russo, Chrissy Costanza' },
    { id: 'b_sQ9bMltGU', title: 'Ticking Away', artist: 'VALORANT Champions 2023 ft. Grabbitz & bbno$' },
    // Electronic & Gaming Classics
    { id: '60ItHLz5WEA', title: 'On & On (feat. Daniel Levi)', artist: 'Cartoon' },
    { id: 'J2X5mJ3HDYE', title: 'Invincible', artist: 'DEAF KEV' },
    { id: 'AOeY-nDp7hI', title: 'Mortals (feat. Laura Brehm)', artist: 'Warriyo' },
    { id: 'f2xGxd9xPYA', title: 'Fade', artist: 'Alan Walker' },
    { id: 'nMlOoZr6GDM', title: 'Unity', artist: 'TheFatRat' },
    { id: 'QJo3clKAP8U', title: 'Fly Away (feat. Anjulie)', artist: 'TheFatRat' },
    { id: 'cFLJVYXQIDM', title: 'Monody (feat. Laura Brehm)', artist: 'TheFatRat' },
    { id: 'B7xai5u_tnk', title: 'Xenogenesis', artist: 'TheFatRat' },
    { id: 'bM7SZ5SBzyY', title: 'Sky High', artist: 'Elektronomia' },
    { id: '3nQNiWdeH2Q', title: 'Heroes Tonight (feat. Johnning)', artist: 'Janji' },
    { id: 'PKfxmFU3lWY', title: 'Symbolism', artist: 'Electro-Light' },
    { id: 'RqcjBLMaWCg', title: 'Fearless (feat. Chris Linton)', artist: 'Lost Sky' },
    { id: '6_b7RDuLwcI', title: 'Hope', artist: 'Tobu' },
    { id: '2vM_GMC7P9s', title: 'Cloud 9', artist: 'Tobu' },
    { id: 'MEbVOMBMed4', title: 'Why We Lose (feat. Coleman Trapp)', artist: 'Cartoon' },
    { id: 'kL8CyVqzmkc', title: 'My Heart', artist: 'Different Heaven & EH!DE' },
    { id: 'p7ZsBPK656s', title: 'Blank', artist: 'Disfigure' },
    { id: 'vBGiF6066p0', title: 'Energy', artist: 'Elektronomia' },
    { id: '1WP_YLn1D1c', title: 'Till It\'s Over', artist: 'Tristam' },
    { id: '4lXBHA55UXY', title: 'Dreams', artist: 'Lost Sky' },
    { id: 'lP24V0G0_0Q', title: 'Shine', artist: 'Spektrem' },
    { id: 'K4DyBUG242c', title: 'Spectrum', artist: 'Zedd ft. Matthew Koma' },
  ];

  // ---------- DOM References ----------
  const sessionTimerEl = document.getElementById('session-timer');
  const playerCountEl = document.getElementById('player-count');
  const trackCountEl = document.getElementById('track-count');
  const pressStartBtn = document.getElementById('press-start-btn');
  const hostCard = document.getElementById('host-card');
  const heroTitle = document.getElementById('hero-title');
  const queueOverlay = document.getElementById('queue-overlay');
  const queueList = document.getElementById('queue-list');
  const ticketOverlay = document.getElementById('ticket-overlay');
  const ticketCloseBtn = document.getElementById('ticket-close-btn');
  const rainContainer = document.getElementById('rain-container');
  const particleCanvas = document.getElementById('particle-canvas');

  // Player DOM
  const playerArt = document.getElementById('player-art');
  const playerArtImg = document.getElementById('player-art-img');
  const playerTitle = document.getElementById('player-title');
  const playerArtist = document.getElementById('player-artist');
  const btnPlay = document.getElementById('btn-play');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnVolume = document.getElementById('btn-volume');
  const btnShuffle = document.getElementById('btn-shuffle');
  const btnQueue = document.getElementById('btn-queue');
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  const iconVolOn = document.getElementById('icon-vol-on');
  const iconVolOff = document.getElementById('icon-vol-off');
  const volumeSlider = document.getElementById('volume-slider');
  const progressBar = document.getElementById('player-progress');
  const progressFill = document.getElementById('player-progress-fill');
  const progressThumb = document.getElementById('player-progress-thumb');
  const timeCurrent = document.getElementById('player-time-current');
  const timeDuration = document.getElementById('player-time-duration');

  // ---------- State ----------
  let ytPlayer = null;
  let currentIndex = 0;
  let isPlaying = false;
  let isMuted = false;
  let isShuffled = false;
  let shuffledOrder = [];
  let progressInterval = null;
  let lastVolume = 80;

  // Set track count
  trackCountEl.textContent = `${PLAYLIST.length} Tracks · Non-Stop`;

  // ---------- YouTube IFrame API ----------
  window.onYouTubeIframeAPIReady = function () {
    ytPlayer = new YT.Player('yt-player', {
      height: '1',
      width: '1',
      videoId: PLAYLIST[0].id,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError,
      },
    });
  };

  function onPlayerReady() {
    ytPlayer.setVolume(80);
    updateTrackInfo(0);
    buildQueueList();
    // Attempt autoplay immediately
    try {
      ytPlayer.playVideo();
    } catch (e) {
      console.log('Autoplay blocked by browser, waiting for user gesture.');
    }
  }

  // Global first-interaction fallback for strict browser autoplay policies
  function handleFirstInteraction() {
    if (!isPlaying && ytPlayer && ytPlayer.playVideo) {
      ytPlayer.playVideo();
    }
  }
  document.addEventListener('click', handleFirstInteraction, { once: true });
  document.addEventListener('keydown', handleFirstInteraction, { once: true });

  const autoplayNotice = document.getElementById('autoplay-notice');

  function onPlayerStateChange(event) {
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        isPlaying = true;
        if (autoplayNotice) autoplayNotice.classList.add('hidden');
        updatePlayIcon();
        startProgressTracking();
        break;
      case YT.PlayerState.PAUSED:
        isPlaying = false;
        updatePlayIcon();
        stopProgressTracking();
        break;
      case YT.PlayerState.ENDED:
        playNext();
        break;
      case YT.PlayerState.BUFFERING:
        // Keep playing state
        break;
    }
  }

  function onPlayerError(event) {
    console.warn('YouTube player error (code ' + event.data + '), skipping track immediately.');
    playNext();
  }

  // ---------- Playback Controls ----------
  function playTrack(index) {
    if (!ytPlayer || !ytPlayer.loadVideoById) return;
    currentIndex = index;
    const track = getTrackAtIndex(index);
    ytPlayer.loadVideoById(track.id);
    updateTrackInfo(index);
    updateQueueHighlight();
  }

  function togglePlay() {
    if (!ytPlayer) return;
    if (isPlaying) {
      ytPlayer.pauseVideo();
    } else {
      ytPlayer.playVideo();
    }
  }

  function playNext() {
    const nextIndex = (currentIndex + 1) % PLAYLIST.length;
    playTrack(nextIndex);
  }

  function playPrev() {
    // If more than 3s into track, restart it
    if (ytPlayer && ytPlayer.getCurrentTime && ytPlayer.getCurrentTime() > 3) {
      ytPlayer.seekTo(0);
      return;
    }
    const prevIndex = (currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    playTrack(prevIndex);
  }

  function seekTo(fraction) {
    if (!ytPlayer || !ytPlayer.getDuration) return;
    const duration = ytPlayer.getDuration();
    ytPlayer.seekTo(duration * fraction, true);
  }

  function setVolume(val) {
    if (!ytPlayer) return;
    ytPlayer.setVolume(val);
    if (val === 0) {
      isMuted = true;
    } else {
      isMuted = false;
      lastVolume = val;
    }
    updateVolumeIcon();
  }

  function toggleMute() {
    if (isMuted) {
      setVolume(lastVolume || 80);
      volumeSlider.value = lastVolume || 80;
    } else {
      lastVolume = ytPlayer.getVolume();
      setVolume(0);
      volumeSlider.value = 0;
    }
  }

  function toggleShuffle() {
    isShuffled = !isShuffled;
    btnShuffle.classList.toggle('active', isShuffled);

    if (isShuffled) {
      // Create shuffled order (Fisher-Yates)
      shuffledOrder = [...Array(PLAYLIST.length).keys()];
      for (let i = shuffledOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledOrder[i], shuffledOrder[j]] = [shuffledOrder[j], shuffledOrder[i]];
      }
    }
  }

  function getTrackAtIndex(index) {
    if (isShuffled) {
      return PLAYLIST[shuffledOrder[index]];
    }
    return PLAYLIST[index];
  }

  // ---------- UI Updates ----------
  function updateTrackInfo(index) {
    const track = getTrackAtIndex(index);
    playerTitle.textContent = track.title;
    playerArtist.textContent = track.artist;

    // YouTube thumbnail
    const thumbUrl = `https://img.youtube.com/vi/${track.id}/mqdefault.jpg`;
    playerArtImg.src = thumbUrl;
    playerArtImg.style.display = 'block';

    // Hide fallback when image loads
    playerArtImg.onerror = () => {
      playerArtImg.style.display = 'none';
    };
  }

  function updatePlayIcon() {
    if (isPlaying) {
      iconPlay.style.display = 'none';
      iconPause.style.display = 'block';
      playerArt.classList.add('spinning');
    } else {
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
      playerArt.classList.remove('spinning');
    }
  }

  function updateVolumeIcon() {
    iconVolOn.style.display = isMuted ? 'none' : 'block';
    iconVolOff.style.display = isMuted ? 'block' : 'none';
  }

  // ---------- Progress Tracking ----------
  function startProgressTracking() {
    stopProgressTracking();
    progressInterval = setInterval(updateProgress, 250);
  }

  function stopProgressTracking() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }

  function updateProgress() {
    if (!ytPlayer || !ytPlayer.getCurrentTime || !ytPlayer.getDuration) return;

    const current = ytPlayer.getCurrentTime();
    const duration = ytPlayer.getDuration();

    if (duration <= 0) return;

    const fraction = current / duration;
    progressFill.style.width = (fraction * 100) + '%';
    progressThumb.style.left = (fraction * 100) + '%';

    timeCurrent.textContent = formatTime(current);
    timeDuration.textContent = formatTime(duration);
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  // ---------- Progress Bar Click/Drag ----------
  let isDragging = false;

  progressBar.addEventListener('mousedown', (e) => {
    isDragging = true;
    handleProgressSeek(e);
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) handleProgressSeek(e);
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  function handleProgressSeek(e) {
    const rect = progressBar.getBoundingClientRect();
    let fraction = (e.clientX - rect.left) / rect.width;
    fraction = Math.max(0, Math.min(1, fraction));
    progressFill.style.width = (fraction * 100) + '%';
    progressThumb.style.left = (fraction * 100) + '%';
    seekTo(fraction);
  }

  // ---------- Queue List ----------
  function buildQueueList() {
    queueList.innerHTML = '';
    PLAYLIST.forEach((track, i) => {
      const item = document.createElement('div');
      item.className = 'queue-item' + (i === currentIndex ? ' active' : '');
      item.innerHTML = `
        <span class="queue-item-num">${i + 1}</span>
        <span class="queue-item-title">${track.title} — ${track.artist}</span>
      `;
      item.addEventListener('click', () => {
        playTrack(i);
        closeAllModals();
      });
      queueList.appendChild(item);
    });
  }

  function updateQueueHighlight() {
    const items = queueList.querySelectorAll('.queue-item');
    items.forEach((item, i) => {
      item.classList.toggle('active', i === currentIndex);
    });
  }

  // ---------- Button Event Listeners ----------
  btnPlay.addEventListener('click', togglePlay);
  btnNext.addEventListener('click', playNext);
  btnPrev.addEventListener('click', playPrev);
  btnVolume.addEventListener('click', toggleMute);
  btnShuffle.addEventListener('click', toggleShuffle);
  const btnQueueMobile = document.getElementById('btn-queue-mobile');
  const openQueue = () => {
    closeAllModals();
    queueOverlay.classList.add('active');
  };

  btnQueue.addEventListener('click', openQueue);
  if (btnQueueMobile) {
    btnQueueMobile.addEventListener('click', openQueue);
  }

  volumeSlider.addEventListener('input', (e) => {
    setVolume(parseInt(e.target.value, 10));
  });

  // ---------- Session Timer ----------
  const sessionStart = Date.now();

  function updateTimer() {
    const elapsed = Date.now() - sessionStart;
    const totalSeconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const pad = (n) => String(n).padStart(2, '0');
    sessionTimerEl.innerHTML = `${pad(minutes)}<span class="timer-separator">:</span>${pad(seconds)}`;
  }

  setInterval(updateTimer, 1000);
  updateTimer();

  // ---------- Timer Separator Blink ----------
  setInterval(() => {
    const separators = document.querySelectorAll('.timer-separator');
    separators.forEach(sep => {
      sep.style.opacity = sep.style.opacity === '0' ? '1' : '0';
    });
  }, 1000);

  // ---------- Player Count (Simulated) ----------
  let currentPlayers = 30 + Math.floor(Math.random() * 40);
  playerCountEl.textContent = currentPlayers;

  function fluctuatePlayers() {
    const change = Math.floor(Math.random() * 5) - 2;
    currentPlayers = Math.max(15, Math.min(120, currentPlayers + change));
    playerCountEl.textContent = currentPlayers;
  }

  setInterval(fluctuatePlayers, 3000 + Math.random() * 4000);

  // ---------- Web Audio: Retro Sound Effects ----------
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function playPressStartSFX() {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.15, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.25);
    });

    setTimeout(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1568, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2093, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }, 350);
  }

  // ---------- GG Burst Effect ----------
  const ggTexts = ['GG', 'GLHF', '1UP', 'COMBO!', 'HEADSHOT', 'EPIC', 'ACE!', 'MVP', 'BOOM', 'EZ', 'CLUTCH', 'GGWP'];

  function spawnGGBurst(x, y) {
    const el = document.createElement('div');
    el.className = 'gg-burst';
    el.textContent = ggTexts[Math.floor(Math.random() * ggTexts.length)];
    el.style.left = (x + (Math.random() - 0.5) * 100) + 'px';
    el.style.top = (y - 20) + 'px';

    const colors = ['#a855f7', '#06b6d4', '#ec4899', '#22d3ee', '#facc15'];
    el.style.color = colors[Math.floor(Math.random() * colors.length)];
    el.style.textShadow = `0 0 20px ${el.style.color}`;

    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  // ---------- Press Start Button ----------
  function triggerPressStart(e) {
    playPressStartSFX();

    const rect = pressStartBtn.getBoundingClientRect();
    const centerX = e ? e.clientX : rect.left + rect.width / 2;
    const centerY = e ? e.clientY : rect.top;

    for (let i = 0; i < 3; i++) {
      setTimeout(() => spawnGGBurst(centerX, centerY), i * 100);
    }

    pressStartBtn.style.transform = 'scale(0.95)';
    setTimeout(() => { pressStartBtn.style.transform = ''; }, 150);
  }

  pressStartBtn.addEventListener('click', triggerPressStart);

  // ---------- Host Card ----------
  hostCard.addEventListener('click', () => {
    closeAllModals();
    ticketOverlay.classList.add('active');
  });

  // ---------- Modal Handling ----------
  function closeAllModals() {
    queueOverlay.classList.remove('active');
    ticketOverlay.classList.remove('active');
  }

  queueOverlay.addEventListener('click', (e) => {
    if (e.target === queueOverlay) closeAllModals();
  });

  ticketOverlay.addEventListener('click', (e) => {
    if (e.target === ticketOverlay) closeAllModals();
  });

  ticketCloseBtn.addEventListener('click', closeAllModals);

  // ---------- Keyboard Shortcuts ----------
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key.toLowerCase()) {
      case ' ':
        e.preventDefault();
        togglePlay();
        break;

      case 'arrowright':
        e.preventDefault();
        if (ytPlayer && ytPlayer.getCurrentTime) {
          ytPlayer.seekTo(ytPlayer.getCurrentTime() + 5, true);
        }
        break;

      case 'arrowleft':
        e.preventDefault();
        if (ytPlayer && ytPlayer.getCurrentTime) {
          ytPlayer.seekTo(Math.max(0, ytPlayer.getCurrentTime() - 5), true);
        }
        break;

      case 'n':
        e.preventDefault();
        playNext();
        break;

      case 'p':
        e.preventDefault();
        playPrev();
        break;

      case 'h':
        e.preventDefault();
        triggerPressStart();
        break;

      case 'm':
        e.preventDefault();
        toggleMute();
        volumeSlider.value = isMuted ? 0 : lastVolume;
        break;

      case 's':
        e.preventDefault();
        toggleShuffle();
        break;

      case 'q':
        e.preventDefault();
        if (queueOverlay.classList.contains('active')) {
          closeAllModals();
        } else {
          closeAllModals();
          queueOverlay.classList.add('active');
        }
        break;

      case 't':
        e.preventDefault();
        if (ticketOverlay.classList.contains('active')) {
          closeAllModals();
        } else {
          closeAllModals();
          ticketOverlay.classList.add('active');
        }
        break;

      case 'escape':
        closeAllModals();
        break;
    }
  });

  // ---------- Rain Drops ----------
  function createRainDrops() {
    const count = 60;
    for (let i = 0; i < count; i++) {
      const drop = document.createElement('div');
      drop.className = 'rain-drop';
      drop.style.left = Math.random() * 100 + '%';
      drop.style.height = (20 + Math.random() * 30) + 'px';
      drop.style.animationDuration = (0.8 + Math.random() * 0.6) + 's';
      drop.style.animationDelay = Math.random() * 2 + 's';
      drop.style.opacity = 0.1 + Math.random() * 0.3;
      rainContainer.appendChild(drop);
    }
  }

  createRainDrops();

  // ---------- Particle Canvas ----------
  function initParticles() {
    const ctx = particleCanvas.getContext('2d');
    let width, height;
    const particles = [];
    const PARTICLE_COUNT = 50;

    function resize() {
      width = particleCanvas.width = window.innerWidth;
      height = particleCanvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.hue = Math.random() > 0.5 ? 270 : 190;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.01 + Math.random() * 0.02;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += this.pulseSpeed;
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) this.reset();
      }

      draw() {
        const currentOpacity = this.opacity * (0.5 + 0.5 * Math.sin(this.pulse));
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, ${currentOpacity})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, ${currentOpacity * 0.15})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => { p.update(); p.draw(); });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const lineOpacity = (1 - dist / 120) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  initParticles();

  // ---------- Hero Title Glitch Effect ----------
  const originalTitle = heroTitle.textContent;
  const glitchChars = '!@#$%^&*()_+-=[]{}|;:<>?/~`';

  heroTitle.addEventListener('mouseenter', () => {
    let iterations = 0;
    const interval = setInterval(() => {
      heroTitle.textContent = originalTitle
        .split('')
        .map((char, index) => {
          if (index < iterations) return originalTitle[index];
          return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        })
        .join('');

      iterations++;
      if (iterations > originalTitle.length) {
        heroTitle.textContent = originalTitle;
        clearInterval(interval);
      }
    }, 50);
  });

  // ---------- Ticket Dynamic Data ----------
  const ticketDateEl = document.getElementById('ticket-date');
  const ticketNumberEl = document.getElementById('ticket-number');

  if (ticketDateEl) {
    const now = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    ticketDateEl.textContent = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  }

  if (ticketNumberEl) {
    const num = String(Math.floor(Math.random() * 999999)).padStart(6, '0');
    ticketNumberEl.textContent = `NO. ${num}`;
  }

  // ---------- Console Easter Egg ----------
  console.log(
    '%c🎮 GAMING PLAYLIST %c\nWelcome to the lobby, Player.\nSpace = Play/Pause | N/P = Next/Prev | H = SFX | Q = Queue | S = Shuffle\n\n',
    'font-size: 24px; font-weight: bold; color: #a855f7; text-shadow: 0 0 10px #a855f7;',
    'font-size: 12px; color: #06b6d4;'
  );

})();
