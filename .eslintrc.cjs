module.exports = {
	env: {
		es2021: true,
		node: true,
		jest: true
	},
	extends: 'eslint:recommended',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	rules: {
		indent: [
			'error',
			'tab'
		],
		'linebreak-style': [
			'warn',
			'windows'
		],
		quotes: [
			'error',
			'single'
		],
		semi: [
			'error',
			'always'
		],
		'object-curly-spacing': [
			'error',
			'always'
		],
		'space-before-blocks': [
			'error',
			'always'
		],
		'max-len': [
			'error',
			{
				code: 100,
				tabWidth: 2,
				ignoreUrls: true 
			}
		],
		'object-curly-newline': ['error', {
			ObjectExpression: 'always',
			ObjectPattern: {
				multiline: true 
			},
			ImportDeclaration: 'never',
			ExportDeclaration: {
				multiline: true,
				minProperties: 3 
			}
		}],
		'max-statements-per-line': [
			'error',
			{
				max: 1
			}
		],
		'eol-last': [
			'error',
			'always'
		],
		'quote-props': [
			'warn',
			'as-needed',
			{
				unnecessary: true
			}
		],
		'object-property-newline': [
			'error',
			{
				allowAllPropertiesOnSameLine: false
			}
		]
	}
};
