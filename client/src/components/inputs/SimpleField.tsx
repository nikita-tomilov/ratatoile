import React, {useCallback, useState} from "react";
import {Grid, TextField} from "@material-ui/core";

export const someDataNotProvided = "Ошибки в заполнении полей. Проверьте, заполнены ли обязательные поля, а так же являются ли значения допустимыми";
export const emptyValidator = (value: any) => value.toString().length > 0;
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
    const r = RegExp('^(\\+?[0-9]{9,})$');
    const v = value.match(r);
    return v !== null;
}

export const validatePercentage = (value: string)=> {
    const r = RegExp('^[0-9]+$');
    const v = value.match(r);
    const toNum = Number(value);
    console.warn(toNum)
    return v !== null && toNum !== null && toNum >= 0 && toNum <= 100 && toNum === parseInt(value, 10);
}


export const percentageError: string = 'Скидка по карте должна быть целым числом в пределах 0%-100%';
export const phoneError: string = 'Номер телефона должен содержать не менее 9 чисел. Так же вомзожно использования знака + в начале';