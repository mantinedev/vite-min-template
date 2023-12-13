module.exports = {
	env: { browser: true, es2020: true },
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
	plugins: ['react-refresh', 'eslint-plugin-react'],
	rules: {
		'react-refresh/only-export-components': 'warn',
		'no-mixed-spaces-and-tabs': 'off',
		'react/jsx-curly-brace-presence': [
			1,
			{
				props: 'always',
				children: 'never',
			},
		],
	},
}
