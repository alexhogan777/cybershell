// Astal
import { Gtk } from 'astal/gtk3';
import { bind, Binding, Variable } from 'astal';

// Libraries
import Hyprland from 'gi://AstalHyprland';
const hyprland = Hyprland.get_default();

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

// Functions
import { playSound } from '../../utils/play_sound';

// Variables
const scratchID = -99;

export const Workspaces = ({ vertical }: { vertical: Binding<boolean> }) => {
  function getChildren() {
    if (config.bar.wsInactive) {
      let wss = Array.from({ length: config.bar.wsNumber }, (_, i) => i + 1);
      if (config.bar.wsScratch) wss = [scratchID, ...wss];

      return wss.map(workspacebutton);
    }

    return bind(hyprland, 'workspaces').as((wss) =>
      wss.sort((a, b) => a.id - b.id).map(({ id }) => workspacebutton(id))
    );
  }

  const workspacebutton = (ws: number) => {
    return (
      <button
        onClicked={() => {
          playSound('button');
          if (ws === scratchID) hyprland.dispatch('togglespecialworkspace', '');
          hyprland.dispatch('workspace', `${ws}`);
        }}
        onHover={() => {
          playSound('hover');
        }}
        halign={Gtk.Align.CENTER}
        cursor='pointer'
        setup={(self) => {
          function update() {
            self.toggleClassName('focused', hyprland.get_focused_workspace().id === ws);
            self.toggleClassName(
              'real',
              hyprland
                .get_workspaces()
                .map((rws) => rws.id)
                .includes(ws) && config.bar.wsInactive
            );
            ws === scratchID &&
              self.toggleClassName(
                'focused',
                hyprland
                  .get_workspaces()
                  .map((ws) => ws.id)
                  .includes(scratchID)
              );
          }
          self.hook(hyprland, 'event', update);
        }}
      >
        {ws === scratchID ? 'S' : ws}
      </button>
    );
  };

  return (
    <eventbox
      onScroll={(_, event) => {
        if (event.delta_y > 0) hyprland.dispatch('workspace', '+1');
        if (event.delta_y < 0) hyprland.dispatch('workspace', '-1');
      }}
    >
      <box
        className='Workspaces'
        vertical={vertical}
        spacing={spacing}
        halign={Gtk.Align.CENTER}
        setup={(self) => {
          //@ts-expect-error
          self.hook(config.bar, 'updated', (_, v) => (self.children = getChildren()));
        }}
      >
        {getChildren()}
      </box>
    </eventbox>
  );
};
