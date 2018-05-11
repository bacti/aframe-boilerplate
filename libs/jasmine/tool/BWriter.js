const FS = require('fs')

class BWriter
{
    constructor(filename)
    {
        this.wstream = FS.createWriteStream(filename)
    }

    Close()
    {
        this.wstream.end()
    }

    WriteUInit32(value)
    {
        let buffer = Buffer.alloc(4)
        buffer.writeUInt32LE(value)
        this.wstream.write(buffer)
    }

    WriteInit32(value)
    {
        let buffer = Buffer.alloc(4)
        buffer.writeInt32LE(value)
        this.wstream.write(buffer)
    }

    WriteUShort(value)
    {
        let buffer = Buffer.alloc(2)
        buffer.writeUInt16LE(value)
        this.wstream.write(buffer)
    }

    WriteShort(value)
    {
        let buffer = Buffer.alloc(2)
        buffer.writeInt16LE(value)
        this.wstream.write(buffer)

    }

    WriteUByte(value)
    {
        let buffer = Buffer.alloc(1)
        buffer.writeUInt8(value)
        this.wstream.write(buffer)
    }

    WriteByte(value)
    {
        let buffer = Buffer.alloc(1)
        buffer.writeInt8(value)
        this.wstream.write(buffer)
    }

    WriteFloat32(value)
    {
        let buffer = Buffer.alloc(4)
        buffer.writeFloatBE(value)
        this.wstream.write(buffer)

    }

    WriteString(value)
    {
        let buffer = Buffer.from(value)
        this.wstream.write(buffer)
        this.WriteByte(0)
    }
}
module.exports = BWriter
