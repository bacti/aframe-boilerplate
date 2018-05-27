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
	size: (state = 0, action) =>
	{
		return action.type == 'RESIZE' ? action.size :
			{ INTERSTITIAL_WIDTH: 1334, INTERSTITIAL_HEIGHT: 1334 * window.innerHeight / window.innerWidth }
	},
})
export default rootReducer
