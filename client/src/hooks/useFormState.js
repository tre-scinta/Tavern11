import { useState, useCallback } from 'react';
import fetchJSON from '../utils/fetchJSON';

export default function useFormState(initialValues) {
  const [values, setValues] = useState(initialValues);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setValues(values => ({ ...values, [name]: value }));
  }, []);

  return [values, handleChange, setValues];
}