// Astal
import { Astal, Gtk } from 'astal/gtk3';

// Config
import Config from '../../../state/config/config';
const spacing = Config.get_default().appearance.paddingBase;
const BLUETOOTH_SETTINGS = Config.get_default().apps.bluetoothSettings;

// Functions
import { execAsyncClose } from '../../../utils/execClose';

// Widgets
import { Subsection } from './main';
import { XButton } from '../../common/XButton';
import { MaterialIcon } from '../../common/MaterialIcon';

export const Bluetooth = () => {
  return (
    <Subsection subsection='Bluetooth'>
      <box spacing={spacing}>
        <XButton
          onClick={(self: Astal.Button, event: Astal.ClickEvent) => {
            if (event.button === Astal.MouseButton.PRIMARY) {
              execAsyncClose(BLUETOOTH_SETTINGS);
            }
          }}
        >
          <box
            hexpand
            spacing={spacing * 2}
            css='font-size: 1em; font-weight: bold;'
          >
            <label
              label='Open Bluetooth Settings'
              valign={Gtk.Align.BASELINE}
            />
            <MaterialIcon icon='open_in_new' size={1.25} />
          </box>
        </XButton>
      </box>
    </Subsection>
  );
};
