// Astal
import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { bind, interval, timeout, Variable } from 'astal';

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
import Panel from '../../state/panel/panel';
const panel = Panel.get_default();

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
import { ActiveClient } from '../bar/ActiveClient';

import HoverHide from '../../utils/hover_hide';

export const Bar = (gdkMonitor: Gdk.Monitor) => {
  const monitorInt = App.get_monitors().indexOf(gdkMonitor);
  const layout = Variable(getLayout(monitorInt)).observe(config.bar, 'updated', () =>
    getLayout(monitorInt)
  );

  const vertical = bind(layout).as((v) => v.direction === 'vertical');
  function getPadding() {
    const _side = layout.get().side;
    const _spacing = spacing.get();
    if (vertical.get()) {
      return `padding: ${_spacing}px ${_side === 'right' ? _spacing : 0}px ${_spacing}px ${
        _side === 'left' ? _spacing : 0
      }px;`;
    } else {
      return `padding: ${_side === 'top' ? _spacing : 0}px ${_spacing}px ${
        _side === 'bottom' ? _spacing : 0
      }px ${_spacing}px;`;
    }
  }
  const padding = Variable(getPadding())
    .observe(config.appearance, 'updated', () => getPadding())
    .observe(config.bar, 'updated', () => getPadding());

  const AutoHide = ({ child }: any) => {
    const enabled = Variable(config.bar.autoHide);
    const shown = Variable(!enabled.get());

    function getTransition() {
      if (layout.get().direction === 'horizontal') {
        switch (layout.get().side) {
          case 'top':
            return Gtk.RevealerTransitionType.SLIDE_DOWN;
          case 'bottom':
            return Gtk.RevealerTransitionType.SLIDE_UP;
        }
      } else {
        switch (layout.get().side) {
          case 'left':
            return Gtk.RevealerTransitionType.SLIDE_RIGHT;
          case 'right':
            return Gtk.RevealerTransitionType.SLIDE_LEFT;
        }
      }
    }
    const transition = Variable(getTransition()).observe(config.bar, 'updated', () =>
      getTransition()
    );

    function getDimensions() {
      const _spacing = spacing.get();
      const _vertical = vertical.get();
      return `min-height: ${_vertical ? _spacing : 0}px; min-width: ${
        !_vertical ? _spacing : 0
      }px;`;
    }
    const dimensions = Variable(getDimensions())
      .observe(config.appearance, 'updated', () => getDimensions())
      .observe(config.bar, 'updated', () => getDimensions());

    return (
      <eventbox
        css={bind(dimensions)}
        setup={(self) => {
          const hide = new HoverHide(
            config.bar.autoHideDelay,
            () => enabled.get() && shown.set(false)
          );

          let hovering = false;
          let panelOpen = false;

          self.hook(config.bar, 'updated', (_, cfg) => {
            hide.delay = cfg.autoHideDelay;
            if (cfg.autoHide) {
              enabled.set(true);
              enabled.get() && !hovering && !panelOpen && hide.start();
            } else {
              enabled.set(false);
              shown.set(true);
            }
          });

          self.hook(panel, 'updated', () => {
            const value = panel.visible && panel.monitor === monitorInt;

            if (value) {
              hide.stop();
              enabled.get() && shown.set(true);
            } else {
              enabled.get() && !hovering && hide.start();
            }
            panelOpen = value;
          });

          self.connect('hover', () => {
            hovering = true;
            hide.stop();
            enabled.get() && shown.set(true);
          });

          self.connect('hover-lost', () => {
            hovering = false;
            enabled.get() && !panelOpen && hide.start();
          });
        }}
      >
        <revealer
          revealChild={bind(shown)}
          transitionDuration={250}
          transitionType={bind(transition)}
        >
          {child}
        </revealer>
      </eventbox>
    );
  };

  const Section = ({ children, valign, halign }: any) => {
    return (
      <box vertical={vertical} spacing={spacing} halign={halign} valign={valign}>
        {children}
      </box>
    );
  };

  return (
    <window
      name={`Bar-${monitorInt}`}
      gdkmonitor={gdkMonitor}
      className='Bar'
      anchor={bind(layout).as((l) => l.anchor)}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      application={App}
      visible={bind(layout).as((l) => l.rendered)}
    >
      <AutoHide>
        <centerbox
          vertical={vertical}
          css={bind(padding)}
          startWidget={
            <Section
              halign={vertical.as((v) => !v && Gtk.Align.START)}
              valign={vertical.as((v) => (v ? Gtk.Align.START : Gtk.Align.CENTER))}
            >
              <Search monitorInt={monitorInt} />
              {Media({ monitorInt: monitorInt })}
              <Notifications monitorInt={monitorInt} />
              <SysTray monitorInt={monitorInt} />
            </Section>
          }
          centerWidget={
            <Section halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}>
              <ActiveClient />
              <Workspaces monitorInt={monitorInt} vertical={vertical} />
              <Overview monitorInt={monitorInt} />
            </Section>
          }
          endWidget={
            <centerbox
              vertical={vertical}
              endWidget={
                <Section
                  halign={vertical.as((v) => !v && Gtk.Align.END)}
                  valign={vertical.as((v) => (v ? Gtk.Align.END : Gtk.Align.CENTER))}
                >
                  <Clock monitorInt={monitorInt} layout={layout} vertical={vertical} />
                  <SysMonitor vertical={vertical} />
                  <Settings monitorInt={monitorInt} />
                </Section>
              }
            />
          }
        />
      </AutoHide>
    </window>
  );
};
