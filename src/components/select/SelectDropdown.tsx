import { NativeSelect } from "@mantine/core";
import { useState } from "react";

interface SelectDropdownProps {
    label?: string;
    data: string[] | { value: string; label: string }[];
    onChange?: (value: string) => void;
    disabled?: boolean;
    className?: string;
}

const SelectDropdown = (props: SelectDropdownProps) => {


    const { label, data, onChange, disabled, className } = props;

    const [value, setValue] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = event.currentTarget.value;
        setValue(newValue);
        onChange?.(newValue);
    };


    return (<NativeSelect
        label={label}
        value={value}
        onChange={handleChange}
        data={data}
        disabled={disabled}
        className={className}
    />
    )
}

export default SelectDropdown;