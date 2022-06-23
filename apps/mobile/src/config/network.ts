import {ImageSourcePropType} from 'react-native';
import {PolygonLogo} from '../components';

export type Networks = 'Polygon';

type NetworksConfig = {
  name: string;
  color: string;
  logo: ImageSourcePropType;
};

export const NetworksConfig: Record<Networks, NetworksConfig> = {
  Polygon: {
    name: 'Polygon',
    color: '#6561ff',
    logo: PolygonLogo,
  },
};
