// Gib deinen Code hier ein
namespace pins { // functions.ts



    // ========== group="Funktionen" subcategory=I²C

    //% blockId=pins_text block="%s" blockHidden=true
    export function pins_text(s: string): string { return s }

    //% group="Funktionen" subcategory=Funktionen
    //% block="// %text" weight=9
    //% text.shadow="pins_text"
    export function comment(text: any): void { }


    //% group="Funktionen" subcategory=Funktionen
    //% block="Simulator" weight=7
    export function simulator() {
        return "€".charCodeAt(0) == 8364
    }

    //% group="Funktionen" subcategory=Funktionen
    //% block="%i0 zwischen %i1 und %i2" weight=6
    export function between(i0: number, i1: number, i2: number): boolean { return (i0 >= i1 && i0 <= i2) }


    //% group="Funktionen" subcategory=Funktionen
    //% block="roundWithPrecision number %x digits %digits" weight=5
    //% digits.min=0 digits.max=4 digits.defl=2
    export function roundWithPrecision(x: number, digits: number) { return Math.roundWithPrecision(x, digits) }


    //% group="Funktionen" subcategory=Funktionen
    //% block="%variable === undefined" weight=3
    export function isundefined(variable: any): boolean {
        return (variable === undefined)
    }

    //% group="Funktionen" subcategory=Funktionen
    //% block="Number.isNaN(%variable)" weight=2
    export function isnan(variable: any): boolean {
        return Number.isNaN(variable)
    }



    // ========== group="25 LED Matrix" subcategory=Funktionen

    //% group="25 LED Matrix" subcategory=Funktionen
    //% block="25 LED x(0..3)→ %x y(0..31)↑ %n" weight=5
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

} // functions.ts
