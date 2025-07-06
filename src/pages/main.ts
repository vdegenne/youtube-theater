import {withController} from '@snar/lit';
import {bindInput} from '@vdegenne/forms/bindInput';
import {css, html} from 'lit';
import {withStyles} from 'lit-with-styles';
import {customElement, state} from 'lit/decorators.js';
import {store} from '../store.js';
import {PageElement} from './PageElement.js';
import {hash, router} from '../router.js';

@customElement('main-page')
@withController(store)
@withStyles(css`
	:host {
		justify-content: center;
		align-items: center;
	}
`)
export class MainPage extends PageElement {
	@state() input = '';

	render() {
		return html`
			<div class="flex flex-col gap-1 w-full sm:w-2xl p-3 box-border">
				<md-outlined-text-field
					label="YouTube video ID"
					${bindInput(this, 'input')}
				></md-outlined-text-field>
				<md-filled-button
					?disabled=${!this.input}
					trailing-icon
					style="--md-filled-button-container-shape:0;"
					@click=${() => {
						hash.$('videoId', this.input);
					}}
				>
					<md-icon slot="icon">arrow_forward</md-icon>
					Watch
				</md-filled-button>
			</div>
		`;
	}
}

// export const mainPage = new MainPage();
