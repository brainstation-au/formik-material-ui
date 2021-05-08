import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { RadioGroup, RadioOption } from '.';
import * as yup from 'yup';

describe('<RadioGroupInFormControl />', () => {
  const promise = Promise.resolve();
  const onSubmitMock = jest.fn((_) => promise);
  let element: RenderResult;
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

      act(() => {
        element = render(formik);
      });

      radioFemale = element.getByLabelText('Female');
      radioMale = element.getByLabelText('Male');
      radioOther = element.getByLabelText('Other');
      button = element.getByRole('button');
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('default rendering', () => {
      expect(element.getByLabelText('Gender')).toBeTruthy();
      expect(element.getByText(helperText)).toBeTruthy();
      expect(radioFemale).not.toBeChecked();
      expect(radioMale).toBeChecked();
      expect(radioOther).not.toBeChecked();
    });

    test('form submission with initial state', async () => {
      act(() => {
        fireEvent.click(button);
      });

      await waitFor(() => promise);
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith({ gender: 'male' });
    });

    test('change selection and submit the form', async () => {
      act(() => {
        fireEvent.click(radioFemale);
      });
      act(() => {
        fireEvent.click(button);
      });

      await waitFor(() => promise);
      expect(radioMale).not.toBeChecked();
      expect(radioFemale).toBeChecked();
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith({ gender: 'female' });
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

      act(() => {
        element = render(formik);
      });

      radioFemale = element.getByLabelText('Female');
      radioMale = element.getByLabelText('Male');
      radioOther = element.getByLabelText('Other');
      button = element.getByRole('button');
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
      act(() => {
        fireEvent.click(button);
      });

      await waitFor(() => promise);
      expect(onSubmitMock).toHaveBeenCalledTimes(0);
      expect(element.getByText('Required').className).toContain('error');
    });

    test('choose an invalid option and submit the form', async () => {
      act(() => {
        fireEvent.click(radioOther);
      });
      act(() => {
        fireEvent.click(button);
      });

      await waitFor(() => promise);
      expect(radioOther).toBeChecked();
      expect(onSubmitMock).toHaveBeenCalledTimes(0);
      expect(element.getByText('Choose a valid gender').className).toContain(
        'error'
      );
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

      act(() => {
        element = render(formik);
      });

      radioFemale = element.getByLabelText('Female');
      radioMale = element.getByLabelText('Male');
      radioOther = element.getByLabelText('Other');
      button = element.getByRole('button');
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
      act(() => {
        fireEvent.click(button);
      });

      await waitFor(() => promise);
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith({ gender: 'male' });
    });
  });
});
