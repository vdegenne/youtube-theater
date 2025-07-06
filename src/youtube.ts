import {withController} from '@snar/lit';
import {html, LitElement, PropertyValues} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {state} from 'snar';
import {store} from './store.js';

declare global {
	interface Window {
		onYouTubeIframeAPIReady: Function;
		YouTubeIframeAPIReady: Promise<void>;
	}
	interface TimeUpdateDetail {
		currentTime: number;
	}
	interface HTMLElementEventMap {
		'time-update': CustomEvent<TimeUpdateDetail>;
	}
	interface WindowEventMap {
		'time-update': CustomEvent<{currentTime: number}>;
	}
	interface HTMLElementTagNameMap {
		'youtube-video': YouTubeVideo;
	}
}

let scriptWasInjected = false;

const {promise, resolve} = Promise.withResolvers<void>();
window.YouTubeIframeAPIReady = promise;
window.onYouTubeIframeAPIReady =
	/**
	 * This function is called when the iframe API is ready
	 */
	function () {
		resolve();
	};

export enum PlayerState {
	UNLOADED = -2,
	UNSTARTED = -1, // YT.PlayerState.UNSTARTED,
	ENDED = 0, // YT.PlayerState.ENDED,
	PLAYING = 1, // YT.PlayerState.PLAYING,
	PAUSED = 2, // YT.PlayerState.PAUSED,
	BUFFERING = 3, // YT.PlayerState.BUFFERING,
	CUED = 5, // YT.PlayerState.CUED,
}

// class VideoController extends ReactiveController {
// 	// @state() session: Session | undefined = undefined;
// 	@state() state: PlayerState = PlayerState.UNLOADED;
// }
// export const videoController = new VideoController();

@customElement('youtube-video')
@withController(store)
export class YouTubeVideo extends LitElement {
	/**
	 * Id of the YouTube video.
	 */
	@property({attribute: 'video-id'}) videoId: string | undefined = undefined;
	@state() state: PlayerState = PlayerState.UNLOADED;
	@property({type: Number, attribute: 'start-time'}) startTime = 0;

	#player!: YT.Player;

	@query('#player') playerElement!: HTMLDivElement;

	#timeUpdateInterval: number | undefined;

	// protected update(changedProperties: PropertyValues): void {
	// 	this.videoId = videoController.session.youtubeVideoId;
	// 	super.update(changedProperties);
	// }

	async updated(changed: PropertyValues<this>) {
		if (changed.has('videoId') && this.videoId !== undefined) {
			if (!scriptWasInjected) {
				const s = document.createElement('script');
				s.src = 'https://www.youtube.com/iframe_api';
				// this.renderRoot.appendChild(s);
				document.head.appendChild(s);
			}
			await window.YouTubeIframeAPIReady;
			this.resetPlayerWrapper();
			this.#player = new YT.Player(this.playerElement, {
				// height: '390',
				// width: '640',
				height: '100%',
				width: '100%',
				videoId: this.videoId,
				playerVars: {
					// autoplay: 1,
					start: this.startTime,
					playsinline: 0,

					controls: 0, // Hide player controls
					modestbranding: 1, // Remove YouTube logo in the control bar
					showinfo: 0, // Deprecated, but doesn't do much anymore
					rel: 0, // Disable related videos at end
					fs: 0, // Hide fullscreen button
				},
				events: {
					onReady: () => {
						this.state = YT.PlayerState.UNSTARTED;
					},
					onStateChange: (event) => {
						// toast(event.data, {leading: true});
						this.state = event.data;

						switch (event.data) {
							case YT.PlayerState.PLAYING:
							case YT.PlayerState.PAUSED:
								if (!this.#timeUpdateInterval) {
									this.#timeUpdateInterval = window.setInterval(() => {
										const currentTime = this.#player.getCurrentTime();
										this.dispatchEvent(
											new CustomEvent<TimeUpdateDetail>('time-update', {
												bubbles: true,
												composed: true,
												detail: {currentTime},
											}),
										);
									}, 250);
								}
								break;
							default:
								// Pause or ended — stop polling
								if (this.#timeUpdateInterval) {
									clearInterval(this.#timeUpdateInterval);
									this.#timeUpdateInterval = undefined;
								}
								break;
						}
					},
				},
			});
		}
	}

	play() {
		this.#player.playVideo();
	}
	pause() {
		this.#player.pauseVideo();
	}
	toggle() {
		if (
			this.state === PlayerState.UNSTARTED ||
			this.state === PlayerState.PAUSED ||
			this.state === PlayerState.ENDED
		) {
			return this.play();
		}
		if (this.state === PlayerState.PLAYING) {
			return this.pause();
		}
	}

	get currentTime() {
		return this.#player.getCurrentTime();
	}
	set currentTime(seconds: number) {
		this.#player.seekTo(seconds, true);
	}

	setPlaybackrate(rate: number) {
		this.#player.setPlaybackRate(rate);
	}

	render() {
		return html`<!-- -->
			<div id="player-wrapper" style="height:100%;">
				<div id="player"></div>
			</div>
			<!-- -->`;
	}

	resetPlayerWrapper() {
		this.renderRoot.querySelector<HTMLElement>('#player-wrapper')!.innerHTML =
			'<div id=player></div>';
	}

	fullscreen() {
		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			this.#player.getIframe().requestFullscreen();
		}
	}
}

export const youtubeVideo = new YouTubeVideo();
