// Widgets
import { BarButton } from './BarButton';

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
