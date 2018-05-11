class Node
{
    constructor(weight, position, size, base = 0)
    {
        this.position = position
        this.size = size > 0 ? size : 0
        this.weight = weight
        this.base = base
        this.max = base + weight
        this.volume = weight * size
        this.measure = weight && size
    }

    Distinct(position, size)
    {
        return (position >= this.position + this.size) || (this.position >= position + size)
    }

    Contained(position, size)
    {
        return (position <= this.position) && (this.position + this.size <= position + size)
    }

    Append(weight, position, size, base, texture)
    {
        if (this.Distinct(position, size))
        {
            return
        }
        else
        {
            if (this.left)
            {
                this.left.Append(weight, position, size, base, texture)
                this.right.Append(weight, position, size, base, texture)
            }
            else
            {
                this.left = new Node(weight, this.position, Math.min(this.size, position + size - this.position), base)
                this.left.texture = texture
                this.right = new Node(0, position + size, this.position + this.size - position - size, this.base + this.weight)
            }
            this.max = Math.max(this.left.max, this.right.max)
            this.volume = this.weight * this.size + this.left.volume + this.right.volume
            this.measure = Math.max(this.weight && this.size, this.left.measure + this.right.measure)
        }
    }

    Crop(weight, position, size)
    {
        if (this.Distinct(position, size))
        {
            return
        }
        else
        if (this.left)
        {
            this.left.Crop(weight, position, size)
            this.right.Crop(weight, position, size)
            this.volume = this.weight * this.size + this.left.volume + this.right.volume
            if (this.left.volume + this.right.volume == 0)
            {
                this.max = this.base + this.weight
                this.measure = this.weight && this.size
                delete this.left
                delete this.right
            }
            else
            {
                this.max = Math.max(this.left.max, this.right.max)
                this.measure = Math.max(this.weight && this.size, this.left.measure + this.right.measure)
            }
        }
        else
        if (this.Contained(position, size))
        {
            this.weight -= weight
            this.max -= weight
            this.volume -= weight *  Math.min(this.size, position + size - this.position)
        }
    }

    QueryMax(position, size)
    {
        if (this.Distinct(position, size))
        {
            return 0
        }
        else
        if (this.Contained(position, size))
        {
            return this.max
        }
        else
        {
            return Math.max(this.left ? this.left.QueryMax(position, size) : this.max, this.right ? this.right.QueryMax(position, size) : this.max)
        }
    }
}

module.exports =
class SegmentTree
{
    constructor(size)
    {
        this.root = new Node(0, 0, size)
    }

    Draw()
    {
        this.root.Draw()
    }

    Append(weight, position, size = 1)
    {
        let texture =
        {
            r: Math.floor(Math.random() * 255),
            g: Math.floor(Math.random() * 255),
            b: Math.floor(Math.random() * 255),
        }
        this.root.Append(weight, position, size, this.QueryMax(position, size), texture)
    }

    Crop(weight, position, size = 1)
    {
        this.root.Crop(weight, position, size)
    }

    QueryMax(position, size = 1)
    {
        return this.root.QueryMax(position, size)
    }
}
