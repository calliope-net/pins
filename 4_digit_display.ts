
namespace pins {/* 4_digit_display.ts

*/

    //  type typeDisplayPins<T> = [T, T]
    //  let qDisplayPins: typeDisplayPins<DigitalPin>[]
    let qDisplayPins: DigitalPin[]
    let qBrightnessLevel = 5


    //% group="Grove - 4-Digit Display" subcategory="4-Digit Displays"
    //% block="beim Start CLK %clkPin DIO %dataPin || + 4 Ziffern %addDisplay" weight=9
    //% clkPin.shadow=pins_DigitalPin dataPin.shadow=pins_DigitalPin addDisplay.shadow=toggleYesNo
    //% clkPin.defl=DigitalPin.C16 dataPin.defl=DigitalPin.C17
    export function d4CreateDisplay(clkPin: number, dataPin: number, addDisplay = false) {
        if (!addDisplay || !qDisplayPins)
            qDisplayPins = []
        qDisplayPins.push(clkPin)
        qDisplayPins.push(dataPin)
        d7String("FEdCbA9876543210")
    }



    //% group="Grove - 4-Digit Display" subcategory="4-Digit Displays"
    //% block="Displays löschen" weight=8
    export function d4Clear() {
        for (let i = 0; i < qDisplayPins.length * 2; i++) {
            d7SegmentByte(0, i)
        }
    }

    //% group="Zeichen 0123456789AbCdEF +-°" subcategory="4-Digit Displays"
    //% block="zeige Text %hex_string || von rechts %stelle Länge %len Ziffern" weight=9
    //% len.min=-8 len.max=8
    export function d7String(hex_string: string, stelle?: number, len?: number) {
        if (hex_string) {
            let d7_array: number[] = []
            for (let i = 0; i < hex_string.length; i++) {
                let ci = hex_string.charAt(i) // 1 Zeichen aus hex_string (char)
                let hi = parseInt(ci, 16) // HEX Wert 0..15 oder NaN
                if (ci == "-")
                    d7_array.push(0b01000000)  // Minus - (- und + wird 0 bei parseInt16)
                else if (ci == "+")
                    d7_array.push(0b01110000)  // Plus +
                else if (ci == " ")
                    d7_array.push(0b00000000)  // Leerzeichen
                else if (!Number.isNaN(hi))
                    d7_array.push([
                        0x3f, 0x06, 0x5b, 0x4f, 0x66, 0x6d, 0x7d, 0x07, // 0 1 2 3 4 5 6 7
                        0x7f, 0x6f, 0x77, 0x7c, 0x39, 0x5e, 0x79, 0x71 // 8 9 A b C d E F
                    ][hi]) // HEX Wert 0..15
                else if (ci == "°")
                    d7_array.push(0b01100011)  // Grad °
                else // bei allen ungültigen Zeichen kein push
                    d7_array[d7_array.length - 1] |= 0x80 // Doppelpunkt bei letzter Ziffer an schalten
            }
            if (!stelle || stelle < 0 || stelle > qDisplayPins.length * 2) // Parameter %stelle Gültigkeit testen
                stelle = 0
            for (let i = 0; i < stelle; i++) {
                d7_array.push(undefined) // von rechts Stellen überspringen
            }
            d7_array.reverse()
            while (len && d7_array.length < Math.abs(len) + stelle) {
                d7_array.push(len < 0 ? 0x3f : 0x00) // Leerzeichen oder Ziffer 0 nach links anhängen
            }
            d7SegmentArray(d7_array)
        }
    }

    //% group="Zeichen 0123456789AbCdEF +-°" subcategory="4-Digit Displays"
    //% block="Zahl %n → Text" weight=6
    export function toText(n: number): string {
        return n.toString()
    }


    //% group="Zeichen 0123456789AbCdEF +-°" subcategory="4-Digit Displays"
    //% block="Zahl %n → HEX" weight=5
    export function toHex(n: number): string {
        let hex = ""
        do {
            hex = "0123456789AbCdEF".charAt(n % 16) + hex
            n >>= 4 //   n = Math.idiv(n, 16) // Integer-Division in MakeCode
        } while (n > 0)
        return hex
    }

    //% group="Zeichen 0123456789AbCdEF +-°" subcategory="4-Digit Displays"
    //% block="Zahl %n → BIN" weight=4
    export function toBin(n: number): string {
        let bin = ""
        do {
            bin = "01".charAt(n % 2) + bin
            n = n >> 1
        } while (n > 0)
        return bin
    }


    // ========== group="7 Segmente :gfedcba | Ziffer 0 rechts" subcategory="4-Digit Displays"


    //% group="7 Segmente :gfedcba | Ziffer 0 rechts" subcategory="4-Digit Displays"
    //% block="7 Segment %seg_array" weight=7
    export function d7SegmentArray(seg_array: number[]) {
        if (seg_array) {
            for (let i = 0; i < seg_array.length; i++) {
                d7SegmentByte(seg_array[i], i)
            }
        }
    }

    //% group="7 Segmente :gfedcba | Ziffer 0 rechts" subcategory="4-Digit Displays"
    //% block="7 Segment Byte %seg_byte Ziffer %stelle ←3210" weight=6
    //% stelle.min=0 stelle.max=15
    export function d7SegmentByte(seg_byte: number, stelle: number) {
        // 76543210 seg_byte: Punkt p und 7 Segmente a..g 
        // :gfedcba
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
            pins.digitalWritePin(dataPin, wrData & 0x01)
            /*  if (wrData & 0x01)
                 pins.digitalWritePin(dataPin, 1)
             else
                 pins.digitalWritePin(dataPin, 0) */
            wrData >>= 1
            pins.digitalWritePin(clkPin, 1)
        }

        pins.digitalWritePin(clkPin, 0) // Wait for ACK
        pins.digitalWritePin(dataPin, 1)
        pins.digitalWritePin(clkPin, 1)
    }

    function start(clkPin: DigitalPin, dataPin: DigitalPin) {
        pins.digitalWritePin(clkPin, 1)
        pins.digitalWritePin(dataPin, 1)
        pins.digitalWritePin(dataPin, 0)
        pins.digitalWritePin(clkPin, 0)
    }

    function stop(clkPin: DigitalPin, dataPin: DigitalPin) {
        pins.digitalWritePin(clkPin, 0)
        pins.digitalWritePin(dataPin, 0)
        pins.digitalWritePin(clkPin, 1)
        pins.digitalWritePin(dataPin, 1)
    }





} // 4_digit_display.ts