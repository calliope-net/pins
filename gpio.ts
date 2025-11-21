
namespace pins {/* gpio.ts
https://en.wikipedia.org/wiki/General-purpose_input/output

https://www.sparkfun.com/products/17047
https://learn.sparkfun.com/tutorials/sparkfun-qwiic-gpio-hookup-guide

https://cdn.sparkfun.com/assets/b/b/f/1/7/TCA9534.pdf
*/
    export enum gpio_eI2C_ADDRESS {
        GPIO_x27 = 0x27, GPIO_x26 = 0x26, GPIO_x25 = 0x25, GPIO_x24 = 0x24,
        GPIO_x23 = 0x23, GPIO_x22 = 0x22, GPIO_x21 = 0x21, GPIO_x20 = 0x20
    }

    //% blockId=pins_gpio_I2C_ADDRESS blockHidden=true
    //% group="i2c Adressen" subcategory=GPIO
    //% block="%pADDR" weight=4
    export function pins_gpio_I2C_ADDRESS(pADDR: gpio_eI2C_ADDRESS): number { return pADDR }

    export enum eCommandByte { INPUT_PORT = 0x00, OUTPUT_PORT = 0x01, INVERSION = 0x02, CONFIGURATION = 0x03 }

    const INVERT = 0b10         // Register 2: 1=inverted
    //const NO_INVERT = false     // Register 2: 0=original polarity
    //const GPIO_OUT = false      // Register 3: 0=output
    const GPIO_IN = 0b01        // Register 3: 1=input

    export enum eIO { IN = 0b01, IN_inverted = 0b11, OUT = 0b00 }

    //% group="SparkFun Qwiic GPIO (I²C 0x20..0x27" subcategory=GPIO
    //% block="I²C %pADDR angeschlossen" weight=6
    //% pADDR.shadow=pins_gpio_I2C_ADDRESS
    export function gpio_connected(pADDR: number): boolean {
        let bu = pins_i2cWriteReadBuffer(pADDR, Buffer.fromArray([eCommandByte.INPUT_PORT]), 1)
        return bu ? true : false
    }

    //% group="SparkFun Qwiic GPIO (I²C 0x20..0x27" subcategory=GPIO
    //% block="I²C %pADDR Konfiguration | Bit 7 %pIO7 Bit 6 %pIO6 Bit 5 %pIO5 Bit 4 %pIO4 Bit 3 %pIO3 Bit 2 %pIO2 Bit 1 %pIO1 Bit 0 %pIO0" weight=2
    //% pADDR.shadow=pins_gpio_I2C_ADDRESS
    // inlineInputMode=inline
    export function gpio_setMode(pADDR: number, pIO7: eIO, pIO6: eIO, pIO5: eIO, pIO4: eIO, pIO3: eIO, pIO2: eIO, pIO1: eIO, pIO0: eIO) {
        let r3 = 0b00000000 // CONFIGURATION 0=output 1=input
        let r2 = 0b00000000 // INVERSION 0=original polarity 1=inverted
        if (pIO7 & GPIO_IN) { r3 |= 2 ** 7; if (pIO7 & INVERT) { r2 |= 2 ** 7 } }
        if (pIO6 & GPIO_IN) { r3 |= 2 ** 6; if (pIO6 & INVERT) { r2 |= 2 ** 6 } }
        if (pIO5 & GPIO_IN) { r3 |= 2 ** 5; if (pIO5 & INVERT) { r2 |= 2 ** 5 } }
        if (pIO4 & GPIO_IN) { r3 |= 2 ** 4; if (pIO4 & INVERT) { r2 |= 2 ** 4 } }
        if (pIO3 & GPIO_IN) { r3 |= 2 ** 3; if (pIO3 & INVERT) { r2 |= 2 ** 3 } }
        if (pIO2 & GPIO_IN) { r3 |= 2 ** 2; if (pIO2 & INVERT) { r2 |= 2 ** 2 } }
        if (pIO1 & GPIO_IN) { r3 |= 2 ** 1; if (pIO1 & INVERT) { r2 |= 2 ** 1 } }
        if (pIO0 & GPIO_IN) { r3 |= 2 ** 0; if (pIO0 & INVERT) { r2 |= 2 ** 0 } }
        basic.showNumber(r2)
        i2cWriteBuffer(pADDR, Buffer.fromArray([eCommandByte.CONFIGURATION, r3]))
        i2cWriteBuffer(pADDR, Buffer.fromArray([eCommandByte.INVERSION, r2]))
        //writeRegister(pADDR, eCommandByte.CONFIGURATION, r3)
        //writeRegister(pADDR, eCommandByte.INVERSION, r2)
    }


    //% group="GPIO: General-purpose input/output" subcategory=GPIO
    //% block="I²C %pADDR lese INPUT Byte" weight=2
    //% pADDR.shadow=pins_gpio_I2C_ADDRESS
    export function gpio_readINPUT_PORT(pADDR: number): number { // Bitweise AND setzt die OUTPUT Bits auf 0
        let bu = pins_i2cWriteReadBuffer(pADDR, Buffer.fromArray([eCommandByte.INPUT_PORT]), 1)
        if (bu)
            return bu.getUint8(0)
        else
            return -1
        // return readRegister(pADDR, eCommandByte.INPUT_PORT) & readRegister(pADDR, eCommandByte.CONFIGURATION)
    }


    //% group="GPIO: General-purpose input/output" subcategory=GPIO
    //% block="I²C %pADDR schreibe OUTPUT Byte %byte" weight=1
    //% pADDR.shadow=pins_gpio_I2C_ADDRESS
    //% byte.min=0 byte.max=255 byte.defl=1
    export function gpio_writeOUTPUT_PORT(pADDR: number, byte: number) {
        i2cWriteBuffer(pADDR, Buffer.fromArray([eCommandByte.OUTPUT_PORT, byte]))
        //writeRegister(pADDR, eCommandByte.OUTPUT_PORT, byte)
    }



} // gpio.ts
