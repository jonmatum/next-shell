import noRawColors from './rules/no-raw-colors.js';

const plugin = {
  meta: {
    name: 'eslint-plugin-next-shell',
    version: '0.0.0',
  },
  rules: {
    'no-raw-colors': noRawColors,
  },
};

export default plugin;
