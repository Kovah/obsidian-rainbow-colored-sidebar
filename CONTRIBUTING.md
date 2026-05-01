# Contributing

Contributions are welcome. Keep changes focused and easy to review.

## Adding Color Schemes

Color schemes live in `color-schemes.ts`. To add one:

1. Add a new exported `ColorScheme` constant.
2. Give it a clear `name`, `author`, `category`, and exactly 16 colors.
3. Add the new constant to the exported `schemes` object.
4. Run `npm run preview` to regenerate `preview-color-schemes.svg`.
5. Run `npm run build` to verify the plugin still builds.

Example:

```ts
export const csMyTheme: ColorScheme = {
	name: 'My Theme',
	author: 'Your Name <your@email.example>',
	category: 'special',
	colors: [
		'#111111',
		'#222222',
		'#333333',
		'#444444',
		'#555555',
		'#666666',
		'#777777',
		'#888888',
		'#999999',
		'#aaaaaa',
		'#bbbbbb',
		'#cccccc',
		'#dddddd',
		'#eeeeee',
		'#ffffff',
		'#000000',
	],
};
```

Available categories:

- `normal`
- `special`
- `light-ui`
- `dark-ui`

## New Features

New features must be tested properly before opening a pull request.

Test on:

- Obsidian desktop
- Obsidian mobile

Your pull request should include:

- A clear description of the change.
- Why the change is useful.
- Screenshots or screen recordings where the UI changes.
- Notes about desktop and mobile testing.
- Any known limitations or follow-up work.

Run this before submitting:

```bash
npm run build
```
