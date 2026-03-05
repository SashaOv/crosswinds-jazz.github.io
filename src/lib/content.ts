import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import type { ContentDocument } from '../types/content';

function loadYaml<T>(relativePath: string): T {
  const absPath = join(process.cwd(), relativePath);
  const raw = readFileSync(absPath, 'utf-8');
  const docs = yaml.loadAll(raw) as unknown[];
  // Root of each content file is a single-item list — unwrap it
  const doc = Array.isArray(docs[0]) ? docs[0][0] : docs[0];
  return doc as T;
}

export function getHomeContent(): ContentDocument {
  return loadYaml<ContentDocument>('content/home.yaml');
}

export function getTheBandContent(): ContentDocument {
  return loadYaml<ContentDocument>('content/the-band.yaml');
}
