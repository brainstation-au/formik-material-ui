import {
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, Formik } from 'formik';
import React from 'react';
import { RadioGroup, RadioOption } from '.';
import * as yup from 'yup';

describe('<RadioGroupInFormControl />', () => {
  const promise = Promise.resolve();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmitMock = jest.fn((_) => promise);
  let button: HTMLElement;
  let radioFemale: HTMLElement;
  let radioMale: HTMLElement;
  let radioOther: HTMLElement;
  const options: RadioOption[] = [
    {
      label: 'Female',
      value: 'female',
    },
    {
      label: 'Male',
      value: 'male',
    },
    {
      label: 'Other',
      value: 'other',
    },
  ];
  const helperText = 'I am here to help';
  const user = userEvent.setup();

  describe('With basic properties', () => {
    beforeEach(() => {
      const formik = (
        <Formik
          initialValues={{ gender: 'male' }}
          onSubmit={(value) => onSubmitMock(value)}
        >
          {({ submitForm }) => (
            <Form>
              <RadioGroup
                label="Gender"
                name="gender"
                options={options}
                helperText={helperText}
              />
              <button type="button" onClick={submitForm}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      );

      render(formik);

      radioFemale = screen.getByLabelText('Female');
      radioMale = screen.getByLabelText('Male');
      radioOther = screen.getByLabelText('Other');
      button = screen.getByRole('button');
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('default rendering', () => {
      expect(screen.getByLabelText('Gender')).toBeTruthy();
      expect(screen.getByText(helperText)).toBeInTheDocument();
      expect(radioFemale).not.toBeChecked();
      expect(radioMale).toBeChecked();
      expect(radioOther).not.toBeChecked();
    });

    test('form submission with initial state', async () => {
      await user.click(button);

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledTimes(1);
        expect(onSubmitMock).toHaveBeenCalledWith({ gender: 'male' });
      });
    });

    test('change selection and submit the form', async () => {
      await user.click(radioFemale);
      await user.click(button);

      await waitFor(() => {
        expect(radioMale).not.toBeChecked();
        expect(radioFemale).toBeChecked();
        expect(onSubmitMock).toHaveBeenCalledTimes(1);
        expect(onSubmitMock).toHaveBeenCalledWith({ gender: 'female' });
      });
    });
  });

  describe('With validation error', () => {
    beforeEach(() => {
      const formik = (
        <Formik
          initialValues={{ gender: '' }}
          onSubmit={(value) => onSubmitMock(value)}
          validationSchema={yup.object({
            gender: yup
              .string()
              .required('Required')
              .oneOf(['male', 'female'], 'Choose a valid gender'),
          })}
        >
          {({ submitForm }) => (
            <Form>
              <RadioGroup
                label="Gender"
                name="gender"
                options={options}
                helperText={helperText}
              />
              <button type="button" onClick={submitForm}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      );

      render(formik);

      radioFemale = screen.getByLabelText('Female');
      radioMale = screen.getByLabelText('Male');
      radioOther = screen.getByLabelText('Other');
      button = screen.getByRole('button');
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('default rendering', () => {
      expect(radioFemale).not.toBeChecked();
      expect(radioMale).not.toBeChecked();
      expect(radioOther).not.toBeChecked();
    });

    test('form submission with initial state', async () => {
      await user.click(button);

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledTimes(0);
        expect(screen.getByText('Required').className).toContain('error');
      });
    });

    test('choose an invalid option and submit the form', async () => {
      await user.click(radioOther);
      await user.click(button);

      await waitFor(() => {
        expect(radioOther).toBeChecked();
        expect(onSubmitMock).toHaveBeenCalledTimes(0);
        expect(screen.getByText('Choose a valid gender').className).toContain(
          'error'
        );
      });
    });
  });

  describe('With disabled form control', () => {
    beforeEach(() => {
      const formik = (
        <Formik
          initialValues={{ gender: 'male' }}
          onSubmit={(value) => onSubmitMock(value)}
        >
          {({ submitForm }) => (
            <Form>
              <RadioGroup
                name="gender"
                options={options}
                formControlProps={{ disabled: true }}
              />
              <button type="button" onClick={submitForm}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      );

      render(formik);

      radioFemale = screen.getByLabelText('Female');
      radioMale = screen.getByLabelText('Male');
      radioOther = screen.getByLabelText('Other');
      button = screen.getByRole('button');
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('default rendering', () => {
      expect(radioFemale).toBeDisabled();
      expect(radioMale).toBeDisabled();
      expect(radioOther).toBeDisabled();
    });

    test('form submission with initial state', async () => {
      await user.click(button);

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledTimes(1);
        expect(onSubmitMock).toHaveBeenCalledWith({ gender: 'male' });
      });
    });
  });
});
