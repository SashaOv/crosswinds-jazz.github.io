<script lang="ts">
  import type { ComponentProps } from 'svelte';

  let { links }: { links: { href: string; label: string }[] } = $props();

  let open = $state(false);

  function toggle() { open = !open; }
  function close() { open = false; }

  function openContact() {
    close();
    document.dispatchEvent(new CustomEvent('open-contact-dialog'));
  }
</script>

<div class="mobile-nav">
  <button class="hamburger" onclick={toggle} aria-label="Toggle navigation" aria-expanded={open}>
    <span></span><span></span><span></span>
  </button>

  {#if open}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="backdrop" onclick={close}></div>
    <div class="dropdown" role="menu">
      {#each links as link}
        <a href={link.href} class="menu-link" onclick={close} role="menuitem">{link.label}</a>
      {/each}
      <button class="menu-link contact-btn" onclick={openContact} role="menuitem">Contact Us</button>
    </div>
  {/if}
</div>

<style>
  .mobile-nav {
    display: none;
    position: relative;
  }

  @media (max-width: 640px) {
    .mobile-nav { display: block; }
  }

  .hamburger {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: var(--space-2);
  }

  .hamburger span {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--color-text);
    border-radius: 2px;
    transition: background var(--transition-fast);
  }

  .hamburger:hover span { background: var(--color-accent); }

  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 90;
  }

  .dropdown {
    position: absolute;
    top: calc(100% + var(--space-2));
    right: 0;
    z-index: 100;
    background: var(--color-bg-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    min-width: 180px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .menu-link {
    padding: var(--space-4) var(--space-6);
    color: var(--color-text);
    text-decoration: none;
    font-family: var(--font-ui);
    font-size: var(--text-base);
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background var(--transition-fast);
  }

  .menu-link:hover {
    background: var(--color-bg);
    color: var(--color-accent);
  }

  .contact-btn { color: var(--color-accent); font-weight: 600; }
</style>
