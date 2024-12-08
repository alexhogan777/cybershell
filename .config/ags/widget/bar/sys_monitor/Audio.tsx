import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { Variable, GLib, bind, execAsync, exec } from 'astal';
import { userConfig } from '../../../config/user_config';
import { XButton } from '../../common/XButton';
import Wp from 'gi://AstalWp';
const audio = Wp.get_default()?.audio;

export function volumeUp(speaker: Wp.Endpoint) {
  speaker.set_volume(Math.min(speaker.volume + 0.05, 1));
}
export function volumeDown(speaker: Wp.Endpoint) {
  speaker.set_volume(Math.max(speaker.volume - 0.05, 0));
}
export function toggleMute(speaker: Wp.Endpoint, isMic: boolean = false) {
  const _volumeBeforeMute = isMic ? volumeBeforeMute : volumeBeforeMuteMic;

  const muteState = speaker.volume === 0;
  if (muteState) speaker.set_volume(_volumeBeforeMute.get());
  if (!muteState) {
    _volumeBeforeMute.set(speaker.volume);
    speaker.set_volume(0);
  }
}

const volumeBeforeMute = Variable<number>(0.5);
const volumeBeforeMuteMic = Variable<number>(0.5);

export const Audio = () => {
  if (audio) {
    return (
      <box className='Audio' halign={Gtk.Align.CENTER}>
        <XButton
          iconObj={{
            icon: bind(audio.defaultSpeaker, 'volume').as((v) => {
              if (v === 0) return 'no_sound';
              if (v === 1) return 'volume_up';
              if (v < 0.5) return 'volume_mute';
              if (v >= 0.5) return 'volume_down';
            }),
          }}
          tooltipText={bind(audio.defaultSpeaker, 'volume').as((v) => {
            return `${audio
              .get_speakers()
              ?.filter((v) => v.id === audio.defaultSpeaker.id)
              .map((v) => v.description)}: ${
              v > 0 ? `${Math.floor(v * 100)}%` : 'Muted'
            }`;
          })}
          onScroll={(self: Gtk.Button, event: Astal.ScrollEvent) => {
            if (event.delta_y < 0) volumeUp(audio.defaultSpeaker);
            if (event.delta_y > 0) volumeDown(audio.defaultSpeaker);
          }}
          onClick={(self: Gtk.Button, event: Astal.ClickEvent) => {
            if (event.button === Astal.MouseButton.PRIMARY)
              toggleMute(audio.defaultSpeaker);
          }}
        />
      </box>
    );
  } else {
    return <box></box>;
  }
};
