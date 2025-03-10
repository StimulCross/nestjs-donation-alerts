import node from '@stimulcross/eslint-config-node';
import nodeStyle from '@stimulcross/eslint-config-node/style';
import typescript from '@stimulcross/eslint-config-typescript';
import typescriptStyle from '@stimulcross/eslint-config-typescript/style';

const globs = {
	js: ['**/*.js', '**/*.cjs', '**/*.mjs'],
	ts: ['**/*.ts', '**/*.cts', '**/*.mts'],
	jsSpec: ['**/*.spec.js', '**/*.spec.cjs', '**/*.spec.mjs'],
	tsSpec: ['**/*.spec.ts', '**/*.spec.cts', '**/*.spec.mts'],
	lib: '**/lib',
	nodeModules: '**/node_modules',
};

/** @type {import("eslint").Linter.Config[]} */
const config = [
	{
		ignores: [globs.lib, globs.nodeModules, '**/*.d.ts'],
	},
	{
		...node,
		files: [...globs.js, ...globs.ts],
		rules: {
			'unicorn/no-await-expression-member': 'off',
		},
	},
	{
		...nodeStyle,
		files: [...globs.js, ...globs.ts],
	},
	{
		...typescript,
		files: [...globs.ts],
		rules: {
			'@typescript-eslint/explicit-member-accessibility': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/unified-signatures': 'off',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/require-await': 'off',
		},
	},
	{
		...typescriptStyle,
		files: [...globs.ts],
	},
	{
		files: ['tests/**'],
		rules: {
			'id-length': 'off',
			'no-console': 'off',
		},
	},
];

export default config;
