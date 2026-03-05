<script lang="ts">
  import { onMount } from 'svelte';

  let open = $state(false);

  // Form state
  let name = $state('');
  let email = $state('');
  let message = $state('');

  // Error state
  let nameError = $state('');
  let emailError = $state('');
  let messageError = $state('');
  let submitError = $state('');

  // Submit state
  type Status = 'idle' | 'submitting' | 'sent';
  let status: Status = $state('idle');

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate(): boolean {
    nameError = name.length < 8 ? 'Name must be at least 8 characters.' : '';
    emailError = !emailRe.test(email) ? 'Please enter a valid email address.' : '';
    messageError = message.length < 12 ? 'Message must be at least 12 characters.' : '';
    return !nameError && !emailError && !messageError;
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    submitError = '';
    if (!validate()) return;

    status = 'submitting';
    const endpoint = import.meta.env.PUBLIC_CONTACT_ENDPOINT ?? '/api/contact';

    const [result] = await Promise.allSettled([
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      }),
      new Promise(resolve => setTimeout(resolve, 1000)), // minimum 1s spinner
    ]);

    if (result.status === 'fulfilled' && result.value.ok) {
      status = 'sent';
      setTimeout(() => {
        open = false;
        status = 'idle';
        name = email = message = '';
      }, 2000);
    } else {
      status = 'idle';
      submitError = 'Something went wrong. Please try again.';
    }
  }

  function close() {
    if (status === 'submitting') return;
    open = false;
    submitError = '';
    nameError = emailError = messageError = '';
  }

  function onKeydown(e: KeyboardEvent) {
    if (!open) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'Tab') trapFocus(e);
  }

  function trapFocus(e: KeyboardEvent) {
    const dialog = document.querySelector<HTMLElement>('.dialog');
    if (!dialog) return;
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // Listen for global open event dispatched by TopBar
  function onOpenEvent() { open = true; }

  onMount(() => {
    document.addEventListener('open-contact-dialog', onOpenEvent);
    document.addEventListener('keydown', onKeydown);
    return () => {
      document.removeEventListener('open-contact-dialog', onOpenEvent);
      document.removeEventListener('keydown', onKeydown);
    };
  });
</script>

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="overlay" onclick={close} role="presentation">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="dialog"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label="Contact Us"
    >
      <button class="close-btn" onclick={close} aria-label="Close dialog">&times;</button>

      <h2 class="dialog-title">Contact Us</h2>

      <form onsubmit={handleSubmit} novalidate>
        <div class="field">
          <label for="contact-name">Your Name</label>
          <input
            id="contact-name"
            type="text"
            bind:value={name}
            autocomplete="name"
            aria-describedby={nameError ? 'name-error' : undefined}
            aria-invalid={!!nameError}
          />
          {#if nameError}<p id="name-error" class="field-error">{nameError}</p>{/if}
        </div>

        <div class="field">
          <label for="contact-email">Your Email</label>
          <input
            id="contact-email"
            type="email"
            bind:value={email}
            autocomplete="email"
            aria-describedby={emailError ? 'email-error' : undefined}
            aria-invalid={!!emailError}
          />
          {#if emailError}<p id="email-error" class="field-error">{emailError}</p>{/if}
        </div>

        <div class="field">
          <label for="contact-message">Message</label>
          <textarea
            id="contact-message"
            bind:value={message}
            rows="5"
            aria-describedby={messageError ? 'message-error' : undefined}
            aria-invalid={!!messageError}
          ></textarea>
          {#if messageError}<p id="message-error" class="field-error">{messageError}</p>{/if}
        </div>

        <button
          type="submit"
          class="send-btn"
          class:sent={status === 'sent'}
          disabled={status === 'submitting' || status === 'sent'}
        >
          {#if status === 'submitting'}
            <span class="spinner" aria-hidden="true"></span> Send
          {:else if status === 'sent'}
            Sent!
          {:else}
            Send
          {/if}
        </button>

        {#if submitError}
          <p class="submit-error" role="alert">{submitError}</p>
        {/if}
      </form>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: var(--color-bg-overlay);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-4);
  }

  .dialog {
    background: var(--color-bg-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    width: 100%;
    max-width: var(--modal-width);
    padding: var(--space-8);
    position: relative;
  }

  .close-btn {
    position: absolute;
    top: var(--space-4);
    right: var(--space-4);
    background: none;
    border: none;
    cursor: pointer;
    font-size: var(--text-2xl);
    color: var(--color-text-muted);
    line-height: 1;
    padding: var(--space-1);
    transition: color var(--transition-fast);
  }

  .close-btn:hover { color: var(--color-text); }

  .dialog-title {
    font-family: var(--font-ui);
    font-size: var(--text-xl);
    color: var(--color-accent);
    margin-bottom: var(--space-6);
  }

  form {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  label {
    font-family: var(--font-ui);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  input, textarea {
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text);
    font-family: var(--font-body);
    font-size: var(--text-base);
    padding: var(--space-3) var(--space-4);
    width: 100%;
    transition: border-color var(--transition-fast);
  }

  input:focus, textarea:focus {
    outline: none;
    border-color: var(--color-accent);
  }

  input[aria-invalid="true"], textarea[aria-invalid="true"] {
    border-color: var(--color-error);
  }

  textarea { resize: vertical; }

  .field-error {
    font-family: var(--font-ui);
    font-size: var(--text-sm);
    color: var(--color-error);
  }

  .send-btn {
    align-self: flex-start;
    background: var(--color-accent);
    color: var(--color-bg);
    border: none;
    border-radius: var(--radius-sm);
    font-family: var(--font-ui);
    font-size: var(--text-base);
    font-weight: 600;
    padding: var(--space-3) var(--space-8);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--space-2);
    transition: background var(--transition-fast);
    min-width: 90px;
    justify-content: center;
  }

  .send-btn:hover:not(:disabled) { background: var(--color-accent-hover); }
  .send-btn:disabled { background: var(--color-border); color: var(--color-text-muted); cursor: default; }
  .send-btn.sent { background: var(--color-border); color: var(--color-text-muted); }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid var(--color-bg);
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .submit-error {
    font-family: var(--font-ui);
    font-size: var(--text-sm);
    color: var(--color-error);
    margin-top: var(--space-1);
  }
</style>
