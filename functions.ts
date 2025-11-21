// Gib deinen Code hier ein
namespace pins { // functions.ts


    // ========== group="Kommentar" subcategory=Funktionen

    //% blockId=pins_text block="%s" blockHidden=true
    export function pins_text(s: string): string { return s }

    //% group="Kommentar" subcategory=Funktionen
    //% block="// %text" weight=9
    //% text.shadow="pins_text"
    export function comment(text: any): void { }



    // ========== group="Logik" subcategory=Funktionen

    //% group="Logik" subcategory=Funktionen
    //% block="Simulator" weight=7
    export function simulator() {
        return "€".charCodeAt(0) == 8364
    }

    //% group="Logik" subcategory=Funktionen
    //% block="%i0 zwischen %i1 und %i2" weight=6
    export function between(i0: number, i1: number, i2: number): boolean { return (i0 >= i1 && i0 <= i2) }

    //% group="Logik" subcategory=Funktionen
    //% block="%variable === undefined" weight=3
    export function isundefined(variable: any): boolean {
        return (variable === undefined)
    }

    //% group="Logik" subcategory=Funktionen
    //% block="Number.isNaN(%variable)" weight=2
    export function isnan(variable: any): boolean {
        return Number.isNaN(variable)
    }



    // ========== group="Mathematik" subcategory=Funktionen

    //% blockId=pins_hex4
    //% group="Mathematik" subcategory=Funktionen weight=8
    //% block="%x0"
    export function hex4(x0: eHEX4bit) { return (x0 & 0xF) }

    //% blockId=pins_hex44
    //% group="Mathematik" subcategory=Funktionen weight=8
    //% block="%x1 %x0"
    export function hex44(x1: eHEX4bit, x0: eHEX4bit) { return (x1 << 4) | (x0 & 0xF) }


    //% group="Mathematik" subcategory=Funktionen
    //% block="charCodeAt %text index %index" weight=6
    export function charCodeAt(text: string, index: number) {
        return text.charCodeAt(index)
    }

    //% group="Mathematik" subcategory=Funktionen
    //% block="parseInt %text || radix %radix" weight=4
    //% radix.min=2 radix.max=16 radix.defl=10
    export function parseint(text: string, radix?: number) {
        return parseInt(text, radix)
    }

    //% group="Mathematik" subcategory=Funktionen
    //% block="roundWithPrecision number %x digits %digits" weight=2
    //% digits.min=0 digits.max=4 digits.defl=2
    export function roundWithPrecision(x: number, digits: number) { return Math.roundWithPrecision(x, digits) }



    // ========== group="25 LED Matrix" subcategory=Funktionen

    //% group="25 LED Matrix" subcategory=Funktionen
    //% block="25 LED x→0..3 %x y↑0..31 %n" weight=5
    //% x.min=0 x.max=4 y.min=0 y.max=31
    export function plot25LED(x: number, n: number) {
        if (between(x, 0, 4)) {
            if ((n & 1) == 1) { led.plot(x, 4) } else { led.unplot(x, 4) }
            n >>= 1
            if ((n & 1) == 1) { led.plot(x, 3) } else { led.unplot(x, 3) }
            n >>= 1
            if ((n & 1) == 1) { led.plot(x, 2) } else { led.unplot(x, 2) }
            n >>= 1
            if ((n & 1) == 1) { led.plot(x, 1) } else { led.unplot(x, 1) }
            n >>= 1
            if ((n & 1) == 1) { led.plot(x, 0) } else { led.unplot(x, 0) }

            /*   if (y.length > 0 && y.get(0)) { led.plot(x, 4) } else { led.unplot(x, 4) }
              if (y.length > 1 && y.get(1)) { led.plot(x, 3) } else { led.unplot(x, 3) }
              if (y.length > 2 && y.get(2)) { led.plot(x, 2) } else { led.unplot(x, 2) }
              if (y.length > 3 && y.get(3)) { led.plot(x, 1) } else { led.unplot(x, 1) }
              if (y.length > 4 && y.get(4)) { led.plot(x, 0) } else { led.unplot(x, 0) } */
        }
    }


    // HEX Parameter
    export enum eHEX4bit {
        //% block="0"
        x0 = 0x0,
        //% block="1"
        x1 = 0x1,
        //% block="2"
        x2 = 0x2,
        //% block="3"
        x3 = 0x3,
        //% block="4"
        x4 = 0x4,
        //% block="5"
        x5 = 0x5,
        //% block="6"
        x6 = 0x6,
        //% block="7"
        x7 = 0x7,
        //% block="8"
        x8 = 0x8,
        //% block="9"
        x9 = 0x9,
        //% block="A"
        xA = 0xA,
        //% block="b"
        xB = 0xB,
        //% block="C"
        xC = 0xC,
        //% block="d"
        xD = 0xD,
        //% block="E"
        xE = 0xE,
        //% block="F"
        xF = 0xF
    }

} // functions.ts
