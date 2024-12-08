import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { Variable, GLib, bind, Binding } from 'astal';
import { userConfig } from '../../config/user_config';
import { PanelSection } from './PanelSection';

export const Calendar = (monitorInt: number) => {
  const title = () => {
    return (
      <label label='Calendar' className='title' valign={Gtk.Align.CENTER} />
    );
  };

  return (
    <PanelSection
      monitorInt={monitorInt}
      section='Calendar'
      icon='today'
      title={title()}
    >
      <box>Hello Calendar!</box>
    </PanelSection>
  );
};
