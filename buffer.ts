// Gib deinen Code hier ein
namespace pins { // buffer.ts


    // ========== group="Buffer create" subcategory=Buffer

    //% group="Buffer create" subcategory=Buffer
    //% block="Buffer.create size %size" weight=9
    export function buffer_create(size: number) {
        return Buffer.create(size)
    }
    //% group="Buffer create" subcategory=Buffer
    //% block="Buffer.from %bytes" weight=8
    export function buffer_fromArray(bytes: number[]) {
        return Buffer.fromArray(bytes)
    }
    //% group="Buffer create" subcategory=Buffer
    //% block="Buffer.fromHex %hex" weight=7
    export function buffer_fromHex(hex: string) {
        return Buffer.fromHex(hex)
    }
    //% group="Buffer create" subcategory=Buffer
    //% block="Buffer.fromUTF8 %str" weight=6
    export function buffer_fromUTF8(str: string) {
        return Buffer.fromUTF8(str)
    }



    // ========== group="Byte (UInt8)" subcategory=Buffer

    //% group="Byte (UInt8)" subcategory=Buffer
    //% block="Buffer %buffer .setUint8(offset %off value %v)" weight=8
    //% off.min=0 off.max=18
    export function buffer_setUint8(buffer: Buffer, off: number, v: number) {
        buffer.setUint8(off, v)
    }

    //% group="Byte (UInt8)" subcategory=Buffer
    //% block="Buffer %buffer .getUint8(offset %off)" weight=7
    //% off.min=0 off.max=18
    export function buffer_getUint8(buffer: Buffer, off: number) {
        return buffer.getUint8(off)
    }



    // ========== group="Zahl (Number)" subcategory=Buffer

    //% group="Zahl (Number)" subcategory=Buffer
    //% block="Buffer %buffer .setNumber(%format offset %offset value %value)" weight=6
    //% format.defl=NumberFormat.UInt8LE
    //% offset.min=0 offset.max=18
    //% inlineInputMode=inline
    export function buffer_setNumber(buffer: Buffer, format: NumberFormat, offset: number, value: number) {
        buffer.setNumber(format, offset, value)
    }


    //% group="Zahl (Number)" subcategory=Buffer
    //% block="Buffer %buffer .getNumber(%format offset %offset)" weight=5
    //% format.defl=NumberFormat.UInt8LE
    //% offset.min=0 offset.max=18
    export function buffer_getNumber(buffer: Buffer, format: NumberFormat, offset: number): number {
        return buffer.getNumber(format, offset)
    }



    // ========== group="Bit (boolean)" subcategory=Buffer

    //% group="Bit (boolean)" subcategory=Buffer
    //% block="Buffer %buffer offset %offset setBit 2** %exp %pBit" weight=4
    //% offset.min=0 offset.max=18
    //% exp.min=0 exp.max=7
    //% inlineInputMode=inline
    export function buffer_setBit(buffer: Buffer, offset: number, exp: number, bit: boolean) {
        if (bit)
            buffer[offset] | 2 ** Math.trunc(exp)
        else
            buffer[offset] & ~(2 ** Math.trunc(exp))
    }

    //% group="Bit (boolean)" subcategory=Buffer
    //% block="Buffer %buffer offset %offset getBit 2** %exp" weight=3
    //% offset.min=0 offset.max=18
    //% exp.min=0 exp.max=7
    export function buffer_getBit(buffer: Buffer, offset: number, exp: number): boolean {
        return (buffer[offset] & 2 ** Math.trunc(exp)) != 0
    }



    // ========== group="Buffer write to" subcategory=Buffer

    //% group="Buffer write to" subcategory=Buffer
    //% block="Buffer %buffer .toArray() %format" weight=7
    //% format.defl=NumberFormat.UInt8LE
    export function buffer_toArray(buffer: Buffer, format: NumberFormat) {
        return buffer.toArray(format)
    }

    //% group="Buffer write to" subcategory=Buffer
    //% block="Buffer %buffer .toHex()" weight=6
    export function buffer_toHex(buffer: Buffer) {
        return buffer.toHex()
    }

    //% group="Buffer write to" subcategory=Buffer
    //% block="Buffer %buffer .toString()" weight=5
    export function buffer_toString(buffer: Buffer) {
        return buffer.toString()
    }



    // ========== group="Buffer Funktionen" subcategory=Buffer

    //% group="Buffer Funktionen" subcategory=Buffer
    //% block="Buffer %buffer .length" weight=8
    export function buffer_length(buffer: Buffer) {
        return buffer.length
    }

    //% group="Buffer Funktionen" subcategory=Buffer
    //% block="Buffer %buffer .concat(other %other)" weight=6
    export function buffer_concat(buffer: Buffer, other: Buffer) {
        return buffer.concat(other)
    }

    //% group="Buffer Funktionen" subcategory=Buffer
    //% block="Buffer %buffer .slice(offset %offset length %length )" weight=4
    export function buffer_slice(buffer: Buffer, offset: number, length: number) {
        return buffer.slice(offset, length)
    }

    //% group="Buffer Funktionen" subcategory=Buffer
    //% block="Buffer %buffer .chunked(maxSize %maxSize)" weight=2
    export function buffer_chunked(buffer: Buffer, maxSize: number) {
        return buffer.chunked(maxSize)
    }


} // buffer.ts
