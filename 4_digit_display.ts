
namespace pins {/* 4_digit_display.ts

*/

    //  type typeDisplayPins<T> = [T, T]
    //  let qDisplayPins: typeDisplayPins<DigitalPin>[]
    let qDisplayPins: DigitalPin[]
    let qBrightnessLevel = 5


    //% group="Grove - 4-Digit Display" subcategory="4-Digit Display"
    //% block="beim Start CLK %clkPin DIO %dataPin || add %addDisplay" weight=9
    //% clkPin.shadow=pins_DigitalPin dataPin.shadow=pins_DigitalPin addDisplay.shadow=toggleYesNo
    //% clkPin.defl=DigitalPin.C16 dataPin.defl=DigitalPin.C17
    export function d4CreateDisplay(clkPin: number, dataPin: number, addDisplay = false) {
        if (!addDisplay)
            qDisplayPins = []
        qDisplayPins.push(clkPin)
        qDisplayPins.push(dataPin)
    }

    //% group="Grove - 4-Digit Display" subcategory="4-Digit Display"
    //% block="beim Start Takt %clkPin Daten %dataPin" weight=9
    //% clkPin.defl=DigitalPin.C16 dataPin.defl=DigitalPin.C17
    export function createDisplay(clkPin: DigitalPin, dataPin: DigitalPin) {
        qDisplayPins = []
        qDisplayPins.push(clkPin)
        qDisplayPins.push(dataPin)
        qDisplayPins.push(DigitalPin.P2)
        qDisplayPins.push(DigitalPin.P3)
        qDisplayPins.push(DigitalPin.P0)
        qDisplayPins.push(DigitalPin.P1)

        basic.showNumber(qDisplayPins.length)
    }

    //% group="Grove - 4-Digit Display" subcategory="4-Digit Display"
    //% block="%Display löschen" weight=8
    export function clear() {
        for (let i = 0; i < qDisplayPins.length * 2; i++) {
            segmente_anzeigen(0, i)
        }
        /* 
                segmente_anzeigen(0, 0x00);
                segmente_anzeigen(0, 0x01);
                segmente_anzeigen(0, 0x02);
                segmente_anzeigen(0, 0x03); */
    }



    //% group="Grove - 4-Digit Display" subcategory="4-Digit Display"
    //% block="7 Segmente pgfedcba %seg_byte Stelle 3210 %stelle" weight=6
    export function segmente_anzeigen(seg_byte: number, stelle: number) {
        // 76543210 seg_byte: Punkt p und 7 Segmente a..g 
        // pgfedcba
        let displayIndex = (stelle >> 2) * 2
        if (displayIndex + 1 < qDisplayPins.length && seg_byte >= 0x00 && seg_byte <= 0xFF) {

            let clkPin: DigitalPin = qDisplayPins[displayIndex]
            let dataPin: DigitalPin = qDisplayPins[displayIndex + 1]

            start(clkPin, dataPin)
            writeByte(0x44, clkPin, dataPin)
            stop(clkPin, dataPin)
            start(clkPin, dataPin)
            writeByte(0xc0 | 3 - (stelle & 0x03), clkPin, dataPin)
            writeByte(seg_byte, clkPin, dataPin)
            stop(clkPin, dataPin)
            start(clkPin, dataPin)
            writeByte(0x88 | (qBrightnessLevel & 0x07), clkPin, dataPin)
            stop(clkPin, dataPin)
        }
    }


    // ========== private

    function writeByte(wrData: number, clkPin: DigitalPin, dataPin: DigitalPin) {
        for (let i = 0; i < 8; i++) {
            pins.digitalWritePin(clkPin, 0)
            if (wrData & 0x01)
                pins.digitalWritePin(dataPin, 1)
            else
                pins.digitalWritePin(dataPin, 0)
            wrData >>= 1
            pins.digitalWritePin(clkPin, 1)
        }

        pins.digitalWritePin(clkPin, 0); // Wait for ACK
        pins.digitalWritePin(dataPin, 1);
        pins.digitalWritePin(clkPin, 1);
    }

    function start(clkPin: DigitalPin, dataPin: DigitalPin) {
        pins.digitalWritePin(clkPin, 1);
        pins.digitalWritePin(dataPin, 1);
        pins.digitalWritePin(dataPin, 0);
        pins.digitalWritePin(clkPin, 0);
    }

    function stop(clkPin: DigitalPin, dataPin: DigitalPin) {
        pins.digitalWritePin(clkPin, 0);
        pins.digitalWritePin(dataPin, 0);
        pins.digitalWritePin(clkPin, 1);
        pins.digitalWritePin(dataPin, 1);
    }


    //% group="Funktionen" subcategory="4-Digit Display"
    //% block="Simulator" weight=7
    export function simulator() {
        return "€".charCodeAt(0) == 8364
    }


} // 4_digit_display.ts