import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { Variable, GLib, bind, Binding } from 'astal';
import { userConfig } from '../../config/user_config';
import { PanelSection } from './PanelSection';

export const Weather = (monitorInt: number) => {
  const title = () => {
    return <label label='Weather' className='title' />;
  };

  return (
    <PanelSection
      monitorInt={monitorInt}
      section='Weather'
      icon='partly_cloudy_day'
      title={title()}
    >
      <box>Hello Weather!</box>
    </PanelSection>
  );
};
