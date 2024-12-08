import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { Variable, GLib, bind, Binding, execAsync } from 'astal';
import { userConfig } from '../../../config/user_config';
import { Dropdown, Option } from '../../common/Dropdown';
import { selectedSubsection, Subsection } from './main';
import Wp from 'gi://AstalWp';
import { MaterialIcon } from '../../common/MaterialIcon';
import { playSound } from '../../../utils/play_sound';
import { XButton } from '../../common/XButton';
import { toggleMute, volumeDown, volumeUp } from '../../bar/sys_monitor/Audio';
import { expandedSection, togglePanel } from '../main';
import { execAsyncClose } from '../../../utils/execClose';
const audio = Wp.get_default()?.audio;

export const Audio = () => {
  if (audio) {
    const Speakers = (speakers: Wp.Endpoint[]) => {
      const reveal = Variable(false);

      function getOptions() {
        if (speakers.length > 0) {
          return speakers.map((s) => {
            return { name: s.description, icon: 'speaker' };
          });
        }
        return [{ name: 'No Speakers Found' }];
      }
      const options = Variable<Option[]>(getOptions());

      function getDefaultSpeaker() {
        const defaultSpeaker = audio?.get_default_speaker();
        const defaultIndex = speakers.findIndex(
          (s) => s.id === defaultSpeaker?.id
        );

        selected.set(defaultIndex || 0);
      }

      const selected = Variable(0);

      return (
        <box spacing={userConfig.appearance.spacing * 2}>
          <box
            vertical
            spacing={userConfig.appearance.spacing}
            css='min-width: 5em;'
            valign={Gtk.Align.CENTER}
          >
            <MaterialIcon icon='speaker' size={2.5} />
            <label label='Output' />
          </box>
          <box vertical>
            <box>
              <XButton
                iconObj={{
                  icon: bind(audio.defaultSpeaker, 'volume').as((v) => {
                    if (v === 0) return 'no_sound';
                    if (v === 1) return 'volume_up';
                    if (v < 0.5) return 'volume_mute';
                    if (v >= 0.5) return 'volume_down';
                    return '';
                  }),
                  size: 1.5,
                }}
                className='mute-button'
                onClick={(_: Gtk.Button, event: Astal.ClickEvent) => {
                  if (event.button === Astal.MouseButton.PRIMARY)
                    toggleMute(speakers[selected.get()]);
                }}
              />

              <slider
                value={bind(audio.defaultSpeaker, 'volume')}
                className='volume-slider'
                hexpand
                onDragged={(self) => {
                  audio.get_default_speaker()?.set_volume(self.value);
                }}
                tooltipText={bind(audio.defaultSpeaker, 'volume').as(
                  (v) => `${Math.floor(v * 100)}%`
                )}
                onButtonReleaseEvent={(self, event) => {
                  playSound('default');
                }}
                setup={(self) => {
                  self.connect('scroll-event', (self: Astal.Slider, event) => {
                    //@ts-expect-error
                    const direction = event.get_scroll_deltas()[2];
                    if (direction < 0) volumeUp(audio.defaultSpeaker);
                    if (direction > 0) volumeDown(audio.defaultSpeaker);
                  });
                }}
              />
            </box>
            {bind(options).as((_options) => (
              <Dropdown
                reveal={reveal}
                selected={selected}
                options={_options}
                onRealize={getDefaultSpeaker}
                onChange={(_, index) => {
                  if (index) speakers[index].set_is_default(true);
                }}
              />
            ))}
          </box>
        </box>
      );
    };

    const Microphones = (microphones: Wp.Endpoint[]) => {
      const reveal = Variable(false);

      function getOptions() {
        if (microphones.length > 0) {
          return microphones.map((s) => {
            return { name: s.description, icon: 'mic' };
          });
        }
        return [{ name: 'No Inputs Found' }];
      }
      const options = Variable<Option[]>(getOptions());

      function getDefaultMic() {
        const defaultMic = audio?.get_default_microphone();
        const defaultIndex = microphones.findIndex(
          (s) => s.id === defaultMic?.id
        );

        selected.set(defaultIndex || 0);
      }

      const selected = Variable(0);

      return (
        <box spacing={userConfig.appearance.spacing * 2}>
          <box
            vertical
            spacing={userConfig.appearance.spacing}
            css='min-width: 5em;'
            valign={Gtk.Align.CENTER}
          >
            <MaterialIcon icon='mic' size={2.5} />
            <label label='Input' />
          </box>
          <box vertical>
            <box>
              <XButton
                iconObj={{
                  icon: bind(audio.defaultMicrophone, 'volume').as((v) => {
                    if (v === 0) return 'mic_off';
                    return 'mic';
                  }),
                  size: 1.5,
                }}
                className='mute-button'
                onClick={(_: Gtk.Button, event: Astal.ClickEvent) => {
                  if (event.button === Astal.MouseButton.PRIMARY)
                    toggleMute(microphones[selected.get()], true);
                }}
              />
              <slider
                value={bind(audio.defaultMicrophone, 'volume')}
                className='volume-slider'
                hexpand
                onDragged={(self) => {
                  audio.get_default_microphone()?.set_volume(self.value);
                }}
                tooltipText={bind(audio.defaultMicrophone, 'volume').as(
                  (v) => `${Math.floor(v * 100)}%`
                )}
                setup={(self) => {
                  self.connect('scroll-event', (self: Astal.Slider, event) => {
                    //@ts-expect-error
                    const direction = event.get_scroll_deltas()[2];
                    if (direction < 0) volumeUp(audio.defaultMicrophone);
                    if (direction > 0) volumeDown(audio.defaultMicrophone);
                  });
                }}
              />
            </box>
            {bind(options).as((_options) => (
              <Dropdown
                reveal={reveal}
                selected={selected}
                options={_options}
                onRealize={getDefaultMic}
                onChange={(_, index) => {
                  if (index) microphones[index].set_is_default(true);
                }}
              />
            ))}
          </box>
        </box>
      );
    };

    return (
      <Subsection subsection='Audio'>
        <box vertical spacing={userConfig.appearance.spacing * 3}>
          <box />
          {bind(audio, 'speakers').as(Speakers)}
          {bind(audio, 'microphones').as(Microphones)}
          <XButton
            onClick={(self: Astal.Button, event: Astal.ClickEvent) => {
              if (event.button === Astal.MouseButton.PRIMARY) {
                execAsyncClose(userConfig.programs.audioSettings);
              }
            }}
          >
            <box
              hexpand
              spacing={userConfig.appearance.spacing * 2}
              css='font-size: 1em; font-weight: bold;'
            >
              <label
                label='Open Audio Settings / Volume Mixer'
                valign={Gtk.Align.BASELINE}
              />
              <MaterialIcon icon='open_in_new' size={1.25} />
            </box>
          </XButton>
        </box>
      </Subsection>
    );
  } else {
    // Fallback
    return (
      <Subsection subsection='Audio'>
        <box>No Audio Driver</box>
      </Subsection>
    );
  }
};
