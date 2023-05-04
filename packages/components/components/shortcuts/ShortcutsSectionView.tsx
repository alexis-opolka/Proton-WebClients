import { Kbd } from '@proton/atoms';

import { classnames } from '../../helpers';

interface Shortcut {
    name: string;
    keys: string | string[];
}

interface Props {
    name: string;
    shortcuts: Shortcut[];
}

const ShortcutsSectionView = ({ name, shortcuts }: Props) => {
    return (
        <div className="mb-8">
            <h2 className="h5 mb-2">{name}</h2>
            {shortcuts.length > 0 && (
                <ul className="unstyled mt-4 on-mobile-pr0 list-2columns-no-break">
                    {shortcuts.map(({ name, keys }) => (
                        <li key={name} className="flex flex-align-items-center flex-justify-space-between mb-2">
                            <span>{name}</span>
                            {typeof keys === 'string' ? (
                                <Kbd shortcut={keys} />
                            ) : (
                                <span>
                                    {keys.map((k: string, i: number) => (
                                        <Kbd
                                            key={`${name} - ${k}`}
                                            shortcut={k}
                                            className={classnames([i > 0 && 'ml-2'])}
                                        >
                                            {k}
                                        </Kbd>
                                    ))}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ShortcutsSectionView;
