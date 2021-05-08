import MomentUtils from '@date-io/moment';
import {
  DatePicker as MuiDatePicker,
  DatePickerProps as MuiDatePickerProps, MuiPickersUtilsProvider
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { useField } from 'formik';
import moment from 'moment';
import React, { FunctionComponent } from 'react';

export interface DatePickerProps
  extends Omit<
    MuiDatePickerProps,
    'error' | 'format' | 'name' | 'onBlur' | 'onChange' | 'onError' | 'value'
  > {
  name: string;
  format: string;
}

export const DatePicker: FunctionComponent<DatePickerProps> = ({
  name,
  format,
  helperText,
  ...otherProps
}) => {
  const [field, meta, helpers] = useField<string>(name);
  const initialValue = field.value ? moment(field.value, format) : null;
  const datepickerOnChange = (date: MaterialUiPickersDate) => {
    const selectedDate = date ? date.format(format) : '';
    helpers.setValue(selectedDate);
  };
  const formError = meta.touched && !!meta.error;

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <MuiDatePicker
        value={initialValue}
        onChange={datepickerOnChange}
        format={format}
        name={name}
        helperText={formError ? meta.error : helperText}
        error={formError}
        {...otherProps}
      />
    </MuiPickersUtilsProvider>
  );
};
