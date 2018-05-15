import SwitchState from './SwitchState'
import Update from './Update'

export default
{
    SwitchState: SwitchState,
    Update: Update,
    AuroraLoader: sprite =>
    {
        return {
            type: 'AURORA_LOADER',
            payload: sprite,
        }
    }
}