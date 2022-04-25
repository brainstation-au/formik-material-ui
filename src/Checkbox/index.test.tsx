import {
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formik, Form } from 'formik';
import React from 'react';
import * as yup from 'yup';
import { Checkbox } from '.';

describe('<Checkbox />', () => {
  const promise = Promise.resolve();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmitMock = jest.fn((_) => promise);
  const user = userEvent.setup();

  describe('basic usage', () => {
    type FormValues = { employed: boolean };
    const initialValue: FormValues = { employed: false };

    beforeEach(() => {
      const formik = (
        <Formik
          initialValues={initialValue}
          onSubmit={(values) => onSubmitMock(values)}
        >
          {({ submitForm }) => (
            <Form>
              <Checkbox name="employed" label="Employment Status" />
              <button type="button" onClick={submitForm}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      );

      render(formik);
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('it is unchecked visually', () => {
      expect(screen.getByLabelText('Employment Status')).not.toBeChecked();
    });

    test('form submission with initial state', async () => {
      await user.click(screen.getByRole('button', {name: /submit/i}));

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledTimes(1);
        expect(onSubmitMock).toHaveBeenCalledWith(initialValue);
      });
    });

    test('check the box and submit the form', async () => {
      await user.click(screen.getByLabelText('Employment Status'));
      await user.click(screen.getByRole('button', {name: /submit/i}));

      await waitFor(() => {
        expect(screen.getByLabelText('Employment Status')).toBeChecked();
        expect(onSubmitMock).toHaveBeenCalledTimes(1);
        expect(onSubmitMock).toHaveBeenCalledWith({ employed: true });
      });
    });

    test('check the box twice and submit the form', async () => {
      await user.click(screen.getByLabelText('Employment Status'));
      await user.click(screen.getByLabelText('Employment Status'));
      await user.click(screen.getByRole('button', {name: /submit/i}));

      await waitFor(() => {
        expect(screen.getByLabelText('Employment Status')).not.toBeChecked();
        expect(onSubmitMock).toHaveBeenCalledTimes(1);
        expect(onSubmitMock).toHaveBeenCalledWith(initialValue);
      });
    });
  });

  describe('with validation', () => {
    const errorMessage = 'Must be selected.';
    const defaultHelpMessage = 'I am here to help';

    beforeEach(() => {
      const formik = (
        <Formik
          initialValues={{ employed: false }}
          validationSchema={yup.object({
            employed: yup.boolean().oneOf([true], errorMessage),
          })}
          onSubmit={(values) => onSubmitMock(values)}
        >
          {({ submitForm }) => (
            <Form>
              <Checkbox
                name="employed"
                label="Employment Status"
                helperText={defaultHelpMessage}
                checkboxProps={{ required: true }}
              />
              <button type="button" onClick={submitForm}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      );

      render(formik);
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('No error state initially', () => {
      expect(screen.getByText(defaultHelpMessage).className).not.toContain('error');
      expect(screen.getByText(defaultHelpMessage)).toBeInTheDocument();
    });

    test('submit form without checking the box', async () => {
      await user.click(screen.getByRole('button', {name: /submit/i}));

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledTimes(0);
        expect(() => screen.getByText(defaultHelpMessage)).toThrow();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
        expect(screen.getByText(errorMessage).className).toContain('error');
      });
    });
  });

  describe('with disabled true for formControlProps', () => {
    beforeEach(() => {
      const formik = (
        <Formik
          initialValues={{ employed: false }}
          onSubmit={(values) => onSubmitMock(values)}
        >
          {({ submitForm }) => (
            <Form>
              <Checkbox
                name="employed"
                label="Employment Status"
                formControlLabelProps={{ disabled: true }}
              />
              <button type="button" onClick={submitForm}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      );

      render(formik);
    });

    afterEach(() => {
      onSubmitMock.mockClear();
    });

    test('FormControl is disabled', async () => {
      expect(screen.getByLabelText('Employment Status')).toBeDisabled();
      await user.click(screen.getByRole('button', {name: /submit/i}));

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledWith({ employed: false });
      });
    });
  });
});
