import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formik, Form } from 'formik';
import React from 'react';
import * as yup from 'yup';
import { Checkboxes, CheckboxOption } from '.';

describe('<Checkboxes />', () => {
  const promise = Promise.resolve();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  let button: HTMLElement;
  let checkboxForApple: HTMLElement;
  let checkboxForAvocado: HTMLElement;
  let checkboxForGrapes: HTMLElement;
  const user = userEvent.setup();

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

      render(formik);

      checkboxForApple = screen.getByLabelText('5 Apples');
      checkboxForAvocado = screen.getByLabelText('2 Avocadoes');
      checkboxForGrapes = screen.getByLabelText('1 kilo of Grapes');
      button = screen.getByRole('button');
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
      await user.click(button);

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledTimes(1);
        expect(onSubmitMock).toHaveBeenCalledWith(initialValue);
      });
    });

    test('check the box for avocado and submit the form', async () => {
      await user.click(checkboxForAvocado);
      await user.click(button);

      await waitFor(() => {
        expect(checkboxForApple).toBeChecked();
        expect(checkboxForAvocado).toBeChecked();
        expect(checkboxForGrapes).toBeChecked();
        expect(onSubmitMock).toHaveBeenCalledTimes(1);
        expect(onSubmitMock).toHaveBeenCalledWith({
          fruits: ['apple', 'grapes', 'avocado'],
        });
      });
    });

    test('uncheck apple and grapes', async () => {
      await user.click(checkboxForApple);
      await user.click(checkboxForGrapes);
      await user.click(button);

      await waitFor(() => {
        expect(checkboxForApple).not.toBeChecked();
        expect(checkboxForAvocado).not.toBeChecked();
        expect(checkboxForGrapes).not.toBeChecked();
        expect(onSubmitMock).toHaveBeenCalledTimes(1);
        expect(onSubmitMock).toHaveBeenCalledWith({ fruits: [] });
      });
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

      render(formik);

      checkboxForApple = screen.getByLabelText('5 Apples');
      checkboxForAvocado = screen.getByLabelText('2 Avocadoes');
      checkboxForGrapes = screen.getByLabelText('1 kilo of Grapes');
      helperText = screen.getByText(defaultHelpMessage);
      button = screen.getByRole('button');
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('No error state initially', () => {
      expect(helperText.className).not.toContain('error');
    });

    test('touching any box should display error', async () => {
      fireEvent.blur(checkboxForApple);

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledTimes(0);
        expect(helperText).toContainHTML(errorMessage);
        expect(helperText?.className).toContain('error');
      });
    });

    test('submit form without checking any box should display error', async () => {
      await user.click(button);

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledTimes(0);
        expect(helperText).toContainHTML(errorMessage);
        expect(helperText?.className).toContain('error');
      });
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

      render(formik);

      checkboxForApple = screen.getByLabelText('5 Apples');
      checkboxForAvocado = screen.getByLabelText('2 Avocadoes');
      checkboxForGrapes = screen.getByLabelText('1 kilo of Grapes');
      button = screen.getByRole('button');
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('FormControl is disabled, so all the checkboxes should be disabled', async () => {
      expect(checkboxForApple).toBeDisabled();
      expect(checkboxForAvocado).toBeDisabled();
      expect(checkboxForGrapes).toBeDisabled();
      await user.click(button);

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledWith({
          fruits: ['apple', 'grapes'],
        });
      });
    });
  });
});
