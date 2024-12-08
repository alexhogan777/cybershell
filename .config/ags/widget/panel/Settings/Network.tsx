import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { Variable, GLib, bind, Binding, execAsync } from 'astal';
import { userConfig } from '../../../config/user_config';
const { spacing } = userConfig.appearance;
import { Subsection } from './main';
import { XButton } from '../../common/XButton';
import { execAsyncClose } from '../../../utils/execClose';
import { MaterialIcon } from '../../common/MaterialIcon';

export const Network = () => {
  return (
    <Subsection subsection='Network'>
      <box spacing={spacing}>
        <XButton
          onClick={(self: Astal.Button, event: Astal.ClickEvent) => {
            if (event.button === Astal.MouseButton.PRIMARY) {
              execAsyncClose(userConfig.programs.wifiSettings);
            }
          }}
        >
          <box
            hexpand
            spacing={userConfig.appearance.spacing * 2}
            css='font-size: 1em; font-weight: bold;'
          >
            <label label='Open Wifi Settings' valign={Gtk.Align.BASELINE} />
            <MaterialIcon icon='open_in_new' size={1.25} />
          </box>
        </XButton>
        <XButton
          onClick={(self: Astal.Button, event: Astal.ClickEvent) => {
            if (event.button === Astal.MouseButton.PRIMARY) {
              execAsyncClose(userConfig.programs.networkSettings);
            }
          }}
        >
          <box
            hexpand
            spacing={userConfig.appearance.spacing * 2}
            css='font-size: 1em; font-weight: bold;'
          >
            <label label='Open Network Settings' valign={Gtk.Align.BASELINE} />
            <MaterialIcon icon='open_in_new' size={1.25} />
          </box>
        </XButton>
      </box>
    </Subsection>
  );
};
