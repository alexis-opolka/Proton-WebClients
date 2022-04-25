import { AppLink, AppLinkProps } from '@proton/components';

import { useConfig } from '../../hooks';
import Logo from './Logo';

const MainLogo = (props: AppLinkProps) => {
    const { APP_NAME } = useConfig();

    return (
        <AppLink toApp={APP_NAME} target="_self" {...props}>
            <Logo appName={APP_NAME} />
        </AppLink>
    );
};

export default MainLogo;
