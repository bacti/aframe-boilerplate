const PI2 = Math.PI * 2
class Curve
{
    constructor()
    {
        this.vector = new THREE.Vector3()
        this.vector2 = new THREE.Vector3()
    }

    getPointAt(t)
    {
        t = t * PI2

        var x = Math.sin( t * 3 ) * Math.cos( t * 4 ) * 50
        var y = Math.sin( t * 10 ) * 2 + Math.cos( t * 17 ) * 2 + 5
        var z = Math.sin( t ) * Math.sin( t * 4 ) * 50

        return this.vector.set( x, y, z ).multiplyScalar( 2 )
    }

    getTangentAt(t)
    {
        var delta = 0.0001
        var t1 = Math.max( 0, t - delta )
        var t2 = Math.min( 1, t + delta )

        return this.vector2.copy( this.getPointAt ( t2 ) )
            .sub( this.getPointAt( t1 ) ).normalize()
    }
}
export let curve = new Curve()
