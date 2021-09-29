import * as Util from './Util'

describe('Util', () => {
  it('can create easy reducer', () => {
    const reducer      = Util.createReducer(false, {
      ['OFF']: () => false,
      ['ON']:  () => true,
    });
    const initialState = reducer();
    const on           = { type: 'ON' };
    const off          = { type: 'OFF' };
    const stateOn      = reducer(initialState, on);
    const stateOff     = reducer(stateOn, off);

    expect(initialState).toBe(false);
    expect(stateOff).toBe(false);
    expect(stateOn).toBe(true);
  });

  const indexedListMock = [
    { id: 1, name: 'Joris' },
    { id: 2, name: 'Alessandro' },
    { id: 3, name: 'Nicolas' },
  ];

  it('can find an object identified by an id in a list', () => {
    expect(Util.findById(3, indexedListMock)).toEqual(
      { id: 3, name: 'Nicolas' },
    )
  });
});
