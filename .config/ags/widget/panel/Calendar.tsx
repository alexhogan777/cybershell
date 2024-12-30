// Astal
import { Gtk } from 'astal/gtk3';

// Widgets
import { PanelSection } from './PanelSection';

export const Calendar = () => {
  const title = () => {
    return <label label='Calendar' className='title' valign={Gtk.Align.CENTER} />;
  };

  return (
    <PanelSection section='Calendar' icon='today' title={title()}>
      <box>Hello Calendar!</box>
    </PanelSection>
  );
};
