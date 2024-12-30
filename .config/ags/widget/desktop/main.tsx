// Astal
import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { bind, execAsync, readFile, Variable } from 'astal';

// Libraries
import DesktopState, { DesktopFile } from '../../state/desktop';
const desktop = DesktopState.get_default();

import Config from '../../state/config/config';
import { XButton } from '../common/XButton';
import { HOME } from '../../config/user_config';
const config = Config.get_default();
const spacing = bind(
  Variable(config.appearance.paddingBase).observe(
    config.appearance,
    'updated',
    () => config.appearance.paddingBase
  )
);

import FlowBox, { FlowBoxChild } from '../common/FlowBox';

const DesktopIcon = ({ name, fileName, path, fileType, icon }: DesktopFile) => {
  return (
    <XButton
      className='desktop-icon'
      tooltipText={fileName}
      onClick={() => {
        switch (fileType) {
          case 'app':
            execAsync(`gio launch "${path}"`);
            break;
          default:
            execAsync(`xdg-open "${path}"`);
            break;
        }
      }}
    >
      <box vertical spacing={spacing}>
        <icon icon={icon} />
        <label label={name} wrap truncate maxWidthChars={10} />
      </box>
    </XButton>
  );
};

export const Desktop = (gdkMonitor: Gdk.Monitor) => {
  const monitorInt = App.get_monitors().indexOf(gdkMonitor);
  return (
    <window
      name={`Desktop-${monitorInt}`}
      gdkmonitor={gdkMonitor}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.RIGHT |
        Astal.WindowAnchor.BOTTOM |
        Astal.WindowAnchor.LEFT
      }
      layer={Astal.Layer.BACKGROUND}
      margin={spacing}
    >
      <FlowBox
        valign={Gtk.Align.START}
        halign={Gtk.Align.START}
        minChildrenPerLine={2}
        maxChildrenPerLine={100}
        columnSpacing={spacing}
        rowSpacing={spacing}
        homogeneous
      >
        {bind(desktop, 'files').as((v) => v && v.map(DesktopIcon))}
      </FlowBox>
    </window>
  );
};
