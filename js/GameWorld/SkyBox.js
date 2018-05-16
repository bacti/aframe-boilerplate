import React from 'react'

export default class SkyBox extends React.Component
{
    constructor(props, context)
    {
        super(props, context)
        this.texture = resource.textures['image/background.jpg']
        this.texture.format = THREE.RGBFormat
        this.texture.minFilter = THREE.LinearFilter
        this.texture.magFilter = THREE.LinearFilter
        this.texture.mapping = THREE.UVMapping
        this.InitGeometry()
    }

    componentDidMount()
    {
        this.refs.box.scale(-1, 1, 1)
    }

    render()
    {
        return (
            <mesh>
                <boxGeometry ref='box' width={this.props.size} height={this.props.size} depth={this.props.size} faceVertexUvs={[this.faces]} />
                <meshBasicMaterial map={this.texture} depthTest={false} depthWrite={false} />
            </mesh>
        )
    }

    InitGeometry()
    {
        if (true)
        {
            let image = this.texture.image
            let oneThirdWidth = Math.round(image.width / 3)
            let twoThirdWidth = Math.round(image.width * 2 / 3)
            let halfHeight = Math.round(image.height / 2)
            let calcRoundNumE = (oneThirdWidth - 1) / image.width
            let calcRoundNum2E = (twoThirdWidth - 1) / image.width
            let calcRoundNumS = (oneThirdWidth + 1) / image.width
            let calcRoundNum2S = (twoThirdWidth + 1) / image.width
            let calcMidE = (halfHeight + 1) / image.height
            let calcMidS = (halfHeight - 1) / image.height
            
            let f4 =
            [
                new THREE.Vector2(0, calcMidE),
                new THREE.Vector2(calcRoundNumE, calcMidE),
                new THREE.Vector2(calcRoundNumE, 1),
                new THREE.Vector2(0, 1),
            ]
            let f3 =
            [
                new THREE.Vector2(calcRoundNum2E, 1),
                new THREE.Vector2(calcRoundNumS, 1),
                new THREE.Vector2(calcRoundNumS, calcMidE),
                new THREE.Vector2(calcRoundNum2E, calcMidE),
            ]
            let f2 =
            [
                new THREE.Vector2(calcRoundNum2S, 1),
                new THREE.Vector2(calcRoundNum2S, calcMidE),
                new THREE.Vector2(1, calcMidE),
                new THREE.Vector2(1, 1),
            ]
            let f5 =
            [
                new THREE.Vector2(0, calcMidS),
                new THREE.Vector2(0, 0),
                new THREE.Vector2(calcRoundNumE, 0),
                new THREE.Vector2(calcRoundNumE, calcMidS),
            ]
            let f1 =
            [
                new THREE.Vector2(calcRoundNumS, calcMidS),
                new THREE.Vector2(calcRoundNumS, 0),
                new THREE.Vector2(calcRoundNum2E, 0),
                new THREE.Vector2(calcRoundNum2E, calcMidS),
            ]
            let f6 =
            [
                new THREE.Vector2(calcRoundNum2S, calcMidS),
                new THREE.Vector2(calcRoundNum2S, 0),
                new THREE.Vector2(1, 0),
                new THREE.Vector2(1, calcMidS),
            ]
            this.faces =
            [
                [f1[0], f1[1], f1[3]],
                [f1[1], f1[2], f1[3]],
                [f2[0], f2[1], f2[3]],
                [f2[1], f2[2], f2[3]],
                [f3[0], f3[1], f3[3]],
                [f3[1], f3[2], f3[3]],
                [f4[0], f4[1], f4[3]],
                [f4[1], f4[2], f4[3]],
                [f5[0], f5[1], f5[3]],
                [f5[1], f5[2], f5[3]],
                [f6[0], f6[1], f6[3]],
                [f6[1], f6[2], f6[3]],
            ]
        }
        // else
        // {
        //     geometry = new THREE.SphereGeometry(size, 32, 32, Math.PI * 2)
        //     texture.mapping = THREE.SphericalReflectionMapping
        // }
    }
}