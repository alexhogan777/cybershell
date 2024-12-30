// Astal
import { Astal, Gtk } from 'astal/gtk3';
import { Variable, bind, Binding, execAsync } from 'astal';

// Config
import Config from '../../../../state/config/config';
const config = Config.get_default();
const spacing = bind(
  Variable(config.appearance.paddingBase).observe(
    config.appearance,
    'updated',
    () => config.appearance.paddingBase
  )
);

// Functions
import { execAsyncClose } from '../../../../utils/execClose';

// Widgets
import FlowBox from '../../../common/FlowBox';
import { MaterialIcon } from '../../../common/MaterialIcon';
import { XButton } from '../../../common/XButton';
import { NetworkToggle, WifiToggle, BluetoothToggle, AirplaneMode } from './NetworkSettings';
import {
  DoNotDisturbToggle,
  NightLightToggle,
  PopupsToggle,
  ScreenIdleToggle,
} from './ChillSettings';
import { OpenSettings, OpenSystemMonitor, ScreenRecord, TogglePowerSaving } from './SystemSettings';

export const QuickSetting = ({
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

export const QuickSettings = () => {
  const Row = ({ children }: { children?: Gtk.Widget[] }) => {
    return (
      <box hexpand spacing={spacing}>
        {children}
      </box>
    );
  };

  return (
    <FlowBox
      className='quick-settings'
      maxChildrenPerLine={4}
      rowSpacing={spacing}
      columnSpacing={spacing}
    >
      <NetworkToggle />
      <WifiToggle />
      <BluetoothToggle />
      <AirplaneMode />
      <PopupsToggle />
      <DoNotDisturbToggle />
      <NightLightToggle />
      <ScreenIdleToggle />
      {/* <QuickSetting name='Screenshot' icon='screenshot_monitor' tooltipText='Take a screenshot' />
      <QuickSetting
        name='trigger-control'
        icon='stadia_controller'
        tooltipText='Open trigger-control'
        execute={() => execAsyncClose('trigger-control')}
      />
      <box /> */}
      <ScreenRecord />
      <TogglePowerSaving />
      <OpenSystemMonitor />
      <OpenSettings />
    </FlowBox>
  );
};
