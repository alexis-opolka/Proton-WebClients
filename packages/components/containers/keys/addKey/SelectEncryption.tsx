import { Dispatch, SetStateAction } from 'react';
import { c } from 'ttag';
import { ENCRYPTION_TYPES } from '@proton/shared/lib/constants';
import { Radio, Row } from '../../../components';

const { RSA4096, CURVE25519 } = ENCRYPTION_TYPES;

interface Props {
    encryptionType: string;
    setEncryptionType: Dispatch<SetStateAction<ENCRYPTION_TYPES>>;
}
const SelectEncryption = ({ encryptionType, setEncryptionType }: Props) => {
    const stateOfTheArt = <strong key="CURVE25519">{c('encryption').t`State of the art`}</strong>;
    const highestSecurity = <strong key="RSA4096">{c('encryption').t`Compatibility`}</strong>;

    const radios = [
        {
            label: c('Option').jt`${stateOfTheArt} ECC Curve25519 (Fastest, most modern)`,
            value: CURVE25519,
        },
        {
            label: c('Option')
                .jt`${highestSecurity} RSA 4096-bit (Slower, but increased compatibility with legacy software)`,
            value: RSA4096,
        },
    ];

    return (
        <>
            {radios.map(({ label, value }, i) => {
                const id = i.toString();
                return (
                    <Row key={i}>
                        <Radio
                            id={`encryptionChoice${id}`}
                            name="encryptionType"
                            checked={value === encryptionType}
                            onChange={() => setEncryptionType(value)}
                        >
                            <span className="flex-item-fluid">{label}</span>
                        </Radio>
                    </Row>
                );
            })}
        </>
    );
};

export default SelectEncryption;
