import { useEffect, useState } from "react";
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import styles from "./DynamicSearch.module.css";

interface IProps {
    valueProp?: string;
    onFocus?: any;
    onChange?: any;
    onEnterKey?: any;
    clearOnEnterKey?: boolean;
    onFocusOut?: any;
    placeholder?: string;
    searchDisabled?: boolean;
    inputStyles?: string;
    hasSearchIcon?: boolean;
    hasClearIcon?: boolean;
    iconSearchStyles?: string;
    handleOnClear?: any;
}

export default function DynamicSearch({ valueProp, onFocus, onChange, onEnterKey, clearOnEnterKey, onFocusOut, placeholder, searchDisabled, inputStyles, hasSearchIcon, hasClearIcon, iconSearchStyles, handleOnClear }: IProps) {
    
    const [value, setValue] = useState(valueProp || '');

    useEffect(() => {
        if (valueProp?.length) {
            setValue(valueProp);
        }
    }, [valueProp])

    const handleKeyDown = (e: any) => {
        if (e.keyCode === 13 && onEnterKey && !searchDisabled) {
            onEnterKey(e, value.trim());
            if (clearOnEnterKey) {
                setValue('');
            } else {
                setValue(value.trim());
            }
        }
    }

    const onValueChange = (e: any) => {
        const { value } = e.target;
        setValue(value);
        onChange && onChange(value);
    }

    const onClear = (e: any) => {
        setValue('');
        onChange && onChange('');
        handleOnClear && handleOnClear();
    }
    
    return (
        <div className={styles.wrap}>
            <input
                type="text"
                className={`${styles.input} ${inputStyles} ${hasSearchIcon ? styles.searchIcon : ''}`}
                value={value}
                onFocus={onFocus}
                onBlur={onFocusOut}
                placeholder={placeholder || "Search"}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                onChange={onValueChange}
            />
            {
                hasSearchIcon && <IconButton
                    classes={{root: `${styles.iconSearch} ${iconSearchStyles}`}}
                >
                    <SearchIcon />
                </IconButton>
            }
            {
                hasClearIcon && value && <IconButton
                    classes={{root: styles.clearIcon}}
                    onClick={onClear}
                >
                    <ClearIcon />
                </IconButton>
            }
        </div>
    )
}