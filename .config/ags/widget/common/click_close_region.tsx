import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { Variable, GLib, bind, Binding, exec } from 'astal';
import Hyprland from 'gi://AstalHyprland';
import {
  changeSearchItemSelection,
  executeSelectedSearchItem,
  query,
} from '../panel/Search/functions';
import { expandedSection } from '../panel/main';
import { playSound } from '../../utils/play_sound';
const hyprland = Hyprland.get_default();

const windowTypes = ['Panel'];

function openCCRs() {
  const windows = App.get_windows();
  const clickCloseRegions = windows.filter((w) =>
    w.name.includes('Click_Close_Region')
  );
  clickCloseRegions.forEach((ccr) => ccr.set_visible(true));
}
function closeCCRs() {
  const windows = App.get_windows();
  const clickCloseRegions = windows.filter((w) =>
    w.name.includes('Click_Close_Region')
  );
  clickCloseRegions.forEach((ccr) => ccr.set_visible(false));
}

const visibleWindows = Variable<string[]>([]);
const othersOpen = Variable<string[]>([]);

function closeWindows() {
  const windows = App.get_windows();
  const windowsToClose = windows.filter((w) =>
    windowTypes.map((wt) => w.name.includes(wt)).includes(true)
  );
  windowsToClose.forEach((wtc) => wtc.set_visible(false));
  visibleWindows.set([]);
}

export function executeCCR() {
  closeWindows();
  closeCCRs();
}

export const ClickCloseRegion = (gdkMonitor: Gdk.Monitor) => {
  const monitorInt = App.get_monitors().indexOf(gdkMonitor);
  return (
    <window
      name={`Click_Close_Region-${monitorInt}`}
      gdkmonitor={gdkMonitor}
      layer={Astal.Layer.TOP}
      // exclusivity={Astal.Exclusivity}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.BOTTOM |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.RIGHT
      }
      application={App}
      keymode={Astal.Keymode.NONE}
      visible={false}
      setup={(self) =>
        self.hook(App, 'window-toggled', (self, window: Astal.Window) => {
          const _visibleWindows = visibleWindows.get();
          const _othersOpen = othersOpen.get();

          // Is this window on on the same monitor as this ccr?
          if (window.monitor !== monitorInt) return;

          // Is this window one of the specified types?
          const thisType = windowTypes.find((wt) => window.name.includes(wt));
          if (!thisType) return;

          // Is this window visible? (if not, do this)
          if (!window.visible) {
            // Is this window not currently closing because
            // a new window with the same type opened?
            if (!_othersOpen.includes(window.name)) {
              playSound('dismiss');
              executeCCR();
            } else {
              // if it is, do this
            }
            return;
          }

          othersOpen.set(
            // Find open windows with the same type as this one
            _visibleWindows.filter((vw) => {
              if (!vw.includes(thisType)) return false;
              if (vw === window.name) return false;
              return true;
            })
          );

          // Close open windows with the same type as this one
          othersOpen
            .get()
            .forEach((w) => App.get_window(w)?.set_visible(false));

          // Add this window to the list of visible windows
          visibleWindows.set([..._visibleWindows, window.name]);

          openCCRs();
          playSound('open');
        })
      }
    >
      <eventbox expand onClick={() => executeCCR()} />
    </window>
  );
};
