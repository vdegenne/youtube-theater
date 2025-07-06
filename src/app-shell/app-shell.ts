import {withController} from '@snar/lit';
import {html} from 'lit';
import {withStyles} from 'lit-with-styles';
import {customElement} from 'lit/decorators.js';
import {MaterialShellChild} from 'material-shell/MaterialShellChild';
import {store} from '../store.js';
import styles from './app-shell.css?inline';

declare global {
	interface Window {
		app: AppShell;
	}
	interface HTMLElementTagNameMap {
		'app-shell': AppShell;
	}
}

@customElement('app-shell')
@withStyles(styles)
@withController(store)
export class AppShell extends MaterialShellChild {
	render() {
		return html`<!-- -->
			<main-page ?active=${store.page === 'main'}></main-page>
			<video-page ?active=${store.page === 'video'}></video-page>
			<!-- -->`;
	}

	// @confirm()
	// private _logout() {
	// 	authManager.logout();
	// }
}

export const app = (window.app = new AppShell());
