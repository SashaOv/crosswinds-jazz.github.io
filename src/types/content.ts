export interface Track {
  title?: string;
  source: string;
}

export interface ContentItem {
  title?: string;
  text?: string;
  photo: string;
  audio?: Track[];
}

export interface ContentDocument {
  title: string;
  content: ContentItem[];
  hero?: string;
}

export type HomeContent = ContentDocument;
export type TheBandContent = ContentDocument;
