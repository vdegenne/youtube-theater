// import {ReactiveController, state} from '@snar/lit';
// import {installRouter} from 'pwa-helpers';
// import toast from 'toastit';
// import {store} from './store.js';
//
// export enum Page {
// 	HOME,
// 	SESSION,
// }
//
// class Router extends ReactiveController {
// 	@state() page: Page = Page.HOME;
//
// 	navigateComplete = Promise.resolve();
//
// 	constructor() {
// 		super();
// 		installRouter(async (location) => {
// 			this.navigateComplete = new Promise(async (resolve) => {
// 				await store.updateComplete;
// 				const hash = location.hash.slice(1);
// 				if (!hash) {
// 					store.page = 'main'
// 				}
// 				else {
// 					store.page = 'video'
// 				}
// 				// const params = new URLSearchParams(hash);
// 				toast(store.page);
// 				resolve();
// 			});
// 		});
// 	}
// }

// export const router = new Router();

import {Hash, Router} from '@vdegenne/router';
import {store} from './store.js';
import toast from 'toastit';

export const hash = new Hash<{videoId: string; startTime: number}>();

export const router = new Router(async () => {
	await store.updateComplete;
	if (!hash.has('videoId')) {
		store.page = 'main';
		import('./pages/main.js');
	} else {
		store.page = 'video';
		import('./pages/video.js');
	}
});
