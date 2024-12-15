// Astal
import { Astal, Gtk } from 'astal/gtk3';

// Config
import { userConfig } from '../../../config/user_config';
import Config from '../../../state/config/config';
const spacing = Config.get_default().appearance.paddingBase;

// Functions
import { execAsyncClose } from '../../../utils/execClose';

// Widgets
import { Subsection } from './main';
import { XButton } from '../../common/XButton';
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
            spacing={spacing * 2}
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
            spacing={spacing * 2}
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
