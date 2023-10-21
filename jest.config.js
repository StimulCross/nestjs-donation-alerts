const transformPattern = '^.+\\.ts?$';
const transform = {
	[transformPattern]: ['ts-jest', { diagnostics: true, tsconfig: './tsconfig.json' }]
};

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	moduleFileExtensions: ['ts', 'js', 'node', 'json'],
	rootDir: './',
	testEnvironment: 'node',
	transform,
	testMatch: ['<rootDir>/tests/**/*.spec.ts'],
	coverageDirectory: '<rootDir>/coverage',
	collectCoverageFrom: [
		'<rootDir>/packages/*/src/**/*.ts',
		'!<rootDir>/packages/**/src/**/index.ts',
		'!<rootDir>/packages/**/src/constants.ts'
	],
	moduleDirectories: ['node_modules'],
	projects: []
};
