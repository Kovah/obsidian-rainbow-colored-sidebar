import {App, Plugin, PluginSettingTab, Setting, AbstractInputSuggest} from 'obsidian';
import {schemeCategoryNames, schemeCategoryOrder, schemes} from './color-schemes';

interface RainbowColoredSidebarSettings {
	scheme: string;
	increaseContrast: boolean;
	folderList: string[];
}

const DEFAULT_SETTINGS: RainbowColoredSidebarSettings = {
	scheme: 'csDefault',
	increaseContrast: false,
	folderList: [],
};

export default class RainbowColoredSidebar extends Plugin {
	settings: RainbowColoredSidebarSettings = DEFAULT_SETTINGS;
	mutationObserver: MutationObserver | null = null;
	mutationTimeout: number | null = null;
	mutationTimeoutWindow: Window | null = null;

	async onload() {
		await this.loadSettings();

		this.app.workspace.onLayoutReady(this.boot.bind(this));
		this.registerEvent(this.app.workspace.on('layout-change', this.boot.bind(this)));

		this.addSettingTab(new RainbowColoredSidebarSettingTab(this.app, this));
	}

	async boot() {
		await this.setColorScheme();
		await this.setFolderStyling();
		this.registerFileTreeObserver();
	}

	onunload() {
		this.mutationObserver?.disconnect();
		this.clearMutationTimeout();
		const doc = activeDocument;

		schemes[this.settings.scheme].colors.forEach((color, index) => {
			doc.documentElement.style.removeProperty(`--rcs-color-${index + 1}`);
		});
		doc.documentElement.removeAttribute('data-rcs-a11y');

		this.resetFolderStyling();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		await this.setColorScheme();
		this.resetFolderStyling();
		await this.setFolderStyling();
	}

	async setColorScheme() {
		// Add the actual colors as CSS variables to the document root
		const doc = activeDocument;
		const newScheme = schemes[this.settings.scheme].colors;
		newScheme.forEach((color, index) => {
			doc.documentElement.style.setProperty(`--rcs-color-${index + 1}`, color);
		});

		if (this.settings.increaseContrast) {
			doc.documentElement.setAttribute('data-rcs-a11y', '1');
		} else {
			doc.documentElement.removeAttribute('data-rcs-a11y');
		}
	}

	async setFolderStyling() {
		const doc = activeDocument;
		const colorCount = schemes[this.settings.scheme].colors.length;

		// Get all folders from the root path, child folders are not needed here
		// Then filter out invisible folders, and sort alphanumerically
		const folders = (await this.app.vault.adapter.list('/')).folders
			.filter((folder) =>
				!folder.startsWith('.')
			)
			.sort((a, b) => a.localeCompare(b, undefined, {
				numeric: true,
				caseFirst: 'lower'
			}));
		if (folders) {
			for (let i = 0; i < folders.length; i++) {
				// Add rcs-item-x classes to all folders based on data-path with the active scheme repeating indefinitely
				const classIndex = (i % colorCount) + 1;
				doc.querySelector(`[data-path="${folders[i]}"]`)?.parentElement?.classList.add(`rcs-item-${classIndex}`);
			}
		}

		// Get specific folders form setting for independent color rendering
		const sub_folders = this.settings.folderList;
		if (sub_folders) {
			for (let i = 0; i < sub_folders.length; i++){
				const ext = (await this.app.vault.adapter.list(sub_folders[i])).folders
					.filter((folder) => folder !== this.app.vault.configDir);

				// Try to obtain the index of rcs-item that parent using
				const parent_folder = sub_folders[i].split("/")[0];
				let parent_rcs_index: string | undefined;
				const parentElement = doc.querySelector(`[data-path="${parent_folder}"]`)?.parentElement;
				if (parentElement) {
					parent_rcs_index = Array.from(parentElement.classList)
						.find((item) => /^rcs-item-\d+$/.test(item));

					// Calculate a new starting index to avoid color conflict with parent's siblings
					if (parent_rcs_index){
						const new_rcs_index = Number(parent_rcs_index.replace('rcs-item-', ''));

						for (let j=0; j < ext.length; j++){
							const classIndex = ((new_rcs_index + 1 + j) % colorCount) + 1;
							doc.querySelector(`[data-path="${ext[j]}"]`)?.parentElement?.classList.add(`rcs-item-${classIndex}`);
							doc.querySelector(`[data-path="${ext[j]}"]`)?.parentElement?.classList.add('rcs-sub-item');
						}
					}
				}
			}
		}
	}

	resetFolderStyling() {
		// Remove all previously added rcs- classes from items in the file explorer to get a clean state to work with
		activeDocument.querySelectorAll('.tree-item[class*="rcs-"]').forEach(item => {
			Array.from(item.classList).filter(cls => cls.startsWith('rcs-'))
				.forEach(cls => item.classList.remove(cls));
		});
	}

