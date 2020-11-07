import React, {useCallback, useState} from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {TextField} from "@material-ui/core";
import {OptionsFieldData} from "./SimpleField";

export const OptionsField = (props: OptionsFieldData): JSX.Element => {
    const [value, setValue] = useState<string>('');
    const onChange = useCallback((ev, val) => setValue(val), []);
    const onBlur = useCallback(() => props.onChange(value), [props.onChange, value])

    return <Autocomplete
        value={value}
        fullWidth
        onChange={onChange}
        id={props.key}
        options={props.options}
        onBlur={onBlur}
        renderInput={(params: any) => (
            <TextField {...params} label={props.label} variant="outlined" />
        )}
    />;
}

