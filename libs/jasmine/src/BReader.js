const MAX_VALUE =
{
    1: Math.pow(2, 8),
    2: Math.pow(2, 16),
    4: Math.pow(2, 32),
    8: Math.pow(2, 64),
}

export default class BReader
{
    constructor(buffer)
    {
        this.data = []
        if (typeof Uint8Array != 'undefined')
        {
            this.data = new Uint8Array(buffer)
        }
        else
        {
            let dataview = new DataView(buffer)
            for (let i = 0; i < buffer.byteLength; i++)
            {
                this.data[i] = dataview.getUint8(i)
            }
        }
        this.index = 0
    }

    Read(number_of_bytes, unsigned = false)
    {
        let value = 0
        ;[...Array(number_of_bytes)].map((_, i) =>
        {
            value |= this.data[this.index + i] << (i * 8)
        })
        ;!unsigned && (value > MAX_VALUE[number_of_bytes] / 2) && (value -= MAX_VALUE[number_of_bytes])
        this.index += number_of_bytes
        return value
    }

    ReadUInt32()
    {
        return this.Read(4, true)
    }

    ReadInt32()
    {
        return this.Read(4)
    }

    ReadUShort()
    {
        return this.Read(2, true)
    }

    ReadShort()
    {
        return this.Read(2)
    }

    ReadUByte()
    {
        return this.Read(1, true)
    }

    ReadByte()
    {
        return this.Read(1)
    }

    ReadFloat32()
    {
        let value = new DataView(new ArrayBuffer(4))
        ;[...Array(4)].map((_, i) =>
        {
            value.setUint8(i, this.data[this.index + i])
        })
        this.index += 4
        return value.getFloat32()
    }

    ReadString()
    {
        let value = ''
        while (this.data[this.index] > 0)
        {
            value += String.fromCharCode(this.data[this.index++])
        }
        this.index += 1
        return value
    }
}
