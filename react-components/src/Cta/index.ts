import { Scanner } from '../Scanner';
import Cta from './Cta';

export * from './Cta';
export default Cta;

new Scanner({
  cta: () => import('./Cta')
}).init();
