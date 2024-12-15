// Widgets
import { BarButton } from './BarButton';

export const Settings = ({ monitorInt }: { monitorInt: number }) => {
  return (
    <BarButton icon='settings' section='Settings' monitorInt={monitorInt} />
  );
};
