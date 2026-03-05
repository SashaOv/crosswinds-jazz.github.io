import { describe, it, expect } from 'vitest';

// Replicate the validation logic from ContactUsDialog so we can unit-test it
// without needing to render the Svelte component.

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateName(name: string): string {
  return name.length < 8 ? 'Name must be at least 8 characters.' : '';
}

function validateEmail(email: string): string {
  return !emailRe.test(email) ? 'Please enter a valid email address.' : '';
}

function validateMessage(message: string): string {
  return message.length < 12 ? 'Message must be at least 12 characters.' : '';
}

describe('contact form validation', () => {
  describe('name', () => {
    it('rejects names shorter than 8 characters', () => {
      expect(validateName('')).toBeTruthy();
      expect(validateName('A')).toBeTruthy();
      expect(validateName('1234567')).toBeTruthy();
    });

    it('accepts names with 8 or more characters', () => {
      expect(validateName('12345678')).toBe('');
      expect(validateName('John Smith')).toBe('');
    });
  });

  describe('email', () => {
    it('rejects invalid email formats', () => {
      expect(validateEmail('')).toBeTruthy();
      expect(validateEmail('plain')).toBeTruthy();
      expect(validateEmail('@no-local.com')).toBeTruthy();
      expect(validateEmail('no-domain@')).toBeTruthy();
      expect(validateEmail('has space@mail.com')).toBeTruthy();
    });

    it('accepts valid email formats', () => {
      expect(validateEmail('user@example.com')).toBe('');
      expect(validateEmail('a@b.co')).toBe('');
      expect(validateEmail('foo+bar@baz.org')).toBe('');
    });
  });

  describe('message', () => {
    it('rejects messages shorter than 12 characters', () => {
      expect(validateMessage('')).toBeTruthy();
      expect(validateMessage('short')).toBeTruthy();
      expect(validateMessage('12345678901')).toBeTruthy(); // 11 chars
    });

    it('accepts messages with 12 or more characters', () => {
      expect(validateMessage('123456789012')).toBe('');
      expect(validateMessage('Hello, I would like to book your band.')).toBe('');
    });
  });
});
