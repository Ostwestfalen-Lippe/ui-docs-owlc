var path = require("path");

module.exports = {
    stories: ['./../storybook-html/**/*.stories.(js|mdx)', './../storybook-blazor/Pages/**/*.stories.(js|mdx)'],
    // stories: [ `${path.resolve(__dirname, '/../../storybook-html')}../*.stories.*`, path.resolve(__dirname, '/../../storybook-blazor/Pages/**/*.stories.*')],
    addons: [ 
        './.storybook/blazor-notifier-addon/register.js',
        '@storybook/addon-docs',
        '@storybook/addon-a11y',
        // '@storybook/addon-actions',
        // '@storybook/addon-backgrounds',
        // '@storybook/addon-events',
        // '@storybook/addon-jest',
        // '@storybook/addon-knobs',
        // '@storybook/addon-links',
        // '@storybook/addon-notes',
        // '@storybook/addon-options',
        // '@storybook/addon-storysource',
        // '@storybook/addon-viewport',
    ]
};