// Astal
import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { Variable } from 'astal';

// Config
import { userConfig, assetsPath } from '../../config/user_config';

// Functions
import { executeCCR } from '../common/click_close_region';
import { getLayout } from '../../utils/get_layout';
import {
  changeSearchItemSelection,
  executeSelectedSearchItem,
} from './Search/functions';

// Widgets
import { Calendar } from './Calendar';
import { Media } from './Media';
import { Notifications } from './Notifications/main';
import { Search } from './Search/main';
import { Settings } from './Settings/main';
import { Weather } from './Weather';

export function togglePanel(monitorInt: number, section?: string) {
  const windowsOpen = App.get_windows()
    .filter((v) => v.visible)
    .map((v) => v.name);
  const thisPanelName = `Panel-${monitorInt}`;
  const thisPanel = App.get_window(thisPanelName);

  const sectionCheck = section && expandedSection.get() !== section;

  if (windowsOpen.includes(thisPanelName)) {
    if (sectionCheck) return expandedSection.set(section);
    thisPanel?.set_visible(false);
  } else {
    if (sectionCheck) expandedSection.set(section);
    thisPanel?.set_visible(true);
  }
}

export const expandedSection = Variable<string>(
  userConfig.panel.defaultSection
);

export const Panel = (gdkMonitor: Gdk.Monitor) => {
  const monitorInt = App.get_monitors().indexOf(gdkMonitor);
  const layout = getLayout(monitorInt);
  if (layout.rendered)
    return (
      <window
        gdkmonitor={gdkMonitor}
        name={`Panel-${monitorInt}`}
        className='Panel'
        anchor={layout.anchor}
        keymode={Astal.Keymode.EXCLUSIVE}
        layer={Astal.Layer.OVERLAY}
        onKeyPressEvent={(_, event) => {
          const keyval = event.get_keyval()[1];
          if (keyval === 65307) executeCCR();
          if (keyval === 65362) changeSearchItemSelection(-1);
          if (keyval === 65364) changeSearchItemSelection(+1);
          if (keyval === 65293) executeSelectedSearchItem();
        }}
        margin={userConfig.appearance.spacing}
        setup={(self) => {
          if (layout.side === 'left') self.marginRight = 0;
          if (layout.side === 'right') self.marginLeft = 0;

          function mapped() {}
          function unmapped() {
            expandedSection.set(userConfig.panel.defaultSection);
          }
          self.connect('map', mapped);
          self.connect('unmap', unmapped);
        }}
        application={App}
        visible={false}
        css={`
          background-image: url('${assetsPath}/endeavouros.png');
        `}
      >
        <scrollable propagateNaturalHeight hscroll={Gtk.PolicyType.NEVER}>
          <box
            vertical
            className='panel-container'
            spacing={userConfig.appearance.spacing}
          >
            {Search(monitorInt)}
            {Media(monitorInt)}
            {Notifications(monitorInt)}
            {Weather(monitorInt)}
            {Calendar(monitorInt)}
            {Settings(monitorInt)}
          </box>
        </scrollable>
      </window>
    );
  return <window visible={false} />;
};
