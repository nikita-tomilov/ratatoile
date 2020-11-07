import React, {useCallback, useState} from "react";
import {Grid, TextField} from "@material-ui/core";

export const someDataNotProvided = "Ошибки в заполнении полей. Проверьте, заполнены ли обязательные поля, а так же являются ли значения допустимыми";
export const emptyValidator = (value: any) => value.length > 0;
export const positiveNumberValidator = (value: any) => Number(value) !== null && Number(value) > 0;

export type FieldData = {
    label: string;
    id: string;
    // 'null' for signaling that field has invalid value
    onChange: (value: any | null) => void;
    onKeyPress?: (ev: any) => void;
    type: string;
    validator?: (value: string) => boolean;
    validationText?: string;
    isRequired?: boolean;
    startValue?: any;
    isForced?: boolean;
}

export type OptionsFieldData = {
    key: string;
    label: string;
    options: string[];
    onChange: (value: string | null) => void;
}
export const SimpleField = (props: FieldData): JSX.Element => {
    const [error, setError] = useState<boolean>(false);
    const [value, setValue] = useState<string>(props.type === 'date' ? '1970-01-01' : props.startValue ?? '');
    const onChange = useCallback((ev) => {
        setValue(ev.currentTarget.value);
        props.isForced && props.onChange(ev.currentTarget.value);
    }, [props.isForced]);
    const onBlur = useCallback(() => {
        const isValid = props.validator ? props.validator(value) : true;
        props.onChange(isValid ? value : null);
        setError(!isValid);
    }, [props.validator, props.onChange, value])

    return <TextField
        variant="outlined"
        fullWidth
        id={props.id}
        label={props.label}
        name={props.id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        type={props.type}
        onKeyPress={props.onKeyPress}
        helperText={error ? props.validationText ?? '' : ''}
        required={props.isRequired}
        InputLabelProps={{
            shrink: true,
        }}
    />
}

export const FormWrapper = (props: {inputs: JSX.Element[], style?: any}):JSX.Element => {
    return <Grid style={props.style ?? {width: '400px'} } container spacing={2}>
        {props.inputs.map((el, index) => {
            return <Grid item xs={12} key={'grid ' + index}>
                {el}
            </Grid>;
        })}
    </Grid>
}

export const validatePhoneNumber = (value: string) => {
    const r = RegExp('^((\\+7|7|8)?[0-9]{10})$');
    const v = value.match(r);
    return v !== null;
}
