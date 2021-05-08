import {
  FormControl,
  Input,
  InputProps,
  makeStyles
} from '@material-ui/core';
import { useField } from 'formik';
import React, { FunctionComponent } from 'react';

const useStyles = makeStyles({
  input: {
    flex: 1,
  },
});

export type TextInputProps = Omit<
    InputProps,
    | 'autoComplete'
    | 'autoFocus'
    | 'defaultValue'
    | 'endAdornment'
    | 'error'
    | 'fullWidth'
    | 'inputComponent'
    | 'inputRef'
    | 'onChange'
    | 'startAdornment'
    | 'value'
  >

export interface TextArrayItemProps extends TextInputProps {
  id?: string;
  index: number;
  name: string;
}

export const TextArrayItem: FunctionComponent<TextArrayItemProps> = ({
  id,
  index,
  name,
  ...inputProps
}) => {
  const classes = useStyles();
  const [field, meta] = useField(`${name}[${index}]`);
  const inputId = `${id || name}-${index}`;
  const formError = meta.touched && !!meta.error;

  return (
    <FormControl error={formError} className={classes.input}>
      <Input id={inputId} {...inputProps} {...field} />
    </FormControl>
  );
};
