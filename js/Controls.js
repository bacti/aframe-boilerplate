import React from 'react'
import React3 from '../libs/react-three-renderer/src' 

export default class Controls extends React.Component
{
    constructor(props, context)
    {
        super(props, context)

        this.OnAnimate = _ =>
        {
        }
    }

    componentDidMount()
    {
    }

    render()
    {
        let width = window.innerWidth
        let height = window.innerHeight
        return (
            <React3 mainCamera='perspective' width={width} height={height} antialias={true}
                canvas={this.props.canvas}
                onAnimate={this.OnAnimate}
            >
            </React3>
        )
    }
}
