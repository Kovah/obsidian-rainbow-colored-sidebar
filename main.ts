import {App, Plugin, PluginSettingTab, Setting} from 'obsidian';
import {schemes} from './color-schemes';

interface RainbowColoredSidebarSettings {
	scheme: string;
	increaseContrast: boolean;
}

const DEFAULT_SETTINGS: RainbowColoredSidebarSettings = {
	scheme: 'csDefault',
	increaseContrast: false,
};

export default class RainbowColoredSidebar extends Plugin {
	settings: RainbowColoredSidebarSettings;
	mutationObserver: MutationObserver;
	mutationTimeout: ReturnType<typeof setTimeout> | null;

	async onload() {
		await this.loadSettings();
		await this.setColorScheme();
		await this.setFolderStyling();
		this.registerFileTreeObserver();

		this.addSettingTab(new RainbowColoredSidebarSettingTab(this.app, this));
	}

	onunload() {
		this.mutationObserver.disconnect();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		await this.setColorScheme();
		await this.setFolderStyling();
	}

	async setColorScheme() {
		// Add the actual colors as CSS variables to the document root
		const newScheme = schemes[this.settings.scheme];
		newScheme.forEach((color, index) => {
			document.documentElement.style.setProperty(`--rcs-color-${index + 1}`, color);
		});

		if (this.settings.increaseContrast) {
			document.documentElement.setAttribute('data-rcs-a11y', '1');
		} else {
			document.documentElement.removeAttribute('data-rcs-a11y');
		}
	}

	async setFolderStyling() {
		// Get all folders from the root path, child folders are not needed here
		const folders = (await this.app.vault.adapter.list('/')).folders.filter((folder) => folder !== '.obsidian');
		if (folders) {
			for (let i = 0; i < folders.length; i++) {
				// Add rcs-item-x classes to all folders based on data-path with the numbering being 1-16 repeating indefinitely
				const classIndex = (i % 16) + 1;
				document.querySelector(`[data-path="${folders[i]}"]`)?.parentElement?.classList.add(`rcs-item-${classIndex}`);
			}
		}
	}

	// Add a JS mutation observer to catch the folder list changing when the user scrolls
	registerFileTreeObserver() {
		const targetNode = document.querySelector('.nav-files-container') as Node;

		this.mutationObserver = new MutationObserver(() => {
			// Instead of running on every known mutation, debounce the folder styling by 200ms
			if (this.mutationTimeout) {
				clearTimeout(this.mutationTimeout);
			}
			this.mutationTimeout = setTimeout(async () => {
				await this.setFolderStyling();
			}, 200);
		});

		this.mutationObserver.observe(targetNode, {
			childList: true,
			subtree: true,
		});
	}
}

class RainbowColoredSidebarSettingTab extends PluginSettingTab {
	plugin: RainbowColoredSidebar;

	constructor(app: App, plugin: RainbowColoredSidebar) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();

		const csSelect = new Setting(containerEl)
			.setName('Color Scheme')
			.setDesc('Select the color scheme you want to use for your sidebar')
			.setClass('rcs-schemes');

		// Create inputs for all available color schemes
		for (const schemeName in schemes) {
			const radioEl = csSelect.controlEl.createEl('label', {attr: {class: 'rcs-scheme-input'}});
			const input = radioEl.createEl('input', {
				attr: {
					name: 'rcs-scheme-radio',
					type: 'radio',
					value: schemeName,
				}
			});
			input.addEventListener('change', this.changeColorScheme.bind(this));
			if (this.plugin.settings.scheme === schemeName) input.setAttribute('checked', 'checked');
			radioEl.createEl('span', {text: schemeName.replace('cs', '')});
			const stripeEl = radioEl.createEl('div', {attr: {class: 'rcs-color-stripe'}});
			schemes[schemeName].forEach(color => {
				stripeEl.createEl('div', {attr: {style: 'background-color:' + color}});
			});
		}

		new Setting(containerEl).setName('Accessibility').setHeading();

		new Setting(containerEl)
			.setName('Increase Contrast')
			.setDesc('This setting increases the contrast for the applied color scheme for better readability.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.increaseContrast)
				.onChange(async (value) => {
					this.plugin.settings.increaseContrast = value;
					await this.plugin.saveSettings();
				}));

		containerEl.createEl('br');
		containerEl.createEl('hr');
		containerEl.createEl('small').innerHTML = '❤️ Support my work via <a href="https://patreon.com/Kovah" target="_blank">Patreon</a>, <a href="https://github.com/Kovah" target="_blank">GitHub Sponsors</a> or <a href="https://liberapay.com/kovah" target="_blank">Liberapay</a>';
	}

	async changeColorScheme(event: Event) {
		this.plugin.settings.scheme = (event.target as HTMLInputElement).value;
		await this.plugin.saveSettings();
	}
}
