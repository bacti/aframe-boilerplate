import { combineReducers } from 'redux'

const rootReducer = combineReducers(
{
	currentState: (state = null, action) =>
	{
		return action.type == 'SWITCH_STATE' ? action.state : state
	},
	deltaTime: (state = 0, action) =>
	{
		return action.type == 'UPDATE' ? action.deltaTime : state
	},
	aurora: (state = 0, action) =>
	{
		return action.type == 'AURORA_LOADER' ? action.sprite : state
	},
})
export default rootReducer
