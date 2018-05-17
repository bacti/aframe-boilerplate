export default class DeviceTouchControls
{
	constructor(camera)
	{
        let isTouch = false
        let [pointerDownX, pointerDownY] = [0, 0]
        let [longitudeDown, latitudeDown] = [0, 0]
		this.control =
		{
            longitude: 0,
            latitude: 0,
            phi: 0,
            theta: 0,
        }

        $('#mainCanvas').on(
        {
            touchstart: event =>
            {
				isTouch = true
				let changedTouches = event.originalEvent ? event.originalEvent.changedTouches: event.changedTouches; 
				;[pointerDownX, pointerDownY] = [changedTouches[0].clientX, changedTouches[0].clientY]
				;[longitudeDown, latitudeDown] = [this.control.longitude, this.control.latitude]
            },
            touchmove: event =>
            {
                if (isTouch === true)
                {
                    let changedTouches = event.originalEvent ? event.originalEvent.changedTouches: event.changedTouches; 
                    this.control.longitude = (changedTouches[0].clientX - pointerDownX) * 0.1 + longitudeDown
                    this.control.latitude = (changedTouches[0].clientY - pointerDownY) * 0.1 + latitudeDown
                }
            },
            mousedown: event =>
            {
				isTouch = true
				;[pointerDownX, pointerDownY] = [event.clientX, event.clientY]
				;[longitudeDown, latitudeDown] = [this.control.longitude, this.control.latitude]
            },
            mousemove: event =>
            {
                if (isTouch === true)
                {
                    this.control.longitude = (event.clientX - pointerDownX) * 0.1 + longitudeDown
                    this.control.latitude = (event.clientY - pointerDownY) * 0.1 + latitudeDown
                }
            },
            'touchend mouseup': event =>
            {
                isTouch = false
            },
        })
	}

	Update()
	{
		let camera = this.camera
		let [latitude, longitude, phi, theta, distance] = [this.control.latitude, this.control.longitude, this.control.phi, this.control.theta, this.control.distance]
		latitude = Math.max(-85, Math.min(85, latitude))
		phi = THREE.Math.degToRad(90 - latitude)
		theta = THREE.Math.degToRad(longitude)
		this.camera.position.x = Math.sin(phi) * Math.cos(theta)
		this.camera.position.y = Math.cos(phi)
		this.camera.position.z = Math.sin(phi) * Math.sin(theta)
		this.camera.lookAt(camera.target)
	}
}
