import {ReactiveController, state} from '@snar/lit';
import {saveToLocalStorage} from 'snar-save-to-local-storage';
import {FormBuilder} from '@vdegenne/forms/FormBuilder';

@saveToLocalStorage('youtube-theater')
export class AppStore extends ReactiveController {
	@state() page: Page = 'main';

	@state() smallStep = 4;
	@state() bigStep = 7;
}

const store = new AppStore();
const F = new FormBuilder(store);
export {store, F};
