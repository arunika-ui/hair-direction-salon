import { Studio } from 'sanity';
import config from '../sanity.config';

export default function StudioApp() {
  return <Studio config={config} />;
}
