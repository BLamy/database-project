export const DUCK_NAMESPACE = 'testApp';

const DEFAULT_STATE = {
  didTheThing: false
};

const DO_THE_THING = `${DUCK_NAMESPACE}/DO_THE_THING`;
export const doTheThing = () => (
  { type: DO_THE_THING }
);
const didTheThingReducer = state => (
  { ...state, didTheThing: true }
);

export const reducer = (state = DEFAULT_STATE, { type }) => {
  switch (type) {
    case DEFAULT_STATE:
      return didTheThingReducer(state);
    default:
      return state;
  }
};
