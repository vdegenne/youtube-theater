import {withController} from '@snar/lit';
import {css, html} from 'lit';
import {withStyles} from 'lit-with-styles';
import {customElement} from 'lit/decorators.js';
import {store} from '../store.js';
import {PageElement} from './PageElement.js';

@customElement('video-page')
@withController(store)
@withStyles(css`
	:host {
	}
`)
export class VideoPage extends PageElement {
	render() {
		return html``;
	}
}
