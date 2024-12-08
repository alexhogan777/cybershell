import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { Variable, GLib, bind, Binding } from 'astal';
import { getLayout } from '../../utils/get_layout';
import { Clock } from './Clock';
import { userConfig } from '../../config/user_config';
import { MaterialIcon } from '../common/MaterialIcon';
import { Settings } from './Settings';
import { Search } from './Search';
import { Media } from './Media';
import { Notifications } from './Notifications';
import { Overview } from './Overview';
import { VSpace } from '../common/VSpace';
import { Workspaces } from './Workspaces';
import { SysTray } from './SysTray';
import { SysMonitor } from './sys_monitor/main';

export const Bar = (gdkMonitor: Gdk.Monitor) => {
  const monitorInt = App.get_monitors().indexOf(gdkMonitor);
  const layout = getLayout(monitorInt);

  const Section = ({ children, valign }: any) => {
    return (
      <box vertical spacing={userConfig.appearance.spacing} valign={valign}>
        {children}
      </box>
    );
  };

  if (layout.rendered) {
    return (
      <window
        name={`Bar-${monitorInt}`}
        gdkmonitor={gdkMonitor}
        className='Bar'
        anchor={layout.anchor}
        margin={userConfig.appearance.spacing}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        setup={(self) => {
          if (layout.side === 'left') self.marginRight = 0;
          if (layout.side === 'right') self.marginLeft = 0;
        }}
        application={App}
      >
        <centerbox
          vertical
          startWidget={
            <Section valign={Gtk.Align.START}>
              <Search monitorInt={monitorInt} />
              {Media({ monitorInt: monitorInt })}
              <Notifications monitorInt={monitorInt} />
              <SysTray monitorInt={monitorInt} />
            </Section>
          }
          centerWidget={
            <Section valign={Gtk.Align.CENTER}>
              <Workspaces monitorInt={monitorInt} />
              <Overview monitorInt={monitorInt} />
            </Section>
          }
          endWidget={
            <centerbox
              vertical
              endWidget={
                <Section valign={Gtk.Align.END}>
                  <Clock monitorInt={monitorInt} />
                  <SysMonitor monitorInt={monitorInt} />
                  <Settings monitorInt={monitorInt} />
                </Section>
              }
            />
          }
        />
      </window>
    );
  }
};
