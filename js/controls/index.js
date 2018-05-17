require('./DeviceOrientationControls')
import DeviceTouchControls from './DeviceTouchControls'

export default class DeviceControl
{
    constructor(camera)
    {
        this.control = new DeviceTouchControls(camera)
        window.addEventListener('deviceorientation', evt =>
        {
            let [alpha, beta, gamma] = [evt.alpha, evt.beta, evt.gamma]
            if (!(alpha && beta && gamma))
            {
                window.removeEventListener('deviceorientation', _)
            }
            else
            {
                this.control = new THREE.DeviceOrientationControls(camera)
            }
        }, false)
    }

    Update()
    {
        if (!this.control)
            return
        this.control.Update()
    }
}
