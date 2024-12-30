// Astal
import { App } from 'astal/gtk3';
import { exec } from 'astal';

// Libraries
import Hyprland from 'gi://AstalHyprland';
const hyprland = Hyprland.get_default();
import PanelLib from './state/panel/panel';
const panel = PanelLib.get_default();

// Config
import Config from './state/config/config';

// Widgets
import { ClickCloseRegion } from './widget/common/click_close_region';
import { SystemSounds } from './widget/common/system_sounds';
import { Bar } from './widget/bar/main';
import { Panel } from './widget/panel/main';
import { Popups } from './widget/popups/main';
import { Desktop } from './widget/desktop/main';

App.start({
  main() {
    Config.get_default().syncConfig();
    SystemSounds();
    App.get_monitors().map(Desktop);
    App.get_monitors().map(Bar);
    App.get_monitors().map(ClickCloseRegion);
    App.get_monitors().map(Popups);
    Panel(App.get_monitors()[0]);
  },
  requestHandler(request: string, res: (response: any) => void) {
    const requestArr = request.split(' ');
    const command = requestArr[0];
    const option = requestArr[1];
    const value = requestArr[2];
    const currentMonitorInt = hyprland.get_focused_monitor().id;

    if (command === 'togglePanel') {
      if (option === '-s' || option === '--section') {
        panel.togglePanel(currentMonitorInt, 'keybind', value);
        res(`Toggling Panel-${currentMonitorInt} expanding section "${value}"`);
      } else if (option === '-h' || option === '--help') {
        res(`Toggle the panel from the command line.
Available Options:
  -h, --help                        : Print these options
  -s [SECTION], --section [SECTION] : open to a specific section
          `);
      } else {
        panel.togglePanel(currentMonitorInt, 'keybind', panel.defaultSection);
        res(`Toggling Panel-${currentMonitorInt}`);
      }
    }
  },
});
