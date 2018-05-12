import React from 'react'
import Jasmine from '../libs/jasmine/' 

export default class BaseGUI extends React.Component
{
	render()
	{
        let objects = [...Array(2000)].map((_, index) =>
        {
            return (
                <mesh key={index}
                    position={new THREE.Vector3(Math.random() * 800 - 400, Math.random() * 800 - 400, Math.random() * 800 - 400)}
                    rotation={new THREE.Euler(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI)}
                    scale={new THREE.Vector3(Math.random() + 0.5, Math.random() + 0.5, Math.random() + 0.5)}
                >
                    <boxGeometry width={20} height={20} depth={20} />
                    <meshLambertMaterial color={Math.random() * 0xffffff} />
                </mesh>
            )
        })
		return <object3D>{objects}</object3D>
	}
}
