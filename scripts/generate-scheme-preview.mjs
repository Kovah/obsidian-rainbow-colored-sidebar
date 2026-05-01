import {build} from 'esbuild';
import {writeFile} from 'node:fs/promises';

const OUTPUT_FILE = 'preview-color-schemes.svg';
const SWATCH_SIZE = 20;
const SWATCH_GAP = 2;
const LABEL_WIDTH = 168;
const ROW_HEIGHT = 34;
const CATEGORY_HEIGHT = 38;
const PADDING_X = 36;
const PADDING_Y = 34;

const result = await build({
	entryPoints: ['color-schemes.ts'],
	bundle: true,
	format: 'esm',
	platform: 'node',
	write: false,
	logLevel: 'silent',
});

const moduleUrl = `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`;
const {schemeCategoryNames, schemeCategoryOrder, schemes} = await import(moduleUrl);

const escapeXml = (value) => String(value)
	.replaceAll('&', '&amp;')
	.replaceAll('<', '&lt;')
	.replaceAll('>', '&gt;')
	.replaceAll('"', '&quot;');

const groupedSchemes = schemeCategoryOrder
	.map((category) => ({
		id: category,
		name: schemeCategoryNames[category],
		schemes: Object.values(schemes).filter((scheme) => scheme.category === category),
	}))
	.filter((category) => category.schemes.length > 0);

const swatchesWidth = (SWATCH_SIZE * 16) + (SWATCH_GAP * 15);
const width = PADDING_X * 2 + LABEL_WIDTH + swatchesWidth;
const contentHeight = groupedSchemes.reduce(
	(total, category) => total + CATEGORY_HEIGHT + category.schemes.length * ROW_HEIGHT,
	0,
);
const height = PADDING_Y * 2 + 48 + contentHeight;

let y = PADDING_Y;
const parts = [
	`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">`,
	`<title id="title">Rainbow-Colored Sidebar color schemes</title>`,
	`<desc id="desc">Preview of all available color schemes grouped by category.</desc>`,
	`<style>
		.preview-category {
			fill: #1f2937;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
			font-size: 15px;
			font-weight: 700;
		}

		.preview-scheme {
			fill: #111827;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
			font-size: 13px;
		}

		@media (prefers-color-scheme: dark) {
			.preview-category {
				fill: #e5e7eb;
			}

			.preview-scheme {
				fill: #f8fafc;
			}
		}
	</style>`,
];

for (const category of groupedSchemes) {
	y += CATEGORY_HEIGHT - 12;
	parts.push(`<text x="${PADDING_X}" y="${y}" class="preview-category">${escapeXml(category.name)}</text>`);
	y += 10;

	for (const scheme of category.schemes) {
		const labelY = y + 20;
		parts.push(`<text x="${PADDING_X}" y="${labelY}" class="preview-scheme">${escapeXml(scheme.name)}</text>`);

		let x = PADDING_X + LABEL_WIDTH;
		for (const color of scheme.colors) {
			parts.push(`<rect x="${x}" y="${y + 6}" width="${SWATCH_SIZE}" height="${SWATCH_SIZE}" rx="3" fill="${escapeXml(color)}"/>`);
			x += SWATCH_SIZE + SWATCH_GAP;
		}

		y += ROW_HEIGHT;
	}

	y += 8;
}

parts.push('</svg>');

await writeFile(OUTPUT_FILE, `${parts.join('\n')}\n`);
console.log(`Generated ${OUTPUT_FILE}`);
