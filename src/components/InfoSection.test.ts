import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import InfoSection from './InfoSection.svelte';
import type { ContentItem } from '../types/content';

const mockItem: ContentItem = {
  title: 'Norm - Saxophones',
  text: 'A fantastic musician with years of experience.',
  photo: 'assets/test-photo.jpg',
  audio: [{ title: 'Test Track', source: 'assets/test.mp3' }],
};

const mockItemNoAudio: ContentItem = {
  title: 'Peter - Drums',
  text: 'An amazing drummer.',
  photo: 'assets/peter.jpg',
};

describe('InfoSection', () => {
  it('renders the section title', () => {
    render(InfoSection, { props: { item: mockItem, flip: false } });
    expect(screen.getByText('Norm - Saxophones')).toBeInTheDocument();
  });

  it('renders the section text', () => {
    render(InfoSection, { props: { item: mockItem, flip: false } });
    expect(screen.getByText(/fantastic musician/)).toBeInTheDocument();
  });

  it('renders an image with the correct alt text', () => {
    render(InfoSection, { props: { item: mockItem, flip: false } });
    const img = screen.getByAltText('Norm - Saxophones');
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toBe('/assets/test-photo.jpg');
  });

  it('renders DemoPlayer when audio is provided', () => {
    render(InfoSection, { props: { item: mockItem, flip: false } });
    expect(screen.getByText('Test Track')).toBeInTheDocument();
  });

  it('does not render DemoPlayer when audio is absent', () => {
    render(InfoSection, { props: { item: mockItemNoAudio, flip: false } });
    expect(screen.queryByLabelText(/play/i)).not.toBeInTheDocument();
  });

  it('applies flipped class when flip=true', () => {
    const { container } = render(InfoSection, { props: { item: mockItem, flip: true } });
    expect(container.querySelector('.flipped')).toBeTruthy();
  });
});
