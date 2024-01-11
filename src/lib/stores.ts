import { writable } from 'svelte/store';
import type { Creation } from '$lib';

export const creations = writable<Creation[]>([]);