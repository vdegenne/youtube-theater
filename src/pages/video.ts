import {withController} from '@snar/lit';
import {css, html} from 'lit';
import {withStyles} from 'lit-with-styles';
import {customElement} from 'lit/decorators.js';
import {store} from '../store.js';
import {PageElement} from './PageElement.js';
import {hash} from '../router.js';
import '../youtube.ts';

@customElement('video-page')
@withController(store)
@withStyles(css`
	:host {
		overflow: hidden;
	}
`)
export class VideoPage extends PageElement {
	render() {
		return html`
			<youtube-video
				class="h-full"
				video-id="${hash.$('videoId')}"
				start-time="${hash.$('startTime')}"
				@time-update="${(e: CustomEvent<TimeUpdateDetail>) => {
					hash.$('startTime', Math.floor(e.detail.currentTime));
					// console.log(e.detail.currentTime);
				}}"
			></youtube-video>
		`;
	}
}
