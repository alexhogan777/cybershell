// Astal
import { Variable } from 'astal';

// Libraries
import Hyprland from 'gi://AstalHyprland';
const hyprland = Hyprland.get_default();

// Functions
import { playSound } from '../../utils/play_sound';

export const SystemSounds = () => {
  const popups = Variable(['']);
  return (
    <window
      monitor={0}
      setup={(self) => {
        self.hook(hyprland, 'client-added', (_, client) => {
          if (!client.title) popups.set([...popups.get(), client.address]);
          else playSound('new');
        });
        self.hook(hyprland, 'client-removed', (_, address) => {
          if (popups.get().includes(address))
            popups.set(popups.get().filter((p) => p !== address));
          else playSound('close');
        });
        self.hook(hyprland, 'floating', (self, event) => {
          if (event.floating) playSound('grab');
          if (!event.floating) playSound('drop');
        });
      }}
      onRealize={() => {
        playSound('startup');
      }}
    />
  );
};
