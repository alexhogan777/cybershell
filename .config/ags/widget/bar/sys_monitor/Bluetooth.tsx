// Astal
import { Gtk } from 'astal/gtk3';

// Libraries
import Bluetooth from 'gi://AstalBluetooth';
const bluetooth = Bluetooth.get_default();

// Widgets
import { XButton } from '../../common/XButton';

export const BluetoothMonitor = () => {
  const adapter = bluetooth.get_adapter();
  const devices = bluetooth.get_devices();
  const Content = () => {
    function getIcon() {
      if (devices?.map((d) => d.connecting).includes(true))
        return 'bluetooth_searching';
      if (adapter?.discovering) return 'bluetooth_searching';
      if (devices?.map((d) => d.connected).includes(true))
        return 'bluetooth_connected';
      if (adapter?.powered) return 'bluetooth';
      return 'bluetooth_disabled';
    }
    function getTooltip() {
      let message = [''];
      if (adapter?.powered) message = ['Bluetooth | On'];
      if (devices?.map((d) => d.connected).includes(true))
        message = [
          'Bluetooth | Connected',
          'Devices:',
          ...devices?.map((d) => `  ${d.alias}`),
        ];
      if (!adapter?.powered) message = ['Bluetooth | Off'];
      return message.join('\n');
    }
    return (
      <XButton
        iconObj={{
          icon: getIcon(),
        }}
        tooltipText={getTooltip()}
        // onClick={(self: Gtk.Button, event: Astal.ClickEvent) => {
        //   if (event.button === Astal.MouseButton.PRIMARY) {
        //     bluetooth.toggle();
        //   }
        // }}
      />
    );
  };

  return (
    <box
      halign={Gtk.Align.CENTER}
      setup={(self) => {
        function update() {
          self.child = <Content />;
        }

        self.hook(bluetooth, 'notify', update);
      }}
    >
      <Content />
    </box>
  );
};
