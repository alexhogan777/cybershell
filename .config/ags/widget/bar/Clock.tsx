// Astal
import { Astal, Gtk } from 'astal/gtk3';
import { Variable, GLib, bind, Binding } from 'astal';

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

// Widgets
import { BarButton } from './BarButton';
import { getLayout } from '../../utils/get_layout';

const hasAMPM = config.localization.timeFormat.includes('%p');
function getTimeFormat(full: boolean) {
  const userTimeFormat = config.localization.timeFormat;
  let newFormat = userTimeFormat;
  if (full) return newFormat;

  if (userTimeFormat.includes('%p')) {
    // if using AM/PM
    newFormat = newFormat.slice(0, newFormat.indexOf('%p')); // remove AM/PM marker
    newFormat = `${newFormat}*%p`; // add it back with an asterisk to be used as a split point.
  }

  return newFormat;
}

function getDateFormat(full: boolean) {
  const userDateFormat = config.localization.dateFormat;
  let newFormat = userDateFormat;
  if (full) return newFormat;

  const monthIndex = newFormat.indexOf('%m');
  const dateIndex = newFormat.indexOf('%d');
  const dateFirst = dateIndex < monthIndex;
  newFormat = newFormat.slice(
    dateFirst ? dateIndex : monthIndex,
    (dateFirst ? monthIndex : dateIndex) + 2
  );

  return newFormat;
}

const timedate = Variable<any>(hasAMPM ? ['*', ''] : ['', '']).poll(1000, () => {
  const time = GLib.DateTime.new_now_local().format(getTimeFormat(false))!;
  const datefull = GLib.DateTime.new_now_local().format(getDateFormat(true))!;
  const day = GLib.DateTime.new_now_local().format('%a');
  const date = GLib.DateTime.new_now_local().format(getDateFormat(false));
  const timefull = GLib.DateTime.new_now_local().format(getTimeFormat(true));
  return [time, datefull, day, date, timefull];
});
export const Clock = ({
  monitorInt,
  layout,
  vertical,
}: {
  monitorInt: number;
  layout: Variable<{
    rendered: boolean;
    side: string;
    direction: string;
    anchor: Astal.WindowAnchor;
  }>;
  vertical: Binding<boolean>;
}) => {
  const Day = () => {
    return (
      <label
        className={bind(vertical).as((v) => `date ${v && 'vertical'}`)}
        label={bind(timedate).as((v) => {
          const day = v[2];
          return `${day}`;
        })}
      />
    );
  };
  const Date = () => {
    return (
      <label
        className={bind(vertical).as((v) => `date ${v && 'vertical'}`)}
        label={bind(timedate).as((v) => {
          const date = v[3];
          return `${date}`;
        })}
      />
    );
  };
  const Time = () => {
    return (
      <box halign={Gtk.Align.CENTER}>
        <box visible={vertical} vertical className='time' spacing={spacing}>
          <label
            label={bind(timedate).as((v) => {
              const time = v[0].replaceAll(':', '\n');
              return `${!hasAMPM ? time : time.split('*')[0]}`;
            })}
          />
          {hasAMPM && (
            <label className='am-pm' label={bind(timedate).as((v) => v[0].split('*')[1])} />
          )}
        </box>
        <box visible={vertical.as((v) => !v)} className='time' spacing={spacing}>
          <label
            label={bind(timedate).as((v) => {
              const time = v[0];
              return `${!hasAMPM ? time : time.split('*')[0]}`;
            })}
          />
          {hasAMPM && (
            <label className='am-pm' label={bind(timedate).as((v) => v[0].split('*')[1])} />
          )}
        </box>
      </box>
    );
  };

  const Layout = () => {
    return (
      <box
        vertical={vertical}
        spacing={spacing}
        setup={(self) => {
          function update() {
            self.children = vertical.get() ? [Day(), Time(), Date()] : [Day(), Date(), Time()];
          }
          update();
          self.hook(vertical, update);
        }}
      />
    );
  };

  return (
    <BarButton
      vertical={vertical}
      spacing={0}
      className='Clock'
      section='Calendar'
      tooltipText={bind(timedate).as((v) => `${v[1]} | ${v[4]}`)}
      monitorInt={monitorInt}
    >
      {Layout()}
    </BarButton>
  );
};
