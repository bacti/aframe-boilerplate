require('./zepto')
// import '../libs/aframe/src'
// import { Entity, Scene } from 'aframe-react'
import React from 'react'
import ReactDOM from 'react-dom'
import RollerCoaster from './RollerCoaster'

class App extends React.Component
{
    constructor(props)
    {
        super(props)
    }

    render()
    {
        return <RollerCoaster canvas={document.getElementById('mainCanvas')} />
        // return (
        //     <Scene>
        //         <Entity primitive='a-box' position='-1 0.5 -3' rotation='0 45 0' color='#4CC3D9' />
        //         <Entity primitive='a-sphere' position='0 1.25 -5' radius='1.25' color='#EF2D5E' />
        //         <Entity primitive='a-cylinder' position='1 0.75 -3' radius='0.5' height='1.5' color='#FFC65D' />
        //         <Entity primitive='a-plane' position='0 0 -4' rotation='-90 0 0' width='4' height='4' color='#7BC8A4' />
        //         <Entity primitive='a-sky' color='#ECECEC' />
        //         {/* <Simple canvas={document.getElementById('mainCanvas')} /> */}

        //         <Entity primitive='a-camera'>
        //             <Entity primitive='a-cursor'
        //                 animation__click={{property: 'scale', startEvents: 'click', from: '0.1 0.1 0.1', to: '1 1 1', dur: 150}}
        //             />
        //         </Entity>
        //     </Scene>
        // )
    }
}

window.onload = function()
{
    $('<div></div>').attr('id', 'sceneContainer').css({ width: '100%', height: '100%' }).appendTo(document.body)
    $('<canvas></canvas>')
    .attr({ id: 'mainCanvas', width: window.innerWidth, height: window.innerHeight })
    .css({ width: '100%', height: '100%' })
    .appendTo(document.body)

    ReactDOM.render(<App />, document.getElementById('sceneContainer'))
}
