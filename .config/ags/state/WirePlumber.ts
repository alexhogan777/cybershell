// Astal
import { Variable, bind } from 'astal';

// Libraries
import Wp from 'gi://AstalWp';

export const wireplumber = Wp.get_default()?.audio;
export const defaultSpeaker = Variable(wireplumber?.get_default_speaker());
export const defaultSpeakerVolume = Variable(defaultSpeaker.get()?.volume);
export const defaultMicrophone = Variable(
  wireplumber?.get_default_microphone()
);
export const defaultMicrophoneVolume = Variable(
  defaultMicrophone.get()?.volume
);

if (wireplumber) {
  bind(wireplumber, 'defaultSpeaker').subscribe((ds) => defaultSpeaker.set(ds));
  bind(wireplumber.defaultSpeaker, 'volume').subscribe((v) =>
    defaultSpeakerVolume.set(v)
  );
  bind(wireplumber, 'defaultMicrophone').subscribe((dm) =>
    defaultMicrophone.set(dm)
  );
  bind(wireplumber.defaultMicrophone, 'volume').subscribe((v) =>
    defaultMicrophoneVolume.set(v)
  );
}
