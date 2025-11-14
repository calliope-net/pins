
namespace pins {/* 4_digit_display.ts

*/

    //  type typeDisplayPins<T> = [T, T]
    //  let qDisplayPins: typeDisplayPins<DigitalPin>[]
    let qDisplayPins: DigitalPin[] // 2 Elemente pro Display
    let qDoppelpunkt: boolean[]    // 1 Element pro Display
    let qBrightnessLevel = 0


    //% group="Grove - 4-Digit Display TM1637" subcategory="4-Digit Displays"
    //% block="beim Start CLK %clkPin DIO %dataPin || + 4 Ziffern %addDisplay" weight=9
    //% clkPin.shadow=pins_DigitalPin dataPin.shadow=pins_DigitalPin addDisplay.shadow=toggleYesNo
    //% clkPin.defl=DigitalPin.C16 dataPin.defl=DigitalPin.C17
    export function d4CreateDisplay(clkPin: number, dataPin: number, addDisplay = false) {
        if (!addDisplay || !qDisplayPins) {
            qDisplayPins = []
            qDoppelpunkt = []
        }
        qDisplayPins.push(clkPin)
        qDisplayPins.push(dataPin)
        qDoppelpunkt.push(false)
        d7String("FEdCbA9876543210")
    }



    //% group="Grove - 4-Digit Display TM1637" subcategory="4-Digit Displays"
    //% block="Displays löschen || Helligkeit %helligkeit" weight=8
    //% helligkeit.min=0 helligkeit.max=7 helligkeit.defl=4
    export function d4Clear(helligkeit?: number) {
        if (helligkeit && helligkeit >= 0 && helligkeit <= 7)
            qBrightnessLevel = helligkeit
        for (let i = 0; i < qDisplayPins.length * 2; i++) {
            d7SegmentByte(0, i)
        }
    }

    //% group="Grove - 4-Digit Display TM1637" subcategory="4-Digit Displays"
    //% block="zeige Zahl %zahl" weight=5
    export function d7Zahl(zahl: number) {
        d7String(zahl.toString())
    }

    //% group="Grove - 4-Digit Display TM1637" subcategory="4-Digit Displays"
    //% block="zeige Doppelpunkt %on || auf Display %displayIndex" weight=4
    //% on.shadow=toggleOnOff 
    //% displayIndex.min=0 displayIndex.max=3 displayIndex.defl=0
    export function d7Doppelpunkt(on: boolean, displayIndex?: number) {
        if (!displayIndex)
            displayIndex = 0
        if (displayIndex < qDoppelpunkt.length) {
            qDoppelpunkt[displayIndex] = on
        }
    }



    // ========== group="Zeichen 0123456789AbCdEF hHLPU +-°" subcategory="4-Digit Displays"

    //% group="Zeichen 0123456789AbCdEF hHLPU +-°" subcategory="4-Digit Displays"
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
                    d7_array.push(0b01110000)  // halbes Plus +
                else if (ci == " ")
                    d7_array.push(0b00000000)  // Leerzeichen
                else if (!Number.isNaN(hi))
                    d7_array.push([
                        0x3f, 0x06, 0x5b, 0x4f, 0x66, 0x6d, 0x7d, 0x07, // 0 1 2 3 4 5 6 7
                        0x7f, 0x6f, 0x77, 0x7c, 0x39, 0x5e, 0x79, 0x71 // 8 9 A b C d E F
                    ][hi]) // HEX Wert 0..15
                else if (ci == "°")
                    d7_array.push(0b01100011)  // Grad °
                else if (ci == "H")
                    d7_array.push(0b01110110)  // H
                else if (ci == "h")
                    d7_array.push(0b01110100)  // h
                else if (ci == "L")
                    d7_array.push(0b00111000)  // L
                else if (ci == "P")
                    d7_array.push(0b01110011)  // P
                else if (ci == "U")
                    d7_array.push(0b00111110)  // U
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

    //% group="Zeichen 0123456789AbCdEF hHLPU +-°" subcategory="4-Digit Displays"
    //% block="Zahl %n → Text || Kommastellen %kommastellen" weight=6
    //% kommastellen.min=0 kommastellen.max=4
    export function toText(n: number, kommastellen?: number): string {
        let t = n.toString()
        if (kommastellen > 0 && kommastellen <= 4) {
            let i = t.indexOf(".")
            if (i == -1) { // i=-1 Zahl enthält kein Komma
                t += "."
                i = t.indexOf(".")
            }
            t = (t + "0000").substr(0, i + 1 + kommastellen)
        }
        return t.replace(".", ",")
    }

    //% group="Zeichen 0123456789AbCdEF hHLPU +-°" subcategory="4-Digit Displays"
    //% block="Zahl %n → HEX || %h" weight=5
    //% h.defl=h
    export function toHex(n: number, h?: string): string {
        let hex = ""
        do {
            hex = "0123456789AbCdEF".charAt(n % 16) + hex
            n >>= 4 //   n = Math.idiv(n, 16) // Integer-Division in MakeCode
        } while (n > 0)
        if (h)
            return h + hex
        else
            return hex
    }

    //% group="Zeichen 0123456789AbCdEF hHLPU +-°" subcategory="4-Digit Displays"
    //% block="Zahl %n → BIN || %b" weight=4
    //% b.defl=b
    export function toBin(n: number, b?: string): string {
        let bin = ""
        do {
            bin = "01".charAt(n % 2) + bin
            n >>= 1
        } while (n > 0)
        if (b)
            return b + bin
        else
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
        // 76543210 seg_byte Doppelpunkt : und 7 Segmente g..a
        // :gfedcba
        let displayIndex = stelle >> 2
        let displayPinsIndex = displayIndex * 2 // 2 Pins pro Display im Array
        if (displayPinsIndex + 1 < qDisplayPins.length && seg_byte >= 0x00 && seg_byte <= 0xFF) {

            if (displayIndex < qDoppelpunkt.length && qDoppelpunkt[displayIndex] && stelle % 4 == 2)
                seg_byte |= 0x80 // Doppelpunkt an schalten nur bei Stelle 2

            let clkPin: DigitalPin = qDisplayPins[displayPinsIndex]
            let dataPin: DigitalPin = qDisplayPins[displayPinsIndex + 1]

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