// Astal
import { Variable, bind, execAsync } from 'astal';

// Widgets
import { MaterialIcon } from '../../common/MaterialIcon';

const ramUsage = Variable<any>('').poll(5000, () =>
  execAsync([
    'bash',
    '-c',
    `LANG=C free | awk '/^Mem/ {printf("%.2f\\n", ($3/$2) * 100)}'`,
  ])
    .then((out) => `${out}`)
    .catch(print)
);
const cpuUsage = Variable<any>('0.00');
const diskUsage = Variable<any>('0.00');
const gpuUsage = Variable<any>('0.00');

function getIcon(resource: string) {
  switch (resource) {
    case 'RAM':
      return 'memory_alt';
    case 'CPU':
      return 'memory';
    case 'Disk':
      return 'hard_drive';
    case 'GPU':
      return 'settop_component';
    default:
      return '';
  }
}

const Resource = ({ resource, value }: any) => {
  return (
    <circularprogress
      name={resource}
      className='resource'
      rounded
      value={bind(value).as((v: any) => {
        return parseFloat(v) / 100;
      })}
      tooltipText={bind(value).as((v) => `${resource}: ${v}%`)}
    >
      <MaterialIcon icon={getIcon(resource)} size={4} css='color: white;' />
    </circularprogress>
  );
};
export const Resources = () => {
  const resourceArr = ['CPU', 'RAM', 'Disk', 'GPU'];
  const currentResource = Variable(0);
  return (
    <eventbox
      onScroll={(self, event) => {
        function increment() {
          currentResource.set(currentResource.get() + 1);
          if (currentResource.get() > resourceArr.length - 1)
            currentResource.set(0);
        }
        function decrement() {
          currentResource.set(currentResource.get() - 1);
          if (currentResource.get() < 0)
            currentResource.set(resourceArr.length - 1);
        }
        if (event.delta_y > 0) increment();
        if (event.delta_y < 0) decrement();
      }}
    >
      <stack visibleChildName={bind(currentResource).as((v) => resourceArr[v])}>
        <Resource resource='RAM' value={ramUsage} />
        <Resource resource='CPU' value={cpuUsage} />
        <Resource resource='Disk' value={diskUsage} />
        <Resource resource='GPU' value={gpuUsage} />
      </stack>
    </eventbox>
  );
};
