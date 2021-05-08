import { Formik } from 'formik';
import React from 'react';
import renderer from 'react-test-renderer';
import { RadioGroup, RadioOption } from '.';

it('renders correctly', () => {
  type FormValues = { gender: string };
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
  const initialValue: FormValues = { gender: 'female' };
  const promise = Promise.resolve();
  const onSubmitMock = jest.fn((_) => promise);

  const formik = (
    <Formik
      initialValues={initialValue}
      onSubmit={(values) => onSubmitMock(values)}
    >
      <form>
        <RadioGroup name="gender" options={options} />
      </form>
    </Formik>
  );

  const tree = renderer.create(formik).toJSON();
  expect(tree).toMatchSnapshot();
});
