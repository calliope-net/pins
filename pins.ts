
namespace pins { // pins.ts


    // ========== group="Digital"

    export enum eDigitalPins { // Pins gültig für alle Modelle, unterscheiden sich bei v3 im Enum Wert
        P0 = DigitalPin.P0,
        P1 = DigitalPin.P1,
        P2 = DigitalPin.P2,
        P3 = DigitalPin.P3,
        //% block="C16 Grove RX"
        C16 = DigitalPin.C16,
        //% block="C17 Grove TX"
        C17 = DigitalPin.C17
    }

    //% blockId=pins_eDigitalPins block="%pin" blockHidden=true
    export function pins_eDigitalPins(pin: eDigitalPins): number {
        return pin
    }

    //% group="Digital"
    //% block="Digital Pin %pin %on" weight=3
    //% pin.shadow=pins_eDigitalPins
    //% on.shadow=toggleOnOff
    export function pinDigitalWrite(pin: number, on: boolean) {
        pins.digitalWritePin(<DigitalPin>pin, on ? 0 : 1)
    }

    //% group="Digital"
    //% block="Digital Pin %pin" weight=2
    //% pin.shadow=pins_eDigitalPins
    export function pinDigitalRead(pin: number) {
        return pins.digitalReadPin(pin) == 1
    }

    //% blockId=pins_DigitalPin 
    //% group="Digital"
    //% block="DigitalPin %pin" weight=1
    export function pins_DigitalPin(pin: DigitalPin) {
        return pin
    }



    // ========== group="Analog"

    //% blockId=pins_AnalogPin
    //% group="Analog"
    //% block="AnalogPin %pin" weight=1
    export function pins_AnalogPin(pin: AnalogPin) {
        return pin
    }



    // ========== group="Servo"

    //% group="Servo"
    //% block="Servo Pin %pin Winkel %winkel °" weight=2
    //% pin.shadow=pins_AnalogPin
    //% winkel.min=45 winkel.max=135 winkel.defl=90
    export function pinServo(pin: number, winkel: number) {
        pins.servoWritePin(pin, winkel)
    }




    // ========== group="Buffer create" subcategory=Buffer

    //% group="Buffer create" subcategory=Buffer
    //% block="Buffer.create size %size" weight=9
    export function buffer_create(size: number) {
        return Buffer.create(size)
    }
    //% group="Buffer create" subcategory=Buffer
    //% block="Buffer.fromArray %bytes" weight=8
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

} // pins.ts
