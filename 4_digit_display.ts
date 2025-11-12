
namespace pins {/* 4_digit_display.ts

*/


    type DisplayPins<T> = [T, T]
    let qDisplayPins: DisplayPins<DigitalPin>[]
    let qBrightnessLevel = 5

    /*   const beispiel: DisplayPins<DigitalPin>[] = [
          [1, 2],       // Tupel mit zwei Zahlen
          [3, 4, 5],    // Array mit mehreren Zahlen
          [6, 6],       // Auch ein gültiges Paar
      ]; */


    //% group="Grove - 4-Digit Display" subcategory="4-Digit Display"
    //% block="beim Start Takt %clkPin Daten %dataPin" weight=9
    //% clkPin.defl=DigitalPin.C16 dataPin.defl=DigitalPin.C17
    export function createDisplay(clkPin: DigitalPin, dataPin: DigitalPin) {
        qDisplayPins.push([clkPin, dataPin])
    }


    function segmente_anzeigen(seg_byte: number, stelle: number) {
        // 76543210 seg_byte: Punkt p und 7 Segmente a..g 
        // pgfedcba
        let displayIndex = stelle >> 2
        if (displayIndex < qDisplayPins.length) {
            let clkPin: DigitalPin = qDisplayPins[displayIndex][0]
            let dataPin: DigitalPin = qDisplayPins[displayIndex][1]

            start(clkPin, dataPin)
            writeByte(0x44, clkPin, dataPin)
            stop(clkPin, dataPin)
            start(clkPin, dataPin)
            writeByte(0xc0 | (stelle & 0x03), clkPin, dataPin)
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


} // 4_digit_display.ts