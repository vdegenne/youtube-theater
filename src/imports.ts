import {getElement} from 'html-vision';
import {type SettingsDialog} from './settings/settings-dialog.js';

export async function getThemeStore() {
	const {themeStore} = await import('./styles/themeStore.js');
	return themeStore;
}

export async function getSettingsDialog() {
	try {
		const dialog = await getElement<SettingsDialog>('settings-dialog');
		return dialog;
	} catch {
		const {settingsDialog} = await import('./settings/settings-dialog.js');
		return settingsDialog;
	}
}

export async function openSettingsDialog() {
	const dialog = await getSettingsDialog();
	dialog.show();
}
