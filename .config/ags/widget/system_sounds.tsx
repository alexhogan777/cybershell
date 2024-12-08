import { App } from 'astal/gtk3';
import { Variable } from 'astal';
import Hyprland from 'gi://AstalHyprland';
import { playSound } from '../utils/play_sound';
import { userConfig } from '../config/user_config';
import { applySCSS } from '../config/styles';
const hyprland = Hyprland.get_default();

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
