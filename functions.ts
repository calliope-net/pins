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


} // functions.ts
