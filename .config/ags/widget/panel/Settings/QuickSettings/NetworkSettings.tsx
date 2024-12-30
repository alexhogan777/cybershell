// Astal
import { execAsync, Gio, Variable, bind } from 'astal';

// Libraries
import Bluetooth from 'gi://AstalBluetooth';
import Network from 'gi://AstalNetwork';

// Functions
import { toggleEthernet, toggleWifi } from '../../../../utils/network_toggles';

// Widgets
import { QuickSetting } from './main';

const network = Network.get_default();
const wifiEnabled = Variable(Network.get_default().wifi.get_enabled() || false);
const wifi = network.get_wifi();
const wired = network.get_wired();

export const NetworkToggle = () => {
  const active = Variable(network.get_connectivity() >= 2 || wifi?.get_enabled() || false);

  return (
    <QuickSetting
      name='Network'
      icon='bigtop_updates'
      tooltipText='Toggle network on/off'
      activeIf={active}
      setup={(self) => {
        //@ts-expect-error
        self.hook(network, 'notify', () => {
          const connectivity = network.get_connectivity();
          if (connectivity >= 2) active.set(true);
          else if (wifi?.get_enabled()) active.set(true);
          else active.set(false);
        });
      }}
      execute={() => {
        if (wifiEnabled.get()) {
          toggleWifi();
        }
        toggleEthernet();
      }}
    />
  );
};

export const WifiToggle = () => {
  const active = Variable(wifi?.get_enabled() || false);

  return (
    <QuickSetting
      name='Wifi'
      //@ts-ignore
      icon={bind(wifi, 'state').as((s) => {
        if (40 <= s && s <= 80) return 'wifi_protected_setup';
        if (90 <= s && s <= 100) return 'wifi';
        return 'wifi_off';
      })}
      tooltipText='Toggle wifi on/off'
      activeIf={active}
      setup={(self) => {
        //@ts-expect-error
        self.hook(wifi, 'state-changed', (_, event) => {
          if (event <= 20) active.set(false);
          else active.set(true);
        });
      }}
      execute={() => {
        wifiEnabled.set(toggleWifi());
      }}
    />
  );
};

const bluetooth = Bluetooth.get_default();
const bluetoothEnabled = Variable(bluetooth.get_is_powered());

export const BluetoothToggle = () => {
  const active = Variable(bluetooth.get_is_powered());

  return (
    <QuickSetting
      name='Bluetooth'
      icon='bluetooth'
      tooltipText='Toggle bluetooth on/off'
      activeIf={active}
      setup={(self) => {
        function update() {
          const isPowered = bluetooth.get_is_powered();
          active.set(isPowered);
        }

        //@ts-expect-error
        self.hook(bluetooth, 'notify', update);
      }}
      execute={() => {
        const newVal = !bluetooth.get_is_powered();
        bluetooth.toggle();
        bluetoothEnabled.set(newVal);
      }}
    />
  );
};

export const AirplaneMode = () => {
  const active = Variable(
    ![network.get_connectivity() >= 2, wifi?.get_enabled(), bluetooth.get_is_powered()].includes(
      true
    )
  );
  return (
    <QuickSetting
      name='Airplane Mode'
      icon='flight'
      tooltipText='Toggle airplane mode on/off'
      activeIf={active}
      setup={(self) => {
        function update() {
          active.set(
            ![
              network.get_connectivity() >= 2,
              wifi?.get_enabled(),
              bluetooth.get_is_powered(),
            ].includes(true)
          );
        }
        //@ts-expect-error
        self.hook(bluetooth, 'notify', update);
        //@ts-expect-error
        self.hook(network, 'notify', update);
      }}
      execute={() => {
        if (active.get()) {
          if (wifiEnabled.get()) {
            wifi?.set_enabled(true);
          }
          if (bluetoothEnabled.get()) {
            !bluetooth.get_is_powered() && bluetooth.toggle();
          }
          let ifname = '';
          execAsync(['bash', '-c', `nmcli device status | awk '/ethernet/ {print $1}'`])
            .then((res) => (ifname = res))
            .finally(() => execAsync(['bash', '-c', `nmcli device connect ${ifname}`]));
        } else {
          wifi?.set_enabled(false);
          bluetooth.get_is_powered() && bluetooth.toggle();
          wired?.get_device().disconnect(new Gio.Cancellable());
        }
      }}
    />
  );
};
