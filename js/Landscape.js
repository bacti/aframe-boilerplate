import React from 'react'
import { connect } from 'react-redux'

class Landscape extends React.Component
{
    constructor(props)
    {
		super(props)
    }

    componentWillReceiveProps(props)
    {
        let geometry = this.refs.geometry
        geometry.rotateX(-Math.PI / 2)
        
        let positions = geometry.attributes.position.array
        let vertex = new THREE.Vector3()
        
        for (let i = 0; i < positions.length; i += 3)
        {
            vertex.fromArray(positions, i)
            vertex.x += Math.random() * 10 - 5
            vertex.z += Math.random() * 10 - 5
        
            let distance = (vertex.distanceTo(props.mainScene.position) / 5) - 25
            vertex.y = Math.random() * Math.max(0, distance)
            vertex.toArray(positions, i)
        }
        
        geometry.computeVertexNormals()
    }

    render()
    {
		return (
            <mesh>
                <planeBufferGeometry ref='geometry' width={500} height={500} widthSegments={15} heightSegments={15} />
                <meshLambertMaterial color={0x407000} />
            </mesh>
		)
    }
}

function mapStateToProps(state)
{
    return {
        mainScene: state.mainScene
    }
}

export default connect(mapStateToProps)(Landscape)
