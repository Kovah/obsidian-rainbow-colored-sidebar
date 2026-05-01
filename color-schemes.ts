export type ColorSchemeCategory = 'normal' | 'special' | 'light-ui' | 'dark-ui';

export interface ColorScheme {
	name: string;
	author: string;
	category: ColorSchemeCategory;
	colors: string[];
}

export const csDefault: ColorScheme = {
	name: 'Default',
	author: 'Kevin Woblick <mail@woblick.dev>',
	category: 'normal',
	colors: [
		'#7dcf02',
		'#00c851',
		'#00bc7c',
		'#00bba7',
		'#00b8db',
		'#00a6f5',
		'#2a7fff',
		'#615fff',
		'#ad46ff',
		'#e12afb',
		'#f6329b',
		'#ff2056',
		'#fa2b37',
		'#ff6801',
		'#fd9a02',
		'#f0b102',
	],
};

export const csA11y: ColorScheme = {
	name: 'A11y',
	author: 'Kevin Woblick <mail@woblick.dev>',
	category: 'normal',
	colors: [
		'#7dcf02',
		'#00bc7c',
		'#00b8db',
		'#2a7fff',
		'#ad46ff',
		'#f6329b',
		'#fa2b37',
		'#fd9a02',
		'#fa2b37',
		'#f6329b',
		'#ad46ff',
		'#2a7fff',
		'#00b8db',
		'#00bc7c',
		'#7dcf02',
		'#00bc7c',
	],
};

export const csRed: ColorScheme = {
	name: 'Red',
	author: 'Kevin Woblick <mail@woblick.dev>',
	category: 'normal',
	colors: [
		'#ff2056',
		'#fa2b37',
		'#ff6801',
		'#fd9a02',
		'#f0b102',
		'#7dcf02',
		'#00c851',
		'#00bc7c',
		'#00bba7',
		'#00b8db',
		'#00a6f5',
		'#2a7fff',
		'#615fff',
		'#ad46ff',
		'#e12afb',
		'#f6329b',
	],
};

export const csPurple: ColorScheme = {
	name: 'Purple',
	author: 'Kevin Woblick <mail@woblick.dev>',
	category: 'normal',
	colors: [
		'#ad46ff',
		'#e12afb',
		'#f6329b',
		'#ff2056',
		'#fa2b37',
		'#ff6801',
		'#fd9a02',
		'#f0b102',
		'#7dcf02',
		'#00c851',
		'#00bc7c',
		'#00bba7',
		'#00b8db',
		'#00a6f5',
		'#2a7fff',
		'#615fff',
	],
};

export const csYellow: ColorScheme = {
	name: 'Yellow',
	author: 'Kevin Woblick <mail@woblick.dev>',
	category: 'normal',
	colors: [
		'#fd9a02',
		'#f0b102',
		'#7dcf02',
		'#00c851',
		'#00bc7c',
		'#00bba7',
		'#00b8db',
		'#00a6f5',
		'#2a7fff',
		'#615fff',
		'#ad46ff',
		'#e12afb',
		'#f6329b',
		'#ff2056',
		'#fa2b37',
		'#ff6801',
	],
};

export const csBlue: ColorScheme = {
	name: 'Blue',
	author: 'Kevin Woblick <mail@woblick.dev>',
	category: 'normal',
	colors: [
		'#00b8db',
		'#00a6f5',
		'#2a7fff',
		'#615fff',
		'#ad46ff',
		'#e12afb',
		'#f6329b',
		'#ff2056',
		'#fa2b37',
		'#ff6801',
		'#fd9a02',
		'#f0b102',
		'#7dcf02',
		'#00c851',
		'#00bc7c',
		'#00bba7',
	],
};

