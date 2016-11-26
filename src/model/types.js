import { PropTypes } from 'react';
const { number, string, arrayOf, shape } = PropTypes;

export const papers = shape({
  id: number,
  title: string,
  abstract: string,
  citation: string,
  keywords: arrayOf(string),
  authors: arrayOf(string)
});
