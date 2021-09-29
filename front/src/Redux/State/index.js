import { combineReducers } from 'redux'
import { tap, pipe } from 'ramda'
import BrightcovePlayer from './BrightcovePlayer'
import MediaPicker from './MediaPicker/MediaPicker'
import TextEditor from './TextEditor/TextEditor'
import Tweet from './Tweet'

// debug :: ((State, Action *) -> State) -> State -> Action * -> State
export const debug = reducer => (state = reducer(), action = {}) => pipe(
  tap(({ type }) => console.log(`Action :: ${type || 'NONE'}`)),
  tap(({ _, ...payload }) => console.log('Payload ::', payload)),
  tap(() => console.log('InitialState ::', state)),
  action => reducer(state, action),
  tap(newState => console.log('NewState ::', newState)),
  tap(() => console.log("")),
)(action)

// State :: (State, Action *) -> State
export default combineReducers({
  BrightcovePlayer,
  MediaPicker,
  TextEditor,
  Tweet,
})
