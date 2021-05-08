import { Formik } from 'formik';
import React from 'react';
import renderer from 'react-test-renderer';
import { Checkboxes, CheckboxOption } from '.';

it('renders correctly', () => {
  type FormValues = { fruits: string[] };
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
  const initialValue: FormValues = { fruits: ['apple', 'grapes'] };
  const promise = Promise.resolve();
  const onSubmitMock = jest.fn((_) => promise);

  const formik = (
    <Formik
      initialValues={initialValue}
      onSubmit={(values) => onSubmitMock(values)}
    >
      <form>
        <Checkboxes name="fruits" options={options} />
      </form>
    </Formik>
  );

  const tree = renderer.create(formik).toJSON();
  expect(tree).toMatchSnapshot();
});
