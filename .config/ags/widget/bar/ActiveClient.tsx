// Astal
import { bind } from 'astal';

import Hyprland from 'gi://AstalHyprland';

const hyprland = Hyprland.get_default();
const focusedClient = bind(hyprland, 'focusedClient');

export const ActiveClient = () => {
  return focusedClient.as((v) =>
    v ? (
      <box className='active-client' tooltipText={focusedClient.as((v) => v.title)}>
        <icon icon={focusedClient.as((v) => v.initialClass)} css='font-size: 24px;' expand />
      </box>
    ) : (
      <box />
    )
  );
};
