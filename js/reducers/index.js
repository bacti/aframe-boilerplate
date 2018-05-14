import { combineReducers } from 'redux'
import CurrentStateReducer from './CurrentStateReducer'

const rootReducer = combineReducers(
{
	currentState: CurrentStateReducer,
})
export default rootReducer
