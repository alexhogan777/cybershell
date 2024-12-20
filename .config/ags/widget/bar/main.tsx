// Astal
import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { bind, Variable } from 'astal';

// Config
import Config from '../../state/config/config';
import Appearance from '../../state/config/appearance';
const appearance = Appearance.get_default();
const spacing = appearance.paddingBase;
const spacingVar = Variable(appearance.paddingBase).observe(
  appearance,
  'notify',
  () => {
    print('asdf');
    return appearance.paddingBase;
  }
);

// Functions
import { getLayout } from '../../utils/get_layout';

// Widgets
import { Clock } from './Clock';
import { Media } from './Media';
import { Notifications } from './Notifications';
import { Overview } from './Overview';
import { Search } from './Search';
import { Settings } from './Settings';
import { SysMonitor } from './sys_monitor/main';
import { SysTray } from './SysTray';
import { Workspaces } from './Workspaces';

export const Bar = (gdkMonitor: Gdk.Monitor) => {
  const monitorInt = App.get_monitors().indexOf(gdkMonitor);
  const layout = getLayout(monitorInt);

  const Section = ({ children, valign }: any) => {
    return (
      <box vertical spacing={spacing} valign={valign}>
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
        margin={spacing}
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
