import type { ReactNode } from 'react';

interface Props {
    left: ReactNode;
    text: ReactNode;
}

const FeatureItem = ({ left, text }: Props) => {
    return (
        <div className="flex-1 md:flex-initial flex flex-nowrap items-center text-center flex-column md:flex-row justify-start">
            <div className="md:mr-4 text-center">{left}</div>
            <div className="color-weak text-hyphens">{text}</div>
        </div>
    );
};

export default FeatureItem;
