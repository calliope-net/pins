
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

    //% group="Digital" color=#D80000
    //% blockId=pins_eDigitalPins block="%pin" weight=4
    //% blockSetVariable=dPin
    export function pins_eDigitalPins(pin: eDigitalPins): number { //blockHidden=true
        return pin
    }

    //% group="Digital" color=#D80000
    //% block="Digital Pin %pin %on" weight=3
    //% pin.shadow=pins_eDigitalPins
    //% on.shadow=toggleOnOff
    export function pinDigitalWrite(pin: number, on: boolean) {
        pins.digitalWritePin(<DigitalPin>pin, on ? 1 : 0)
    }

    //% group="Digital" color=#D80000
    //% block="Digital Pin %pin" weight=2
    //% pin.shadow=pins_eDigitalPins
    export function pinDigitalRead(pin: number) {
        return pins.digitalReadPin(pin) == 1
    }

    //% blockId=pins_DigitalPin blockHidden=true
    //% group="Digital"
    //% block="%pin" weight=1
    export function pins_DigitalPin(pin: DigitalPin) {
        return pin
    }



    // ========== group="Analog"

    //% group="Analog" color=#D80000
    //% blockId=pins_AnalogPin block="%pin" weight=3
    //% blockSetVariable=aPin
    export function pins_AnalogPin(pin: AnalogPin) { //  blockHidden=true
        return pin
    }

    //% group="Analog" color=#D80000
    //% block="Analog Pin %pin" weight=2
    //% pin.shadow=pins_AnalogPin
    export function pinAnalogRead(pin: number) {
        return pins.analogReadPin(pin)
    }


    // ========== group="Servo"

    //% group="Servo" color=#D80000
    //% block="Servo PWM %pin Winkel %winkel °" weight=2
    //% pin.shadow=pins_AnalogPin
    //% winkel.min=45 winkel.max=135 winkel.defl=90
    export function pinServo(pin: number, winkel: number) {
        pins.servoWritePin(pin, winkel)
    }


} // pins.ts
