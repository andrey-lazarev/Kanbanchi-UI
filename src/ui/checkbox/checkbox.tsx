import * as React from 'react';
import { ICheckboxInheritedProps } from './types';
import { ClassNames } from '../utils';
import { Icon, Label } from '../../ui';
import '../../../src/ui/checkbox/checkbox.module.scss';

// accessibility ok

export const Checkbox: React.SFC<ICheckboxInheritedProps> =
React.forwardRef((props, ref) => {
    let {
        children,
        className,
        checked,
        color,
        onChange,
        ...attributesOriginal
    } = props,
        attributes: React.InputHTMLAttributes<HTMLElement> = attributesOriginal;

    const [isChecked, setIsChecked] = React.useState(checked);

    className = ClassNames(
        'kui-checkbox',
        (color) ? 'kui-checkbox--color_' + color : null,
        (props.disabled) ? 'kui-checkbox--disabled' : null,
        className
    );

    attributes.type = 'checkbox';
    attributes.className = 'kui-checkbox__input';
    attributes.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(!isChecked);
        if (onChange) onChange(e);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (!e || attributes.disabled) return;
        if (e.key === ' ') {
            e.preventDefault();
            attributes.onChange(e as any);
        }
    }

    React.useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    return (
        <Label
            className={className}
            ref={ref as any}
            tabIndex={0}
            role={'checkbox'}
            aria-checked={isChecked}
            aria-disabled={attributes.disabled}
            onKeyDown={onKeyDown}
        >
            <input checked={isChecked} {...attributes}/>
            <span className="kui-checkbox__label">
                {children}
                <Icon className="kui-checkbox__checkmark" xlink="done"/>
            </span>
        </Label>
    );
});

Checkbox.defaultProps = {
    checked: false,
    onChange: (): void => undefined,
    color: null
}

Checkbox.displayName = 'Checkbox';