export const csMixed: ColorScheme = {
	name: 'Mixed',
	author: 'Kevin Woblick <mail@woblick.dev>',
	category: 'special',
	colors: [
		'#00b8db',
		'#f6329b',
		'#7dcf02',
		'#fa2b37',
		'#2a7fff',
		'#ad46ff',
		'#00a6f5',
		'#ff6801',
		'#615fff',
		'#e12afb',
		'#00c851',
		'#fd9a02',
		'#00bba7',
		'#ff2056',
		'#f0b102',
		'#00bc7c',
	],
};

export const csBlueWave: ColorScheme = {
	name: 'Blue Wave',
	author: 'Kevin Woblick <mail@woblick.dev>',
	category: 'special',
	colors: [
		'#00bc7c',
		'#00bba7',
		'#00b8db',
		'#00a6f5',
		'#2a7fff',
		'#615fff',
		'#2a7fff',
		'#00a6f5',
		'#00b8db',
		'#00bba7',
		'#00bc7c',
		'#00bba7',
		'#00b8db',
		'#00a6f5',
		'#2a7fff',
		'#615fff',
	],
};

export const csSummerVibes: ColorScheme = {
	name: 'Summer Vibes',
	author: 'Kevin Woblick <mail@woblick.dev>',
	category: 'special',
	colors: [
		'#ff2056',
		'#fa2b37',
		'#ff6801',
		'#fd9a02',
		'#f0b102',
		'#fd9a02',
		'#ff6801',
		'#fa2b37',
		'#ff2056',
		'#fa2b37',
		'#ff6801',
		'#fd9a02',
		'#f0b102',
		'#fd9a02',
		'#ff6801',
		'#fa2b37',
	],
};

export const csPinkBlossom: ColorScheme = {
	name: 'Pink Blossom',
	author: 'Kevin Woblick <mail@woblick.dev>',
	category: 'special',
	colors: [
		'#f9a8d4',
		'#f472b6',
		'#ec4899',
		'#db2777',
		'#be185d',
		'#fb7185',
		'#fda4af',
		'#fbcfe8',
		'#e879f9',
		'#d946ef',
		'#c026d3',
		'#a21caf',
		'#fb6f92',
		'#ff8fab',
		'#ffb3c6',
		'#ffc2d1',
	],
};

export const csCyberpunk: ColorScheme = {
	name: 'Cyberpunk',
	author: 'Kevin Woblick <mail@woblick.dev>',
	category: 'special',
	colors: [
		'#f9f871',
		'#facc15',
		'#ff7a00',
		'#ff2a6d',
		'#d300c5',
		'#8f00ff',
		'#5b5cff',
		'#05d9e8',
		'#00f5d4',
		'#39ff14',
		'#b6ff00',
		'#fee440',
		'#ff9f1c',
		'#ff3864',
		'#bf00ff',
		'#00bbf9',
	],
};

export const csNoirCarnival: ColorScheme = {
	name: 'Noir Carnival',
	author: 'Kevin Woblick <mail@woblick.dev>',
	category: 'special',
	colors: [
		'#0f172a',
		'#18181b',
		'#1f2937',
		'#312e81',
		'#4c1d95',
		'#581c87',
		'#14532d',
		'#166534',
		'#365314',
		'#3f6212',
		'#713f12',
		'#7f1d1d',
		'#831843',
		'#701a75',
		'#4a044e',
		'#111827',
	],
};

export const csPastel: ColorScheme = {
	name: 'Pastel',
	author: 'rookledookle <https://github.com/rookledookle>',
	category: 'normal',
	colors: [
		'#c5e870',  // pastel lime
		'#7ee8aa',  // pastel mint
		'#7ee8d0',  // pastel teal mint
		'#7ae8e4',  // pastel teal
		'#7acff0',  // pastel sky
		'#7abbf5',  // pastel cornflower
		'#8aadff',  // pastel blue
		'#a8a8ff',  // pastel periwinkle
		'#cc8aff',  // pastel purple
		'#e88aff',  // pastel violet
		'#ff8ace',  // pastel pink
		'#ff8aaa',  // pastel rose
		'#ff9090',  // pastel salmon
		'#ffb080',  // pastel peach
		'#ffcc80',  // pastel apricot
		'#ffe080',  // pastel yellow
	],
};

