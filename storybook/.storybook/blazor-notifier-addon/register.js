import { window } from 'global';
import { addons } from '@storybook/addons';
import { STORY_CHANGED, STORY_ERRORED, STORY_MISSING } from '@storybook/core-events';

const ADDON_ID = 'blazornotifier';
const PARAM_KEY = 'blazor-notifier';

addons.register(ADDON_ID, (api) => {
  api.on(STORY_CHANGED, (id) => {
    document.getElementById('storybook-preview-iframe').contentWindow.exampleJsFunctions.onStoryChanged(id);
  });
});