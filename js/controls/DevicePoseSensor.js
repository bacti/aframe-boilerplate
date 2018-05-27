import PoseSensor from '../../libs/cardboard-vr-display/src/pose-sensor'
import DefaultConfig from '../../libs/webvr-polyfill/src/config'

export default class DevicePoseSensor
{
    constructor(camera)
    {
        this.camera = camera
        this.poseSensor = new PoseSensor(DefaultConfig)
        this.euler = new THREE.Euler()
    }

    Update()
    {
        let [alpha, beta, gamma, orient] = this.poseSensor.getOrientation()
        this.euler.set(beta, alpha, - gamma, 'YXZ')
        this.camera.quaternion.setFromEuler(this.euler)
    }
}