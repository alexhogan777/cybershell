import { App, Astal, Gtk, Gdk } from 'astal/gtk3';
import { Variable, GLib, bind } from 'astal';
import { BarButton } from './BarButton';
import { getLayout } from '../../utils/get_layout';

export const Search = ({ monitorInt }: { monitorInt: number }) => {
  return (
    <BarButton
      icon='search'
      section='Search'
      monitorInt={monitorInt}
      tooltipText='Search'
    />
  );
};
