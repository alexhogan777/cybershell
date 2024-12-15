// Astal
import { Gtk } from 'astal/gtk3';
import { bind, Binding } from 'astal';

// Libraries
import Apps from 'gi://AstalApps';

// Config
import { userConfig } from '../../../config/user_config';

// Functions
import { getFriendlySearchEngine } from '../../../utils/friendly';
import {
  executeSelectedSearchItem,
  query,
  selectedSearchItem,
} from './functions';
import { playSound } from '../../../utils/play_sound';

// Widgets
import { MaterialIcon } from '../../common/MaterialIcon';

export const Result = (
  type: 'app' | 'web' | 'command' | 'pinned-app',
  app?: Apps.Application
) => {
  let name: string | Binding<string> = '';
  let description: string | Binding<string> = '';
  let icon = <box />;

  if (app) {
    name = app.name;
    description = app.description;
    icon = (
      <icon
        css='font-size: 2em;'
        icon={app.iconName ? app.iconName : 'kitty'}
      />
    );
  }
  if (!app && type === 'command') {
    const terminal = userConfig.panel.search.terminal;

    name = 'Execute command';
    description = bind(query).as(
      (v) => `Run "${v}" in ${terminal.slice(0, terminal.indexOf('-') - 1)}`
    );
    icon = <MaterialIcon icon='terminal' size={2} />;
  }
  if (!app && type === 'web') {
    const searchEngine = userConfig.panel.search.searchEngine;

    name = 'Search the web';
    description = bind(query).as(
      (v) => `Search ${getFriendlySearchEngine(searchEngine)} for "${v}".`
    );

    icon = <MaterialIcon icon='public' size={2} />;
  }

  const hasDescription = description !== null;
  const Icon = () => {
    return icon;
  };
  const Name = () => {
    return (
      <label
        className={`title ${hasDescription && 'with-description'}`}
        label={name}
        xalign={0}
        valign={Gtk.Align.CENTER}
      />
    );
  };
  const Description = () => {
    return (
      <label
        className='description'
        label={description}
        xalign={0}
        valign={Gtk.Align.CENTER}
        truncate={true}
      />
    );
  };
  return (
    <button
      name={type}
      className={bind(selectedSearchItem).as(
        (ssi) =>
          `search-result ${
            ssi?.type === type && ssi.app === app ? 'selected' : ''
          }`
      )}
      cursor='pointer'
      //@ts-expect-error
      tooltipText={app ? `${app?.app.filename}` : ''}
      onClick={() => {
        executeSelectedSearchItem();
      }}
      onHover={() => {
        playSound('hover');
        selectedSearchItem.set({ type: type, app: app && app });
      }}
      onHoverLost={() => {
        selectedSearchItem.set(null);
      }}
    >
      <box spacing={userConfig.appearance.spacing * 2}>
        <Icon />
        <box vertical valign={Gtk.Align.CENTER}>
          <Name />
          {hasDescription && <Description />}
        </box>
      </box>
    </button>
  );
};
