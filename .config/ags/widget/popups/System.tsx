// Astal
import { Gtk } from 'astal/gtk3';
import { Variable, bind, timeout } from 'astal';

// Libraries
import Wp from 'gi://AstalWp';
const audio = Wp.get_default()?.audio;

// Functions
import { getLayout } from '../../utils/get_layout';

export const SystemPopups = ({ monitorInt }: { monitorInt: number }) => {
  const isLeft = getLayout(monitorInt).side === 'left';

  const Volume = () => {
    if (audio) {
      const prevVolume = Variable(audio?.get_default_speaker()?.volume);
      return (
        <revealer
          transitionType={
            isLeft
              ? Gtk.RevealerTransitionType.SLIDE_RIGHT
              : Gtk.RevealerTransitionType.SLIDE_LEFT
          }
          setup={(self) => {
            self.hook(audio.defaultSpeaker, 'notify', (self, v) => {
              const _prevVolume = prevVolume.get();
              const currentVolume = audio.get_default_speaker()?.volume;
              prevVolume.set(currentVolume);
              if (currentVolume !== _prevVolume) self.revealChild = true;
              timeout(2000, () => {
                if (audio.get_default_speaker()?.volume === currentVolume)
                  self.revealChild = false;
              });
            });
          }}
        >
          <box>
            {bind(audio.defaultSpeaker, 'volume').as(
              (v) => `${Math.floor(v * 100)}%`
            )}
          </box>
        </revealer>
      );
    } else {
      return <box />;
    }
  };
  return (
    <box valign={Gtk.Align.END} marginBottom={100}>
      <Volume />
    </box>
  );
};
