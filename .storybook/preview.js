import { addParameters, addDecorator } from '@storybook/html';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);

addParameters({
  a11y: {
    config: {},
    options: {
      checks: { 'color-contrast': { options: { noScroll: true } } },
      restoreScroll: true,
    },
  },
  options: {
    showRoots: true,
    // storySort: (a, b) =>
    // a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
  docs: {
    iframeHeight: '200px',
  },
});