	// Add a JS mutation observer to catch the folder list changing when the user scrolls
	registerFileTreeObserver() {
		// Remove possible previous observers after a layout change
		this.mutationObserver?.disconnect();
		this.clearMutationTimeout();

		// Register a new observer on the .nav-files-container node
		const targetNode = activeDocument.querySelector('.nav-files-container');
		if (!targetNode) return;

		this.mutationObserver = new MutationObserver(() => {
			// Instead of running on every known mutation, debounce the folder styling by 200ms
			this.clearMutationTimeout();

			const win = activeWindow;
			this.mutationTimeoutWindow = win;
			this.mutationTimeout = win.setTimeout(async () => {
				await this.setFolderStyling();
			}, 200);
		});

		this.mutationObserver.observe(targetNode, {
			childList: true,
			subtree: true,
		});
	}

	clearMutationTimeout() {
		if (this.mutationTimeout === null) return;

		this.mutationTimeoutWindow?.clearTimeout(this.mutationTimeout);
		this.mutationTimeout = null;
		this.mutationTimeoutWindow = null;
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
		for (const category of schemeCategoryOrder) {
			const categorySchemes = Object.entries(schemes).filter(([, scheme]) => scheme.category === category);
			if (categorySchemes.length === 0) continue;

			const categoryEl = csSelect.controlEl.createEl('div', {attr: {class: 'rcs-scheme-category'}});
			categoryEl.createEl('div', {text: schemeCategoryNames[category], attr: {class: 'rcs-scheme-category-title'}});
			const optionsEl = categoryEl.createEl('div', {attr: {class: 'rcs-scheme-category-options'}});

			for (const [schemeName, scheme] of categorySchemes) {
				const radioEl = optionsEl.createEl('label', {attr: {class: 'rcs-scheme-input'}});
				const input = radioEl.createEl('input', {
					attr: {
						name: 'rcs-scheme-radio',
						type: 'radio',
						value: schemeName,
						title: `Author: ${scheme.author}`,
					}
				});
				input.addEventListener('change', this.changeColorScheme.bind(this));
				if (this.plugin.settings.scheme === schemeName) input.setAttribute('checked', 'checked');
				radioEl.createEl('span', {text: scheme.name});
				const stripeEl = radioEl.createEl('div', {attr: {class: 'rcs-color-stripe'}});
				scheme.colors.forEach(color => {
					stripeEl.createEl('div', {attr: {style: 'background-color:' + color}});
				});
			}
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

		new Setting(containerEl)
			.setHeading()
			.setName('Enable Independent Color Scheme for Specific Folders')
			.setDesc('This restarts the color scheme for selected sub folders to distinguish them from top level folders.');

		new Setting(containerEl)
			.setDesc('List of folders')
			.addExtraButton((button) => {
				button.extraSettingsEl.setAttribute('aria-label', 'Add folder');
				button.extraSettingsEl.setAttribute('title', 'Add folder');
				button
					.setIcon('plus')
					.onClick(() => {
						this.plugin.settings.folderList.push('');
						this.display();
					});
			});

		for (let i = 0; i < this.plugin.settings.folderList.length; i++) {
			new Setting(containerEl)
				.addSearch(search => {
					search
						.setPlaceholder('Example: folder1/folder2')
						.setValue(this.plugin.settings.folderList[i])
						.onChange(async (value) => {
							this.plugin.settings.folderList[i] = value;
							await this.plugin.saveSettings();
						});

					// Add folder suggestions
					new FolderSuggest(this.app, search.inputEl);
				})
				.addExtraButton((button) => {
					button.extraSettingsEl.setAttribute('aria-label', 'Remove this folder');
					button.extraSettingsEl.setAttribute('title', 'Remove this folder');
					button
						.setIcon('trash')
						.onClick(async () => {
							this.plugin.settings.folderList.splice(i, 1);
							await this.plugin.saveSettings();
							this.display();
						});
				});
		}

		containerEl.createEl('br');
		containerEl.createEl('hr');
		containerEl.createEl('small').innerHTML = '❤️ Support my work via <a href="https://patreon.com/Kovah" target="_blank">Patreon</a>, <a href="https://github.com/Kovah" target="_blank">GitHub Sponsors</a> or <a href="https://liberapay.com/kovah" target="_blank">Liberapay</a>';
	}

	async changeColorScheme(event: Event) {
		this.plugin.settings.scheme = (event.target as HTMLInputElement).value;
		await this.plugin.saveSettings();
	}
}

class FolderSuggest extends AbstractInputSuggest<string> {
    private folders: string[];

    constructor(app: App, private inputEl: HTMLInputElement) {
        super(app, inputEl);
        // Get all folders and include root folder
        this.folders = ["/"].concat(this.app.vault.getAllFolders().map(folder => folder.path));
    }

    getSuggestions(inputStr: string): string[] {
        const inputLower = inputStr.toLowerCase();
        return this.folders.filter(folder =>
            folder.toLowerCase().includes(inputLower)
        );
    }

    renderSuggestion(folder: string, el: HTMLElement): void {
        el.createEl("div", { text: folder });
    }

    selectSuggestion(folder: string): void {
        this.inputEl.value = folder;
        const event = new Event('input');
        this.inputEl.dispatchEvent(event);
        this.close();
    }
}
