import * as React from 'react';
import { IDatePickerInheritedProps } from './types';
import ReactDatepicker, { registerLocale } from 'react-datepicker';
import enGB from 'date-fns/locale/en-GB';
import { ClassNames } from '../utils';
import { Input } from '../../ui';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../src/ui/datepicker/datepicker.module.scss';

const ReactDatepickerElement = ReactDatepicker as any;

registerLocale('en-GB', enGB); // Weeks start on Monday

// accessibility ok+-
// можно обновить до 3.4.1, там со скринридером всё хорошо, не нужны эти костыли, но проблемы с зависимостями
// upd 4.3.0

export const Datepicker: React.FC<IDatePickerInheritedProps> =
React.forwardRef((props, ref) => {
    let {
        className,
        color,
        disabled,
        editable,
        label,
        icon,
        isClearable,
        iconTooltip,
        readOnly,
        selected,
        state,
        value,
        variant,
        onChange,
        ...attributes
    } = props;

    className = ClassNames(
        'kui-datepicker',
        (disabled) ? 'kui-datepicker--disabled' : null,
        (readOnly) ? 'kui-datepicker--readonly' : null,
        className
    );

    const datepickerRef = React.useRef(null);
    const pickerRef = React.useRef(null);
    const [isSafari, _setSafari] = React.useState(false);
    const data = React.useRef({ isSafari });
    data.current = { isSafari };
    const setSafari = (isSafari: boolean) => {
        data.current = { isSafari };
        _setSafari(isSafari)
    }

    isClearable = readOnly || disabled ? false : isClearable;
    editable = readOnly || disabled ? false : editable;

    const inputAttributes = {
        color,
        editable,
        icon,
        isClearable,
        iconTooltip,
        label,
        readOnly,
        ref,
        state,
        value,
        variant,
        onEnter: () => {
            if (!pickerRef.current.isCalendarOpen()) {
                pickerRef.current.onInputClick(); // open dropdown
            }
        }
    };

    const onChangeHandler = (date: Date) => {
        if (onChange) onChange(date);
        setTimeout(()=>{
            if (document.activeElement === document.body) { // фокус отвалился, вернуть фокус инпуту
                const input = datepickerRef.current.querySelector('input') as HTMLElement;
                if (input) input.focus();
            }
        }, 100);
    }

    const onFocusHandler = (e: React.FocusEvent) => {
        console.log(isSafari);
        if (data.current.isSafari) {
            console.log(e, document.activeElement);
            const activeElement = document.activeElement as HTMLElement;
            activeElement.blur();
        }
    }

    const onBlurHandler = (e: React.FocusEvent) => {
        if (e && e.relatedTarget) {
            const closest = e.relatedTarget.closest('.kui-datepicker');
            if (closest && closest === datepickerRef.current) return;
        }
        pickerRef.current.setOpen(false); // был баг: если убрать фокус табом, календарь не закрывается
    }

    React.useEffect(() => {
        if (data.current.isSafari) {
            /**
            * в сафари фокус постоянно скачет, пока единственное решение - сделать инпуты readonly
            */
            const input = datepickerRef.current.querySelector('input') as HTMLElement;
            if (input) input.setAttribute('readonly', 'readonly');
            // в сафари все календари открываются сами
            setTimeout(() => {
                setSafari(false);
            }, 5000);
        }
    }, [isSafari]);

    React.useEffect(() => {
        if (navigator.userAgent.includes('Mac')) {
            setSafari(true);
        }
    }, []);

    return (
        <div
            className={className}
            ref={datepickerRef}
            tabIndex={-1}
            onFocus={onFocusHandler}
            onBlur={onBlurHandler}
        >
            <ReactDatepickerElement
                customInput={<Input {...inputAttributes}/>}
                disabled={disabled || isSafari}
                locale="en-GB"
                readOnly={readOnly}
                ref={pickerRef}
                selected={selected}
                onChange={onChangeHandler}
                {...attributes}
            />
        </div>
    );
});

Datepicker.defaultProps = {
    color: null,
    dateFormat: 'd MMM yyyy',
    editable: true,
    isClearable: true,
    iconTooltip: null,
    label: null,
    selected: null,
    value: '',
    variant: 'datepicker',
    onChange: (): void => undefined
};

Datepicker.displayName = 'Datepicker';
