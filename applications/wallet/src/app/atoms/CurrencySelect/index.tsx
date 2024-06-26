import { useCallback, useEffect, useMemo, useState } from 'react';

import { c } from 'ttag';

import generateUID from '@proton/atoms/generateUID';
import { DropdownSizeUnit } from '@proton/components/components/dropdown/utils';
import Option from '@proton/components/components/option/Option';

import { SearchableSelect } from '../Select';
import { currencyFilterFunction, getAllDropdownOptions, getIsCurrencyOption, getSerialisedOption } from './helpers';

interface Props<S extends string, T extends { Symbol: S; Name: string }> {
    /**
     * Popular currency options
     */
    popularSymbols?: S[];
    /**
     * Other currency options
     */
    options: T[];
    value?: S;
    onSelect?: (value: T) => void;
    error?: string;
    hint?: string;
    disabled?: boolean;

    label?: string;
    placeholder?: string;

    dense?: boolean;
    containerClassName?: string;
}

export const CurrencySelect = <S extends string, T extends { Symbol: S; Name: string }>({
    popularSymbols = ['USD', 'CHF', 'EUR', 'GBP', 'CAD', 'CNY'] as S[],
    options,
    value,
    onSelect,
    error,
    hint,
    disabled,
    label,
    placeholder,
    dense,
    containerClassName,
}: Props<S, T>) => {
    const [selectedCurrency, setSelectedCurrency] = useState<S | undefined>(value);

    useEffect(() => {
        if (selectedCurrency !== value) {
            setSelectedCurrency(value);
        }
    }, [selectedCurrency, value]);

    const detailledValue = options.find((opt) => opt.Symbol === selectedCurrency);

    const { allDropdownChildren, onlyOptions } = useMemo(() => {
        const allDropdownChildren = getAllDropdownOptions(popularSymbols, options);
        const onlyOptions = allDropdownChildren.filter(getIsCurrencyOption);

        return { allDropdownChildren, onlyOptions };
    }, [options, popularSymbols]);

    const handleSelectOption = useCallback(
        ({ value }: { value: string | undefined }) => {
            const selectedOption = onlyOptions.find((o) => getSerialisedOption(o) === value);

            if (selectedOption) {
                // no need to `setSelectedCurrency`, will be set in the useEffect above
                onSelect?.(selectedOption);
            }
        },
        [onSelect, onlyOptions]
    );

    const optionsComponents = useMemo(
        () =>
            allDropdownChildren.map((option) => {
                if (option.type === 'option') {
                    const serialised = getSerialisedOption(option);

                    return (
                        <Option key={serialised} value={serialised} title={option.Symbol}>
                            <div className="flex flex-row items-center">
                                <span className="block mr-2">{option.Symbol}</span>
                                <span className="block color-weak">{option.Name}</span>
                            </div>
                        </Option>
                    );
                } else {
                    return (
                        <Option key={generateUID('divider')} value={null} title={option.text} disabled>
                            <span className="text-sm">{option.text}</span>
                        </Option>
                    );
                }
            }),
        [allDropdownChildren]
    );

    return (
        <SearchableSelect<string | undefined>
            id="currency-selector"
            placeholder={placeholder ?? c('Placeholder').t`Search`}
            label={dense ? '' : label ?? c('Label').t`Currency`}
            value={getSerialisedOption(detailledValue)}
            onChange={handleSelectOption}
            search={currencyFilterFunction}
            error={error}
            noSearchResults={<span className="text-bold">{c('Select search results').t`No results found`}</span>}
            hint={hint}
            data-testid="currency-selector"
            disabled={disabled}
            containerClassName={containerClassName}
            renderSelected={(selected) => {
                const option = onlyOptions.find((o) => getSerialisedOption(o) === selected);
                return dense ? (
                    <span className="block mr-2">{option?.Symbol}</span>
                ) : (
                    <div className="flex flex-row items-center">
                        <span className="block mr-2">{option?.Symbol}</span>
                        <span className="block color-weak">{option?.Name}</span>
                    </div>
                );
            }}
            size={{
                width: DropdownSizeUnit.Dynamic,
                maxWidth: DropdownSizeUnit.Viewport,
            }}
        >
            {optionsComponents}
        </SearchableSelect>
    );
};
