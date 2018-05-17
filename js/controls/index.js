require('./DeviceOrientationControls')
import DeviceTouchControls from './DeviceTouchControls'

export default class DeviceControl
{
    constructor(camera)
    {
        this.control = new DeviceTouchControls(camera)
        let ScreenOrientationTest = evt =>
        {
            window.removeEventListener('deviceorientation', ScreenOrientationTest, false)
            let [alpha, beta, gamma] = [evt.alpha, evt.beta, evt.gamma]
            if (alpha || beta || gamma)
            {
                this.control = new THREE.DeviceOrientationControls(camera)
            }
        }
        window.addEventListener('deviceorientation', ScreenOrientationTest, false)
    }

    Update()
    {
        if (!this.control)
            return
        this.control.Update()
    }
}
