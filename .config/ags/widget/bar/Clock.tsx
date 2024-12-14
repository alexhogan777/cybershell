import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import {
  Variable,
  GLib,
  bind,
  readFile,
  execAsync,
  writeFile,
  exec,
} from 'astal';
import { configPath, userConfig } from '../../config/user_config';
import { XButton } from '../common/XButton';
import { BarButton } from './BarButton';
import { togglePanel } from '../panel/main';
import { getLayout } from '../../utils/get_layout';

const hasAMPM = userConfig.localization.timeFormat.includes('%p');
function getTimeFormat(full: boolean) {
  const userTimeFormat = userConfig.localization.timeFormat;
  let newFormat = userTimeFormat;
  if (full) return newFormat;
  newFormat = newFormat.replaceAll(':', '\n'); // Reformat for vertical clock

  if (userTimeFormat.includes('%p')) {
    // if using AM/PM
    newFormat = newFormat.slice(0, newFormat.indexOf('%p')); // remove AM/PM marker
    newFormat = `${newFormat}*%p`; // add it back with an asterisk to be used as a split point.
  }

  return newFormat;
}

function getDateFormat(full: boolean) {
  const userDateFormat = userConfig.localization.dateFormat;
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

const timedate = Variable<any>(hasAMPM ? ['*', ''] : ['', '']).poll(
  1000,
  () => {
    const time = GLib.DateTime.new_now_local().format(getTimeFormat(false))!;
    const datefull = GLib.DateTime.new_now_local().format(getDateFormat(true))!;
    const day = GLib.DateTime.new_now_local().format('%a');
    const date = GLib.DateTime.new_now_local().format(getDateFormat(false));
    const timefull = GLib.DateTime.new_now_local().format(getTimeFormat(true));
    return [time, datefull, day, date, timefull];
  }
);
export const Clock = ({ monitorInt }: { monitorInt: number }) => {
  const Day = () => {
    return (
      <label
        className='date'
        label={bind(timedate).as((v) => {
          const day = v[2];
          return `${day}`;
        })}
      />
    );
  };
  const Time = () => {
    return (
      <box vertical className='time' spacing={userConfig.appearance.spacing}>
        <label
          label={bind(timedate).as((v) => {
            const time = v[0];
            return `${!hasAMPM ? time : time.split('*')[0]}`;
          })}
        />
        {hasAMPM && (
          <label
            className='am-pm'
            label={bind(timedate).as((v) => v[0].split('*')[1])}
          />
        )}
      </box>
    );
  };
  const Date = () => {
    return (
      <label
        className='date'
        label={bind(timedate).as((v) => {
          const date = v[3];
          return `${date}`;
        })}
      />
    );
  };

  return (
    <BarButton
      valign={Gtk.Align.END}
      vertical
      css='padding: 0em;'
      spacing={0}
      className='Clock'
      section='Calendar'
      tooltipText={bind(timedate).as((v) => `${v[1]} | ${v[4]}`)}
      monitorInt={monitorInt}
    >
      <Day />
      <Time />
      <Date />
    </BarButton>
  );
};
