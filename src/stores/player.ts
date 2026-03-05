import { writable } from 'svelte/store';

/** Holds the id of the currently playing DemoPlayer (or null if all paused). */
export const activePlayerId = writable<string | null>(null);
