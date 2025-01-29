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

	async onload() {
		await this.loadSettings();
		this.setColorScheme();
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {
		// nothing to do here
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.setColorScheme();
	}

	setColorScheme() {
		console.info('Applying new color scheme: ' + this.settings.scheme);
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
}

class SampleSettingTab extends PluginSettingTab {
	plugin: RainbowColoredSidebar;

	constructor(app: App, plugin: RainbowColoredSidebar) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h1', {text: 'Rainbow Colored Sidebar'});
		containerEl.createEl('p').innerHTML = 'by <a href="https://kovah.de" target="_blank">Kevin Woblick</a>';
		containerEl.createEl('br');

		containerEl.createEl('h2', {text: 'Base Settings'});

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

		containerEl.createEl('br');

		containerEl.createEl('h2', {text: 'Accessibility'});

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
