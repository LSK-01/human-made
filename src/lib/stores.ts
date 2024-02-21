import { writable } from 'svelte/store';
import type { Commit, Creation, Product } from '$lib';

export const creations = writable<Creation[]>([]);
export const commits = writable<Commit[]>([]);
export const products = writable<Product[]>([]);