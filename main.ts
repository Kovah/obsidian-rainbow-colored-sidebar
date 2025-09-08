import {App, Plugin, PluginSettingTab, Setting, AbstractInputSuggest} from 'obsidian';
import {schemes} from './color-schemes';

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
	settings: RainbowColoredSidebarSettings;
	mutationObserver: MutationObserver;
	mutationTimeout: ReturnType<typeof setTimeout> | null;

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
		this.mutationObserver.disconnect();

		schemes[this.settings.scheme].forEach((color, index) => {
			document.documentElement.style.removeProperty(`--rcs-color-${index + 1}`);
		});
		document.documentElement.removeAttribute('data-rcs-a11y');
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
		const folders = (await this.app.vault.adapter.list('/')).folders
			.filter((folder) => folder !== this.app.vault.configDir);
		if (folders) {
			for (let i = 0; i < folders.length; i++) {
				// Add rcs-item-x classes to all folders based on data-path with the numbering being 1-16 repeating indefinitely
				const classIndex = (i % 16) + 1;
				document.querySelector(`[data-path="${folders[i]}"]`)?.parentElement?.classList.add(`rcs-item-${classIndex}`);
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
				const parentElement = document.querySelector(`[data-path="${parent_folder}"]`)?.parentElement;
				if (parentElement) {
					parent_rcs_index = Array.from(parentElement.classList)
						.filter((item) => item.includes('rcs-item'))[0];

					// Calculate a new starting index to avoid color conflict with parent's siblings
					if (parent_rcs_index){
						const new_rcs_index = Number(parent_rcs_index[parent_rcs_index.length-1] + 1);

						for (let j=0; j < ext.length; j++){
							const classIndex = ((new_rcs_index + 1 + j)% 16) + 1;
							document.querySelector(`[data-path="${ext[j]}"]`)?.parentElement?.classList.add(`rcs-item-${classIndex}`);
							document.querySelector(`[data-path="${ext[j]}"]`)?.parentElement?.classList.add('sub-rcs');
						}
					}
				}
			}
		} 
	}

	// Add a JS mutation observer to catch the folder list changing when the user scrolls
	registerFileTreeObserver() {
		// Remove possible previous observers after a layout change
		this.mutationObserver?.disconnect();

		// Register a new observer on the .nav-files-container node
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
		
		new Setting(containerEl).setName('Enable Independent Color Scheme for Specific Folders').setHeading();

		new Setting(containerEl)
			.setDesc('List of folders (Reload App to take effect)')
			.addExtraButton((button) => {
				button
					.setIcon('plus')
					.setTooltip('Add folder')
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
					button
						.setIcon('trash')
						.setTooltip('Remove this folder')
						.onClick(() => {
							this.plugin.settings.folderList.splice(i, 1);
							this.plugin.saveSettings();
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
