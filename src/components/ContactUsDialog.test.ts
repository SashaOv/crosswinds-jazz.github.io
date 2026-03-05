import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import ContactUsDialog from './ContactUsDialog.svelte';

// Helper: open the dialog by dispatching the custom event
function openDialog() {
  document.dispatchEvent(new CustomEvent('open-contact-dialog'));
}

describe('ContactUsDialog', () => {
  beforeEach(() => {
    render(ContactUsDialog);
    openDialog();
  });

  it('opens when open-contact-dialog event is dispatched', async () => {
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('shows validation errors on empty submit', async () => {
    const sendBtn = screen.getByRole('button', { name: /send/i });
    await fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 8 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
      expect(screen.getByText(/message must be at least 12 characters/i)).toBeInTheDocument();
    });
  });

  it('shows name error when name is too short', async () => {
    const nameInput = screen.getByLabelText(/your name/i);
    await fireEvent.input(nameInput, { target: { value: 'Short' } });

    const sendBtn = screen.getByRole('button', { name: /send/i });
    await fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('shows email error for invalid email', async () => {
    const emailInput = screen.getByLabelText(/your email/i);
    await fireEvent.input(emailInput, { target: { value: 'not-an-email' } });

    const sendBtn = screen.getByRole('button', { name: /send/i });
    await fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it('closes when X button is clicked', async () => {
    const closeBtn = screen.getByLabelText(/close dialog/i);
    await fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes on Escape key', async () => {
    await fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
