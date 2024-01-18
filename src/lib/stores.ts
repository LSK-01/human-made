import { writable } from 'svelte/store';
import type { Commit, Creation } from '$lib';

export const creations = writable<Creation[]>([]);
export const commits = writable<Commit[]>([]);