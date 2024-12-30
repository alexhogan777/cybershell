// Astal
import { Variable, bind } from 'astal';

// Libraries
import Config from '../../../../state/config/config';
const config = Config.get_default();

// Functions
import { execAsyncClose } from '../../../../utils/execClose';

// Widgets
import { QuickSetting } from './main';

export const ScreenRecord = () => {
  return (
    <QuickSetting
      name='Screen Record'
      icon='screen_record'
      tooltipText='Start/stop screen recording'
    />
  );
};

export const TogglePowerSaving = () => {
  return (
    <QuickSetting
      name='Power Saving Mode'
      icon='bolt'
      tooltipText='Toggle power saving mode on/off'
    />
  );
};

export const OpenSystemMonitor = () => {
  return (
    <QuickSetting
      name='Open System Monitor'
      icon='browse_activity'
      tooltipText='Open the system monitor.'
      execute={() => execAsyncClose(config.apps.systemMonitor)}
    />
  );
};

export const OpenSettings = () => {
  return (
    <QuickSetting
      name='Open Settings App'
      icon='settings'
      tooltipText={`Open the settings app\n(NOTE: by default this uses GNOME Control Center.\nMany settings will not work/won't change anything.)`}
      execute={() => execAsyncClose(config.apps.settings)}
    />
  );
};
