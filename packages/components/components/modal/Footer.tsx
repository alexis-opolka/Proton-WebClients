import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import clsx from '@proton/utils/clsx';

interface Props extends ComponentPropsWithoutRef<'footer'> {
    children?: ReactNode;
    isColumn?: boolean;
}

/**
 * @deprecated Please use ModalTwo instead
 */
const Footer = ({
    children,
    isColumn,
    className = clsx(['flex flex-nowrap', isColumn ? 'flex-column' : 'justify-space-between items-center']),
    ...rest
}: Props) => {
    return (
        <footer className={clsx(['modal-footer', className])} {...rest}>
            {children}
        </footer>
    );
};

export default Footer;
