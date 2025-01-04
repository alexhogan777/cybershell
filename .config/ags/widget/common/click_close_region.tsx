// Astal
import { App, Astal, Gdk } from 'astal/gtk3';
import { Variable } from 'astal';

// Functions
import { playSound } from '../../utils/play_sound';
import Panel from '../../state/panel/panel';
const panel = Panel.get_default();

// Variables
function getPanelState() {
  return {
    visible: panel.visible,
    monitor: panel.monitor,
    anchor: panel.anchor,
  };
}
const panelState = Variable(getPanelState());

function openCCRs() {
  const windows = App.get_windows();
  const clickCloseRegions = windows.filter((w) => w.name.includes('Click_Close_Region'));
  clickCloseRegions.forEach((ccr) => ccr.set_visible(true));
}
function closeCCRs() {
  const windows = App.get_windows();
  const clickCloseRegions = windows.filter((w) => w.name.includes('Click_Close_Region'));
  clickCloseRegions.forEach((ccr) => ccr.set_visible(false));
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
      css={'background: transparent;'}
      setup={(self) => {
        function update() {
          const _panelState = panelState.get();
          const shouldProceed = () => {
            if (panel.visible !== _panelState.visible) return 'visible';
            if (panel.monitor !== _panelState.monitor) return 'monitor';
            if (panel.anchor !== _panelState.anchor) return 'anchor';
            return null;
          };

          if (shouldProceed() === null) return;
          if (shouldProceed() === 'visible') {
            if (panel.visible) {
              playSound('open');
              openCCRs();
            } else {
              playSound('dismiss');

              closeCCRs();
            }
          }
          if (shouldProceed() === 'monitor' || shouldProceed() === 'anchor') {
            playSound('open');
          }

          panelState.set(getPanelState());
        }

        self.hook(panel, 'updated', update);
      }}
    >
      <eventbox
        expand
        onClick={() => {
          closeCCRs();
          panel.togglePanel(monitorInt, 'ccr');
        }}
      />
    </window>
  );
};
