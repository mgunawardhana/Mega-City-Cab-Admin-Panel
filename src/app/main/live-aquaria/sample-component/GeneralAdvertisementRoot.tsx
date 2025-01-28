import { FuseRouteConfigsType } from '@fuse/utils/FuseUtils';
import GeneralAdvertisementConfig from './root-component/GeneralAdvertisementConfig';
import GeneralAdvertisementPublishConfig from './general-advertisement-publish/GeneralAdvertisementPublishConfig';

const GeneralAdvertisementRoot: FuseRouteConfigsType = [GeneralAdvertisementConfig, GeneralAdvertisementPublishConfig];

export default GeneralAdvertisementRoot;
