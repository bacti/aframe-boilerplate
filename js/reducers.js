import { combineReducers } from 'redux'

const rootReducer = combineReducers(
{
	mainScene: (state = null, action) =>
	{
		switch (action.type)
		{
			case 'MAIN_SCENE':
				return action.payload
		}
		return state
	},
	landscape: (state = null, action) =>
	{
		switch (action.type)
		{
			case 'LANDSCAPE':
				return action.payload
		}
		return state
	},
})
export default rootReducer
