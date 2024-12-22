// Astal
import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { bind, Variable } from 'astal';

// Config
import Config from '../../state/config/config';
const config = Config.get_default();
const spacing = bind(
  Variable(config.appearance.paddingBase).observe(
    config.appearance,
    'updated',
    () => config.appearance.paddingBase
  )
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

  const shown = Variable(!config.bar.autoHide);

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
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        application={App}
      >
        <eventbox
          onHover={() => config.bar.autoHide && shown.set(true)}
          onHoverLost={() => config.bar.autoHide && shown.set(false)}
          css={`
            min-width: 20px;
          `}
          setup={(self) => {
            self.hook(config.bar, 'updated', (_, v) => {
              shown.set(!v.autoHide);
            });
          }}
        >
          <centerbox
            vertical
            visible={bind(shown)}
            css={spacing.as(
              (v) => `padding: ${v}px ${layout.side === 'right' ? v : 0}px ${v}px ${
                layout.side === 'left' ? v : 0
              }px;

              `
            )}
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
        </eventbox>
      </window>
    );
  }
};
