<script lang="ts">
  import { onDestroy } from 'svelte';
  import { activePlayerId } from '../stores/player';

  let { title, source }: { title: string; source: string } = $props();

  // Unique instance id for single-player coordination
  const id = `player-${Math.random().toString(36).slice(2)}`;

  let audio: HTMLAudioElement | undefined = $state();
  let paused = $state(true);
  let currentTime = $state(0);
  let duration = $state(0);

  // Pause when another player starts
  const unsub = activePlayerId.subscribe(active => {
    if (active !== id && audio && !audio.paused) {
      audio.pause();
    }
  });
  onDestroy(unsub);

  function fmt(s: number): string {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  function togglePlay() {
    if (!audio) return;
    if (audio.paused) {
      activePlayerId.set(id);
      audio.play();
    } else {
      audio.pause();
    }
  }

  function rewind() {
    if (audio) audio.currentTime = 0;
  }

  function skip(delta: number) {
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + delta));
  }

  function onTimeUpdate() {
    if (audio) currentTime = audio.currentTime;
  }

  function onLoadedMetadata() {
    if (audio) duration = audio.duration;
  }

  function onPlay() { paused = false; }
  function onPause() { paused = true; }
  function onEnded() {
    paused = true;
    activePlayerId.set(null);
  }
</script>

<!-- Hidden native audio element -->
<!-- svelte-ignore a11y-media-has-caption -->
<audio
  bind:this={audio}
  src={source}
  ontimeupdate={onTimeUpdate}
  onloadedmetadata={onLoadedMetadata}
  onplay={onPlay}
  onpause={onPause}
  onended={onEnded}
  preload="metadata"
></audio>

<div class="player" role="region" aria-label={`Player: ${title}`}>
  <p class="track-title">{title}</p>

  <div class="controls">
    <button onclick={rewind} aria-label="Rewind to start" title="Rewind">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
      </svg>
    </button>

    <button onclick={() => skip(-15)} aria-label="Skip back 15 seconds">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
      </svg>
      <span class="skip-label">15</span>
    </button>

    <button class="play-btn" onclick={togglePlay} aria-label={paused ? 'Play' : 'Pause'}>
      {#if paused}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7z"/>
        </svg>
      {:else}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
      {/if}
    </button>

    <button onclick={() => skip(15)} aria-label="Skip forward 15 seconds">
      <span class="skip-label">15</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
      </svg>
    </button>
  </div>

  <div class="time-display" aria-live="off">
    <span>{fmt(currentTime)}</span>
    <span class="sep">/</span>
    <span>{fmt(duration)}</span>
  </div>
</div>

<style>
  .player {
    width: var(--player-width);
    max-width: 100%;
    background: var(--color-bg-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-4) var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .track-title {
    font-family: var(--font-ui);
    font-size: var(--text-sm);
    color: var(--color-accent);
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-4);
  }

  .controls button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-text);
    display: flex;
    align-items: center;
    gap: 2px;
    padding: var(--space-1);
    border-radius: var(--radius-sm);
    transition: color var(--transition-fast);
  }

  .controls button:hover {
    color: var(--color-accent);
  }

  .play-btn {
    width: 40px;
    height: 40px;
    background: var(--color-accent) !important;
    color: var(--color-bg) !important;
    border-radius: 50% !important;
    justify-content: center;
  }

  .play-btn:hover {
    background: var(--color-accent-hover) !important;
  }

  .skip-label {
    font-family: var(--font-ui);
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
  }

  .time-display {
    font-family: var(--font-ui);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    text-align: center;
    display: flex;
    justify-content: center;
    gap: var(--space-1);
  }

  .sep { color: var(--color-border); }
</style>
