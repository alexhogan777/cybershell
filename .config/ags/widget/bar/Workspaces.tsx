// Astal
import { Gtk } from 'astal/gtk3';
import { bind } from 'astal';

// Libraries
import Hyprland from 'gi://AstalHyprland';
const hyprland = Hyprland.get_default();

// Config
import { userConfig } from '../../config/user_config';
import Config from '../../state/config/config';
const spacing = Config.get_default().appearance.paddingBase;

// Functions
import { playSound } from '../../utils/play_sound';

// Variables
const scratchID = -99;

export const Workspaces = ({ monitorInt }: { monitorInt: number }) => {
  function getChildren() {
    if (userConfig.bar.workspaces.showInactive) {
      let wss = Array.from(
        { length: userConfig.bar.workspaces.numShown },
        (_, i) => i + 1
      );
      if (userConfig.bar.workspaces.showScratch) wss = [scratchID, ...wss];

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
            self.toggleClassName(
              'focused',
              hyprland.get_focused_workspace().id === ws
            );
            self.toggleClassName(
              'real',
              hyprland
                .get_workspaces()
                .map((rws) => rws.id)
                .includes(ws) && userConfig.bar.workspaces.showInactive
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
        vertical={true}
        spacing={spacing}
        halign={Gtk.Align.CENTER}
      >
        {getChildren()}
      </box>
    </eventbox>
  );
};