export const csMuted: ColorScheme = {
	name: 'Muted',
	author: 'rookledookle <https://github.com/rookledookle>',
	category: 'normal',
	colors: [
		'#6aaa28',  // muted olive green
		'#28965a',  // muted forest green
		'#28967c',  // muted teal
		'#289698',  // muted slate teal
		'#2888b0',  // muted steel blue
		'#2878c8',  // muted blue
		'#4868c8',  // muted medium blue
		'#6058c8',  // muted slate blue
		'#8848c8',  // muted purple
		'#aa30c8',  // muted magenta
		'#c83080',  // muted cranberry
		'#c83050',  // muted crimson
		'#c83038',  // muted brick red
		'#c86020',  // muted rust
		'#c88820',  // muted ochre
		'#c8a020',  // muted golden
	],
};

export const csDarkGarden: ColorScheme = {
	name: 'Dark Garden',
	author: 'Kevin Woblick <mail@woblick.dev>',
	category: 'light-ui',
	colors: [
		'#5b8f22',
		'#328a4d',
		'#24896e',
		'#1f8790',
		'#2c7fa8',
		'#3d73bd',
		'#5d66bd',
		'#7a5aac',
		'#9b4d91',
		'#b54874',
		'#c84e58',
		'#c95f36',
		'#bd7728',
		'#a88b24',
		'#81952d',
		'#5b9640',
	],
};

export const csDarkInk: ColorScheme = {
	name: 'Dark Ink',
	author: 'Kevin Woblick <mail@woblick.dev>',
	category: 'light-ui',
	colors: [
		'#2f855a',
		'#2c7a7b',
		'#2b6cb0',
		'#4c51bf',
		'#6b46c1',
		'#97266d',
		'#b83280',
		'#c53030',
		'#c05621',
		'#b7791f',
		'#859900',
		'#5f9b3d',
		'#25855a',
		'#247a86',
		'#2f6aa3',
		'#5a5bb5',
	],
};

export const csLightGlow: ColorScheme = {
	name: 'Light Glow',
	author: 'Kevin Woblick <mail@woblick.dev>',
	category: 'dark-ui',
	colors: [
		'#a3e635',
		'#4ade80',
		'#2dd4bf',
		'#22d3ee',
		'#38bdf8',
		'#60a5fa',
		'#818cf8',
		'#a78bfa',
		'#c084fc',
		'#e879f9',
		'#f472b6',
		'#fb7185',
		'#f87171',
		'#fb923c',
		'#fbbf24',
		'#fde047',
	],
};

export const csLightEmber: ColorScheme = {
	name: 'Light Ember',
	author: 'Kevin Woblick <mail@woblick.dev>',
	category: 'dark-ui',
	colors: [
		'#f97316',
		'#fb7185',
		'#e879f9',
		'#a78bfa',
		'#60a5fa',
		'#22d3ee',
		'#2dd4bf',
		'#4ade80',
		'#a3e635',
		'#facc15',
		'#fb923c',
		'#f87171',
		'#f472b6',
		'#c084fc',
		'#818cf8',
		'#38bdf8',
	],
};

export const schemeCategoryOrder: ColorSchemeCategory[] = ['normal', 'special', 'light-ui', 'dark-ui'];

export const schemeCategoryNames: Record<ColorSchemeCategory, string> = {
	normal: 'Normal',
	special: 'Special',
	'light-ui': 'Light User Interface',
	'dark-ui': 'Dark User Interface',
};

export const schemes: { [key: string]: ColorScheme } = {
	csDefault,
	csA11y,
	csRed,
	csYellow,
	csPurple,
	csBlue,
	csMixed,
	csBlueWave,
	csSummerVibes,
	csPinkBlossom,
	csCyberpunk,
	csNoirCarnival,
	csPastel,
	csMuted,
	csDarkGarden,
	csDarkInk,
	csLightGlow,
	csLightEmber,
};
