<script lang="ts">
  import DemoPlayer from './DemoPlayer.svelte';
  import type { ContentItem } from '../types/content';

  let { item, flip = false }: { item: ContentItem; flip?: boolean } = $props();

  const firstTrack = item.audio?.[0];
</script>

<section class="info-section" class:flipped={flip}>
  <div class="text-col">
    {#if item.title}
      <h2 class="section-title">{item.title}</h2>
    {/if}
    {#if item.text}
      <p class="section-text">{item.text}</p>
    {/if}
    {#if firstTrack}
      <div class="player-wrap">
        <DemoPlayer title={firstTrack.title ?? ''} source={`/${firstTrack.source}`} />
      </div>
    {/if}
  </div>

  <div class="photo-col">
    {#if item.photo}
      <img
        src={`/${item.photo}`}
        alt={item.title ?? 'Band photo'}
        class="section-photo"
        loading="lazy"
      />
    {/if}
  </div>
</section>

<style>
  .info-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-12);
    align-items: center;
    max-width: var(--section-max-width);
    margin: 0 auto;
    padding: var(--section-gap) var(--space-8);
  }

  /* Flip: photo on left, text on right */
  .info-section.flipped .photo-col { order: -1; }

  .text-col {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .section-title {
    font-family: var(--font-ui);
    font-size: var(--text-2xl);
    color: var(--color-accent);
    font-weight: 600;
  }

  .section-text {
    font-size: var(--text-lg);
    color: var(--color-text);
    line-height: 1.7;
  }

  .player-wrap {
    margin-top: var(--space-2);
  }

  .photo-col {
    display: flex;
    justify-content: center;
  }

  .section-photo {
    max-width: var(--photo-width);
    max-height: 360px;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    box-shadow: 6px 6px 14px rgba(0, 0, 0, 0.5);
  }

  /* Mobile: stack, photo below text */
  @media (max-width: 768px) {
    .info-section {
      grid-template-columns: 1fr;
      gap: var(--space-6);
      padding: var(--space-8) var(--space-4);
    }

    .info-section.flipped .photo-col { order: 1; }
  }
</style>
