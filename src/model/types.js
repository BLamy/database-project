import { PropTypes } from 'react';
const { number, string, arrayOf, shape } = PropTypes;

export const paper = shape({
  id: number,
  title: string,
  abstract: string,
  citation: string,
  keywords: arrayOf(string),
  authors: arrayOf(string)
});

export const user = shape({
  id: number,
  fName: string,
  lName: string,
  email: string
});
