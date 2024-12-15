// Astal
import { Astal, Gtk } from 'astal/gtk3';
import { Variable, bind, Binding, execAsync, Gio } from 'astal';

// Libraries
import Network from 'gi://AstalNetwork';

// Config
import { userConfig } from '../../../config/user_config';
import Config from '../../../state/config/config';
const config = Config.get_default();
const spacing = config.appearance.paddingBase;

// Functions
import { execAsyncClose } from '../../../utils/execClose';
import { toggleEthernet, toggleWifi } from '../../../utils/network_toggles';

// Widgets
import { MaterialIcon } from '../../common/MaterialIcon';
import { XButton } from '../../common/XButton';

/*
Sound on/off
Bluetooth on/off
Wifi on/off
Network on/off
Blue Light on/off
Notifications on/off
Screen idle on/off
Power/Session Menu
Open settings app
Open trigger-control
Open resource monitor
*/

const QuickSetting = ({
  name,
  icon,
  tooltipText,
  execute = () => {
    console.log('clicked');
  },
  activeIf,
  setup,
}: {
  name: string | Binding<string>;
  icon: string | Binding<string>;
  tooltipText: string;
  execute?: any;
  activeIf?: Variable<boolean>;
  setup?: (self: Astal.Button) => void;
}) => {
  const isHovered = Variable<boolean>(false);
  const inactive = Variable(false);
  const _activeIf = activeIf !== undefined ? activeIf : inactive;
  return (
    <XButton
      name={name}
      halign={Gtk.Align.CENTER}
      className={bind(_activeIf).as((v) => `quick-setting ${v && 'active'}`)}
      hexpand
      tooltipText={tooltipText}
      onClick={(self: Gtk.Button, event: Astal.ClickEvent) => {
        if (event.button === Astal.MouseButton.PRIMARY) execute();
      }}
      onHover={() => {
        isHovered.set(true);
      }}
      onHoverLost={() => {
        isHovered.set(false);
      }}
      setup={setup && setup}
    >
      <box>
        <MaterialIcon icon={icon} size={1.75} />
        <revealer
          revealChild={bind(isHovered)}
          transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
        >
          <label className='name' label={name} />
        </revealer>
      </box>
    </XButton>
  );
};

const network = Network.get_default();
const wifiEnabled = Variable(Network.get_default().wifi.get_enabled() || false);
const wifi = network.get_wifi();
const wired = network.get_wired();

const NetworkToggle = () => {
  const active = Variable(
    network.get_connectivity() >= 2 || wifi?.get_enabled() || false
  );

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

const Wifi = () => {
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

import Bluetooth from 'gi://AstalBluetooth';
const bluetooth = Bluetooth.get_default();

const bluetoothEnabled = Variable(bluetooth.get_is_powered());

const BluetoothToggle = () => {
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

const AirplaneMode = () => {
  const active = Variable(
    ![
      network.get_connectivity() >= 2,
      wifi?.get_enabled(),
      bluetooth.get_is_powered(),
    ].includes(true)
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
          execAsync([
            'bash',
            '-c',
            `nmcli device status | awk '/ethernet/ {print $1}'`,
          ])
            .then((res) => (ifname = res))
            .finally(() =>
              execAsync(['bash', '-c', `nmcli device connect ${ifname}`])
            );
        } else {
          wifi?.set_enabled(false);
          bluetooth.get_is_powered() && bluetooth.toggle();
          wired?.get_device().disconnect(new Gio.Cancellable());
        }
      }}
    />
  );
};

import NightLight from '../../../state/nightlight/nightlight';
const nightlight = NightLight.get_default();
const NightLightToggle = () => {
  const active = Variable(nightlight.enabled);

  return (
    <QuickSetting
      name='Night Light'
      icon='bedtime'
      tooltipText='Toggle blue light filter on/off'
      activeIf={active}
      execute={() => (nightlight.enabled = !nightlight.enabled)}
      setup={(self) => {
        function update() {
          active.set(nightlight.enabled);
        }
        //@ts-expect-error
        self.hook(nightlight, 'notify', update);
      }}
    />
  );
};

const ScreenIdle = () => {
  const active = Variable(false);
  function checkActive() {
    execAsync(['bash', '-c', 'pidof hypridle'])
      .then(
        () => active.set(true),
        () => active.set(false)
      )
      .catch();
  }
  checkActive();
  return (
    <QuickSetting
      name='Screen Idle'
      icon='snooze'
      tooltipText={`Enable screen idling service,\ndimming the screen and eventually suspending the system.`}
      activeIf={active}
      execute={() => {
        execAsync(['bash', '-c', 'killall hypridle || hypridle']).catch();
        checkActive();
      }}
    />
  );
};

const OpenSystemMonitor = () => {
  return (
    <QuickSetting
      name='Open System Monitor'
      icon='browse_activity'
      tooltipText='Open the system monitor.'
      execute={() => execAsyncClose(config.apps.systemMonitor)}
    />
  );
};

const OpenSettings = () => {
  return (
    <QuickSetting
      name='Open Settings App'
      icon='settings'
      tooltipText={`Open the settings app\n(NOTE: by default this uses GNOME Control Center.\nMany settings will not work/won't change anything.)`}
      execute={() => execAsyncClose(config.apps.settings)}
    />
  );
};

export const QuickSettings = () => {
  const Row = ({ children }: { children?: Gtk.Widget[] }) => {
    return (
      <box hexpand spacing={spacing}>
        {children}
      </box>
    );
  };

  return (
    <box vertical className='quick-settings' spacing={spacing}>
      {/* <label label='Quick Settings' className='h3' /> */}
      <Row>
        <NetworkToggle />
        <Wifi />
        <BluetoothToggle />
        <AirplaneMode />
      </Row>
      <Row>
        <QuickSetting
          name='Sound'
          icon='volume_up'
          tooltipText='Toggle sound on/off'
        />
        <QuickSetting
          name='Popups'
          icon='notifications'
          tooltipText='Toggle notification popups on/off'
        />
        <QuickSetting
          name='Do Not Disturb'
          icon='do_not_disturb_on'
          tooltipText={`Toggle do not disturb on/off\n(Disables notification popups and sounds)`}
        />
        <NightLightToggle />
      </Row>
      <Row>
        <QuickSetting
          name='Screenshot'
          icon='screenshot_monitor'
          tooltipText='Take a screenshot'
        />
        <QuickSetting
          name='trigger-control'
          icon='stadia_controller'
          tooltipText='Open trigger-control'
          execute={() => execAsyncClose('trigger-control')}
        />
        <QuickSetting
          name='Screen Record'
          icon='screen_record'
          tooltipText='Start/stop screen recording'
        />
      </Row>
      <Row>
        <ScreenIdle />
        <QuickSetting
          name='Power Saving Mode'
          icon='bolt'
          tooltipText='Toggle power saving mode on/off'
        />
        <OpenSystemMonitor />
        <OpenSettings />
      </Row>
    </box>
  );
};
