import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import DemoPlayer from './DemoPlayer.svelte';

// Mock HTMLMediaElement methods not available in jsdom
beforeEach(() => {
  // @ts-ignore
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  // @ts-ignore
  window.HTMLMediaElement.prototype.pause = vi.fn();
  // @ts-ignore
  window.HTMLMediaElement.prototype.load = vi.fn();
});

describe('DemoPlayer', () => {
  it('renders the track title', () => {
    render(DemoPlayer, { props: { title: 'Test Song', source: '/audio/test.mp3' } });
    expect(screen.getByText('Test Song')).toBeInTheDocument();
  });

  it('renders all control buttons', () => {
    render(DemoPlayer, { props: { title: 'Test Song', source: '/audio/test.mp3' } });
    expect(screen.getByLabelText('Rewind to start')).toBeInTheDocument();
    expect(screen.getByLabelText('Skip back 15 seconds')).toBeInTheDocument();
    expect(screen.getByLabelText('Play')).toBeInTheDocument();
    expect(screen.getByLabelText('Skip forward 15 seconds')).toBeInTheDocument();
  });

  it('displays initial time as 0:00 / 0:00', () => {
    render(DemoPlayer, { props: { title: 'Test Song', source: '/audio/test.mp3' } });
    const times = screen.getAllByText('0:00');
    expect(times.length).toBeGreaterThanOrEqual(2);
  });

  it('toggles play/pause label on click', async () => {
    render(DemoPlayer, { props: { title: 'Test Song', source: '/audio/test.mp3' } });
    const playBtn = screen.getByLabelText('Play');
    await fireEvent.click(playBtn);
    // jsdom doesn't fire play event automatically — simulate it on the <audio>
    const audioEl = document.querySelector('audio')!;
    await fireEvent(audioEl, new Event('play'));
    expect(screen.getByLabelText('Pause')).toBeInTheDocument();
  });
});
