import {ReactiveController} from '@snar/lit';
import {MGamepad, MiniGamepad, Mode} from '@vdegenne/mini-gamepad';
import {state} from 'lit/decorators.js';
import {store} from './store.js';
import {getYouTubeVideoElement} from './utils.js';

class GamepadController extends ReactiveController {
	@state() gamepad: MGamepad | undefined;

	get mapping() {
		return this.gamepad?.mapping;
	}

	constructor() {
		super();
		const minigp = new MiniGamepad({
			// pollSleepMs: 900,
			toastModel: false,
			focusDeadTimeMs: 200,
		});
		minigp.onConnect((gamepad) => {
			this.gamepad = gamepad;
			const {
				LEFT_STICK_LEFT,
				LEFT_STICK_RIGHT,
				RIGHT_STICK_LEFT,
				RIGHT_STICK_RIGHT,
				RIGHT_BUTTONS_BOTTOM,
				RIGHT_BUTTONS_RIGHT,
				L1,
				LEFT_BUTTONS_RIGHT,
				LEFT_BUTTONS_BOTTOM,
				RIGHT_BUTTONS_LEFT,
				R1,
				LEFT_BUTTONS_LEFT,
				RIGHT_BUTTONS_TOP,
				MIDDLE_LEFT,
			} = gamepad.model.mapping;

			gamepad.for(LEFT_STICK_LEFT).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break;
					case Mode.PRIMARY:
						break;
					case Mode.SECONDARY:
						break;
					case Mode.TERTIARY:
						break;
				}
			});
			gamepad.for(LEFT_STICK_RIGHT).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break;
					case Mode.TERTIARY:
						break;
				}
			});

			gamepad.for(RIGHT_STICK_LEFT).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break;
				}
			});
			gamepad.for(RIGHT_STICK_RIGHT).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break;
				}
			});

			gamepad.for(RIGHT_BUTTONS_TOP).before(async ({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break;
				}
			});

			gamepad.for(RIGHT_BUTTONS_BOTTOM).before(async ({mode}) => {
				const video = await getYouTubeVideoElement();
				switch (mode) {
					case Mode.NORMAL:
						video.rewind(store.tinyStep);
						break;
					case Mode.PRIMARY:
						video.rewind(1 / 30);
						break;
				}
			});

			gamepad.for(RIGHT_BUTTONS_LEFT).before(async ({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						(await getYouTubeVideoElement()).fullscreen();
						break;
				}
			});

			gamepad.for(RIGHT_BUTTONS_RIGHT).before(async ({mode}) => {
				const video = await getYouTubeVideoElement();
				switch (mode) {
					case Mode.NORMAL:
						video.fastForward(store.tinyStep);
						break;
					case Mode.PRIMARY:
						video.fastForward(1 / 30);
						break;
				}
			});

			gamepad.for(L1).before(async ({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						(await getYouTubeVideoElement()).toggle();
						break;
					case Mode.SECONDARY:
						(await getYouTubeVideoElement()).decreasePlaybackRate();
						break;
				}
			});
			gamepad.for(R1).before(async ({mode}) => {
				switch (mode) {
					case Mode.PRIMARY:
						(await getYouTubeVideoElement()).decreasePlaybackRate();
						break;
				}
			});

			gamepad.for(LEFT_BUTTONS_LEFT).before(async ({mode}) => {
				const video = await getYouTubeVideoElement();
				switch (mode) {
					case Mode.NORMAL:
						video.rewind(store.smallStep);
						break;
					case Mode.PRIMARY:
						video.rewind(store.bigStep);
						break;
					case Mode.SECONDARY:
						break;
				}
			});
			gamepad.for(LEFT_BUTTONS_RIGHT).before(async ({mode}) => {
				const video = await getYouTubeVideoElement();
				switch (mode) {
					case Mode.NORMAL:
						video.fastForward(store.smallStep);
						break;
					case Mode.PRIMARY:
						video.fastForward(store.bigStep);
						break;
					case Mode.SECONDARY:
						break;
				}
			});

			gamepad.for(LEFT_BUTTONS_BOTTOM).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break;
					case Mode.PRIMARY:
						break;
				}
			});

			gamepad.for(MIDDLE_LEFT).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break;

					default:
						break;
				}
			});
		});
	}
}

export const gamepadCtrl = new GamepadController();
