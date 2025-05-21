// src/lib/gemsStore.ts
import { writable } from 'svelte/store';
export const gems = writable<number | null>(null);
