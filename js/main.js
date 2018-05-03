require('./zepto')
import 'aframe'
import { Entity, Scene } from 'aframe-react'
import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component
{
    constructor(props)
    {
        super(props)
    }

    render()
    {
        // <a-scene>
        //     <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
        //     <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
        //     <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
        //     <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
        //     <a-sky color="#ECECEC"></a-sky>
        // </a-scene>

        return (
            <Scene>
                <a-assets>
                    <img id="groundTexture" src="https://cdn.aframe.io/a-painter/images/floor.jpg"/>
                    <img id="skyTexture" src="https://cdn.aframe.io/a-painter/images/sky.jpg"/>
                </a-assets>

                <Entity primitive="a-plane" src="#groundTexture" rotation="-90 0 0" height="100" width="100"/>
                <Entity primitive="a-light" type="ambient" color="#445451"/>
                <Entity primitive="a-light" type="point" intensity="2" position="2 4 4"/>
                <Entity primitive="a-sky" height="2048" radius="30" src="#skyTexture" theta-length="90" width="2048"/>
                <Entity particle-system={{preset: 'snow', particleCount: 2000}}/>
                <Entity text={{value: 'Hello, A-Frame React!', align: 'center'}} position={{x: 0, y: 2, z: -1}}/>

                <Entity id="box"
                    geometry={{primitive: 'box'}}
                    material={{color: this.state.color, opacity: 0.6}}
                    animation__rotate={{property: 'rotation', dur: 2000, loop: true, to: '360 360 360'}}
                    animation__scale={{property: 'scale', dir: 'alternate', dur: 100, loop: true, to: '1.1 1.1 1.1'}}
                    position={{x: 0, y: 1, z: -3}}
                    events={{click: this.changeColor.bind(this)}}
                >
                    <Entity animation__scale={{property: 'scale', dir: 'alternate', dur: 100, loop: true, to: '2 2 2'}}
                        geometry={{primitive: 'box', depth: 0.2, height: 0.2, width: 0.2}}
                        material={{color: '#24CAFF'}}
                    />
                </Entity>

                <Entity primitive="a-camera">
                    <Entity primitive="a-cursor"
                        animation__click={{property: 'scale', startEvents: 'click', from: '0.1 0.1 0.1', to: '1 1 1', dur: 150}}
                    />
                </Entity>
            </Scene>
        )
    }
}

window.onload = function()
{
    $('<div></div>').attr('id', 'root').appendTo(document.body)
    ReactDOM.render(<App/>, document.getElementById('root'))
}
