// Astal
import { App } from 'astal/gtk3';
import { exec, monitorFile, readFile, timeout, Variable } from 'astal';

// Libraries
import Hyprland from 'gi://AstalHyprland';
const hyprland = Hyprland.get_default();

// Widgets
import { ClickCloseRegion } from './widget/common/click_close_region';
import { SystemSounds } from './widget/common/system_sounds';
import { Bar } from './widget/bar/main';
import { Panel, togglePanel } from './widget/panel/main';
import { Popups } from './widget/popups/main';

// Config
import { configPath, HOME } from './config/user_config';
import { syncConfig } from './config/styles';

function getStyle() {
  syncConfig();
  exec(['sass', './style.scss', '/tmp/style.css']);
  App.apply_css('/tmp/style.css');
}

App.start({
  main() {
    getStyle();
    SystemSounds();
    App.get_monitors().map(Bar);
    App.get_monitors().map(ClickCloseRegion);
    App.get_monitors().map(Popups);
    App.get_monitors().map(Panel);
  },
  requestHandler(request: string, res: (response: any) => void) {
    const requestArr = request.split(' ');
    const command = requestArr[0];
    const option = requestArr[1];
    const value = requestArr[2];
    const currentMonitorInt = hyprland.get_focused_monitor().id;

    if (command === 'togglePanel') {
      if (option === '-s' || option === '--section') {
        togglePanel(currentMonitorInt, value);
        res(`Toggling Panel-${currentMonitorInt} expanding section "${value}"`);
      } else if (option === '-h' || option === '--help') {
        res(`Toggle the panel from the command line.
Available Options:
  -h, --help                        : Print these options
  -s [SECTION], --section [SECTION] : open to a specific section
          `);
      } else {
        togglePanel(currentMonitorInt);
        res(`Toggling Panel-${currentMonitorInt}`);
      }
    }
  },
});
