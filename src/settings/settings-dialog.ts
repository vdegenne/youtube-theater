import type {MdDialog} from '@material/web/all.js';
import {withController} from '@snar/lit';
import {FormBuilder} from '@vdegenne/forms/FormBuilder';
import {customElement} from 'custom-element-decorator';
import {html, LitElement} from 'lit';
import {withStyles} from 'lit-with-styles';
import {query, state} from 'lit/decorators.js';
import '../material/dialog-patch.js';
import {store} from '../store.js';
import {renderThemeElements} from '../styles/theme-elements.js';
import {themeStore} from '../styles/themeStore.js';
import styles from './settings-dialog.css?inline';

let F = new FormBuilder(store);

@customElement({name: 'settings-dialog', inject: true})
@withStyles(styles)
@withController(themeStore)
@withController(store)
export class SettingsDialog extends LitElement {
	@state() open = false;

	@query('md-dialog') dialog!: MdDialog;

	render() {
		return html`
			<md-dialog
				?open=${this.open}
				@closed=${() => (this.open = false)}
				style="max-width:min(100vw - 18px, 400px);width:100%"
			>
				<header slot="headline" class="select-none">
					<md-icon>settings</md-icon>
					Settings
				</header>

				<form
					slot="content"
					method="dialog"
					id="form"
					class="flex flex-col gap-9"
				>
					<section>
						<h3>Video</h3>
						${F.TEXTFIELD('Small step', 'smallStep', {
							suffixText: 'seconds',
							resetButton: false,
						})}
						${F.TEXTFIELD('Big step', 'bigStep', {
							suffixText: 'seconds',
							resetButton: false,
						})}
					</section>

					<md-list class="p-0" style="--forms-switch-padding:initial" hidden>
						<!-- put the switches here -->
					</md-list>

					<section class="mb-5">
						<h3>Theme</h3>
						${renderThemeElements()}
					</section>
				</form>

				<div slot="actions">
					<md-text-button form="form" autofocus>Close</md-text-button>
				</div>
			</md-dialog>
		`;
	}

	async show() {
		if (this.dialog.open) {
			const dialogClose = new Promise((resolve) => {
				const resolveCB = () => {
					resolve(null);
					this.dialog.removeEventListener('closed', resolveCB);
				};
				this.dialog.addEventListener('closed', resolveCB);
			});
			this.dialog.close();
			await dialogClose;
		}
		this.open = true;
	}

	close(returnValue?: string) {
		return this.dialog.close(returnValue);
	}
}

declare global {
	interface Window {
		settingsDialog: SettingsDialog;
	}
	interface HTMLElementTagNameMap {
		'settings-dialog': SettingsDialog;
	}
}

export const settingsDialog = (window.settingsDialog = new SettingsDialog());
