import { combineReducers } from 'redux'

const rootReducer = combineReducers(
{
	currentState: (state = null, action) =>
	{
		switch (action.type)
		{
			case 'SWITCH_STATE': 
				return action.payload
		}
		return state
	},
	deltaTime: (state = 0, action) =>
	{
		switch (action.type)
		{
			case 'UPDATE': 
				return action.payload
		}
		return state
	},
	aurora: (state = 0, action) =>
	{
		switch (action.type)
		{
			case 'AURORA_LOADER': 
				return action.payload
		}
		return state
	},
})
export default rootReducer
