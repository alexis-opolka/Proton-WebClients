import type { ChangeEvent, VFC } from 'react';

import type { FieldInputProps, FormikErrors } from 'formik';
import { c } from 'ttag';

import { Button } from '@proton/atoms/Button';
import type { IconName } from '@proton/components/components';
import { Icon } from '@proton/components/components';
import type { ExtraFieldType, ItemExtraField } from '@proton/pass/types';
import { partialMerge } from '@proton/pass/utils/object';
import clsx from '@proton/utils/clsx';

import type { FieldBoxProps } from '../Layout/FieldBox';
import { FieldBox } from '../Layout/FieldBox';
import type { BaseTextFieldProps } from '../TextField';
import { BaseTextField } from '../TextField';

type ExtraFieldOption = {
    icon: IconName;
    label: string;
    placeholder: string;
};

type ExtraFieldError<T extends ExtraFieldType> = FormikErrors<ItemExtraField<T>>;

export type ExtraFieldProps = FieldBoxProps &
    Omit<BaseTextFieldProps, 'field' | 'placeholder' | 'error'> & {
        type: ExtraFieldType;
        field: FieldInputProps<ItemExtraField>;
        error?: ExtraFieldError<ExtraFieldType>;
        touched?: boolean;
        autoFocus?: boolean;
        onDelete: () => void;
    };

export const getExtraFieldOptions = (): Record<ExtraFieldType, ExtraFieldOption> => ({
    totp: {
        icon: 'lock',
        label: c('Label').t`2FA secret (TOTP)`,
        placeholder: c('Placeholder').t`Add 2FA secret`,
    },
    text: {
        icon: 'text-align-left',
        label: c('Label').t`Text`,
        placeholder: c('Placeholder').t`Add text`,
    },
    hidden: {
        icon: 'eye-slash',
        label: c('Label').t`Hidden`,
        placeholder: c('Placeholder').t`Add hidden text`,
    },
});

export const getExtraFieldOption = (type: ExtraFieldType) => getExtraFieldOptions()[type];

const DeleteButton: VFC<{ onDelete: () => void }> = ({ onDelete }) => (
    <Button icon pill color="weak" onClick={onDelete} shape="solid" size="medium" title={c('Action').t`Delete`}>
        <Icon name="cross" size={20} />
    </Button>
);

export const ExtraFieldComponent: VFC<ExtraFieldProps> = (props) => {
    const { className, field, onDelete, type, error, touched, autoFocus, ...rest } = props;
    const { icon, placeholder } = getExtraFieldOption(type);

    const onChangeHandler =
        (merge: (evt: ChangeEvent<HTMLInputElement>, field: ItemExtraField) => ItemExtraField) =>
        (evt: ChangeEvent<HTMLInputElement>) => {
            props.form.setFieldValue(field.name, merge(evt, props.field.value));
        };

    return (
        <FieldBox actions={[<DeleteButton onDelete={onDelete} />]} className={className} icon={icon}>
            <BaseTextField
                className="field-two-label color-weak text-sm"
                inputClassName={clsx(touched && error?.fieldName && 'placeholder-danger')}
                placeholder={c('Label').t`Label`}
                autoFocus={autoFocus}
                field={{
                    ...field,
                    value: field.value.fieldName,
                    onChange: onChangeHandler((evt, values) => partialMerge(values, { fieldName: evt.target.value })),
                }}
                {...rest}
            />

            {(() => {
                switch (field.value.type) {
                    case 'text':
                    case 'hidden': {
                        const fieldError = error as ExtraFieldError<'text' | 'hidden'>;
                        return (
                            <BaseTextField
                                placeholder={placeholder}
                                error={touched && fieldError?.data?.content}
                                field={{
                                    ...field,
                                    value: field.value.data.content,
                                    onChange: onChangeHandler((evt, values) =>
                                        partialMerge(values, { data: { content: evt.target.value } })
                                    ),
                                }}
                                {...rest}
                            />
                        );
                    }
                    case 'totp': {
                        const fieldError = error as ExtraFieldError<'totp'>;
                        return (
                            <BaseTextField
                                placeholder={placeholder}
                                error={touched && fieldError?.data?.totpUri}
                                field={{
                                    ...field,
                                    value: field.value.data.totpUri,
                                    onChange: onChangeHandler((evt, values) =>
                                        partialMerge(values, { data: { totpUri: evt.target.value } })
                                    ),
                                }}
                                {...rest}
                            />
                        );
                    }
                }
            })()}
        </FieldBox>
    );
};
