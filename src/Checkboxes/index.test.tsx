import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import { Formik, Form } from 'formik';
import React from 'react';
import * as yup from 'yup';
import { Checkboxes, CheckboxOption } from '.';

describe('<Checkboxes />', () => {
  const promise = Promise.resolve();
  const onSubmitMock = jest.fn((_) => promise);
  const options: CheckboxOption[] = [
    {
      label: '5 Apples',
      value: 'apple',
    },
    {
      label: '2 Avocadoes',
      value: 'avocado',
    },
    {
      label: '1 kilo of Grapes',
      value: 'grapes',
    },
  ];
  let element: RenderResult;
  let button: HTMLElement;
  let checkboxForApple: HTMLElement;
  let checkboxForAvocado: HTMLElement;
  let checkboxForGrapes: HTMLElement;

  describe('basic usage', () => {
    type FormValues = { fruits: string[] };
    const initialValue: FormValues = { fruits: ['apple', 'grapes'] };

    beforeEach(() => {
      const formik = (
        <Formik
          initialValues={initialValue}
          onSubmit={(values) => onSubmitMock(values)}
        >
          {({ submitForm }) => (
            <Form>
              <Checkboxes name="fruits" options={options} />
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

      checkboxForApple = element.getByLabelText('5 Apples');
      checkboxForAvocado = element.getByLabelText('2 Avocadoes');
      checkboxForGrapes = element.getByLabelText('1 kilo of Grapes');
      button = element.getByRole('button');
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('apple and grapes are checked, avocado is not', () => {
      expect(checkboxForApple).toBeChecked();
      expect(checkboxForAvocado).not.toBeChecked();
      expect(checkboxForGrapes).toBeChecked();
    });

    test('form submission with initial state', async () => {
      act(() => {
        fireEvent.click(button);
      });

      await waitFor(() => promise);
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith(initialValue);
    });

    test('check the box for avocado and submit the form', async () => {
      act(() => {
        fireEvent.click(checkboxForAvocado);
      });
      act(() => {
        fireEvent.click(button);
      });

      await waitFor(() => promise);
      expect(checkboxForApple).toBeChecked();
      expect(checkboxForAvocado).toBeChecked();
      expect(checkboxForGrapes).toBeChecked();
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith({
        fruits: ['apple', 'grapes', 'avocado'],
      });
    });

    test('uncheck apple and grapes', async () => {
      act(() => {
        fireEvent.click(checkboxForApple);
      });
      act(() => {
        fireEvent.click(checkboxForGrapes);
      });
      act(() => {
        fireEvent.click(button);
      });

      await waitFor(() => promise);
      expect(checkboxForApple).not.toBeChecked();
      expect(checkboxForAvocado).not.toBeChecked();
      expect(checkboxForGrapes).not.toBeChecked();
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith({ fruits: [] });
    });
  });

  describe('with label and validation', () => {
    let helperText: HTMLElement;
    const errorMessage = 'Select at least 1';
    const defaultHelpMessage = 'I am here to help';

    beforeEach(() => {
      const formik = (
        <Formik
          initialValues={{ fruits: [] }}
          validationSchema={yup.object({
            fruits: yup.array().of(yup.string()).min(1, errorMessage),
          })}
          onSubmit={(values) => onSubmitMock(values)}
        >
          {({ submitForm }) => (
            <Form>
              <Checkboxes
                name="fruits"
                label="Pick your favourites"
                helperText={defaultHelpMessage}
                options={options}
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

      checkboxForApple = element.getByLabelText('5 Apples');
      checkboxForAvocado = element.getByLabelText('2 Avocadoes');
      checkboxForGrapes = element.getByLabelText('1 kilo of Grapes');
      helperText = element.getByText(defaultHelpMessage);
      button = element.getByRole('button');
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('No error state initially', () => {
      expect(helperText?.className).not.toContain('error');
    });

    test('touching any box should display error', async () => {
      act(() => {
        fireEvent.blur(checkboxForApple);
      });

      await waitFor(() => promise);
      expect(onSubmitMock).toHaveBeenCalledTimes(0);
      expect(helperText).toContainHTML(errorMessage);
      expect(helperText?.className).toContain('error');
    });

    test('submit form without checking any box should display error', async () => {
      act(() => {
        fireEvent.click(button);
      });

      await waitFor(() => promise);
      expect(onSubmitMock).toHaveBeenCalledTimes(0);
      expect(helperText).toContainHTML(errorMessage);
      expect(helperText?.className).toContain('error');
    });
  });

  describe('with disabled true for formControlProps', () => {
    beforeEach(() => {
      const formik = (
        <Formik
          initialValues={{ fruits: ['apple', 'grapes'] }}
          onSubmit={(values) => onSubmitMock(values)}
        >
          {({ submitForm }) => (
            <Form>
              <Checkboxes
                name="fruits"
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

      checkboxForApple = element.getByLabelText('5 Apples');
      checkboxForAvocado = element.getByLabelText('2 Avocadoes');
      checkboxForGrapes = element.getByLabelText('1 kilo of Grapes');
      button = element.getByRole('button');
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('FormControl is disabled, so all the checkboxes should be disabled', async () => {
      expect(checkboxForApple).toBeDisabled();
      expect(checkboxForAvocado).toBeDisabled();
      expect(checkboxForGrapes).toBeDisabled();

      act(() => {
        fireEvent.click(button);
      });

      await waitFor(() => promise);
      expect(onSubmitMock).toHaveBeenCalledWith({
        fruits: ['apple', 'grapes'],
      });
    });
  });
});
