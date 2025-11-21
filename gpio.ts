
namespace pins {/* gpio.ts
https://en.wikipedia.org/wiki/General-purpose_input/output

https://www.sparkfun.com/products/17047
https://learn.sparkfun.com/tutorials/sparkfun-qwiic-gpio-hookup-guide

https://cdn.sparkfun.com/assets/b/b/f/1/7/TCA9534.pdf
*/

    const gpio_OUT_Buffer: Buffer = Buffer.create(8) // index [i2c_addr & 7]

    //% blockId=pins_gpio_I2C_ADDRESS blockHidden=true
    //% group="SparkFun Qwiic GPIO (I²C 0x20..0x27)" subcategory=GPIO
    //% block="%pADDR"
    export function pins_gpio_I2C_ADDRESS(pADDR: gpio_eI2C_ADDRESS): number { return pADDR }
    export enum gpio_eI2C_ADDRESS {
        GPIO_x27 = 0x27, GPIO_x26 = 0x26, GPIO_x25 = 0x25, GPIO_x24 = 0x24,
        GPIO_x23 = 0x23, GPIO_x22 = 0x22, GPIO_x21 = 0x21, GPIO_x20 = 0x20
    }

    export enum gpio_eCommandByte { INPUT_PORT = 0x00, OUTPUT_PORT = 0x01, INVERSION = 0x02, CONFIGURATION = 0x03 }

    const INVERT = 0b10         // Register 2: 1=inverted
    //const NO_INVERT = false     // Register 2: 0=original polarity
    //const GPIO_OUT = false      // Register 3: 0=output
    const GPIO_IN = 0b01        // Register 3: 1=input

    export enum gpio_eIO { IN = 0b01, IN_inverted = 0b11, OUT = 0b00 }

    //% blockId=pins_gpio_pin blockHidden=true
    //% group="SparkFun Qwiic GPIO (I²C 0x20..0x27)" subcategory=GPIO
    //% block="%bit"
    export function pins_gpio_pin(pin: gpio_epin): number { return pin }
    export enum gpio_epin { Pin0, Pin1, Pin2, Pin3, Pin4, Pin5, Pin6, Pin7 }


    // ========== group="SparkFun Qwiic GPIO (I²C 0x20..0x27)" subcategory=GPIO

    //% group="SparkFun Qwiic GPIO (I²C 0x20..0x27)" subcategory=GPIO
    //% block="I²C %i2c_addr angeschlossen" weight=6
    //% i2c_addr.shadow=pins_gpio_I2C_ADDRESS
    export function gpio_connected(i2c_addr: number): boolean {
        let bu = pins_i2cWriteReadBuffer(i2c_addr, Buffer.fromArray([gpio_eCommandByte.INPUT_PORT]), 1)
        return bu ? true : false
    }

    //% group="SparkFun Qwiic GPIO (I²C 0x20..0x27)" subcategory=GPIO
    //% block="I²C %i2c_addr Konfiguration | Pin 7 %pIO7 Pin 6 %pIO6 Pin 5 %pIO5 Pin 4 %pIO4 Pin 3 %pIO3 Pin 2 %pIO2 Pin 1 %pIO1 Pin 0 %pIO0" weight=2
    //% i2c_addr.shadow=pins_gpio_I2C_ADDRESS
    // inlineInputMode=inline
    export function gpio_setMode(i2c_addr: number, pIO7: gpio_eIO, pIO6: gpio_eIO, pIO5: gpio_eIO, pIO4: gpio_eIO, pIO3: gpio_eIO, pIO2: gpio_eIO, pIO1: gpio_eIO, pIO0: gpio_eIO) {
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
        // basic.showNumber(r2)
        i2cWriteBuffer(i2c_addr, Buffer.fromArray([gpio_eCommandByte.CONFIGURATION, r3]))
        i2cWriteBuffer(i2c_addr, Buffer.fromArray([gpio_eCommandByte.INVERSION, r2]))
        //writeRegister(pADDR, eCommandByte.CONFIGURATION, r3)
        //writeRegister(pADDR, eCommandByte.INVERSION, r2)

        gpio_OUT_Buffer[i2c_addr & 7] = 0
    }



    // ========== group="GPIO: General-purpose input/output" subcategory=GPIO



    //% group="GPIO: General-purpose input/output" subcategory=GPIO
    //% block="I²C %i2c_addr lese %pin" weight=6
    //% i2c_addr.shadow=pins_gpio_I2C_ADDRESS
    //% pin.shadow=pins_gpio_pin
    export function gpio_readBit(i2c_addr: number, pin: number): boolean {
        return (gpio_readByte(i2c_addr) & 2 ** (pin & 0x07)) != 0
    }

    //% group="GPIO: General-purpose input/output" subcategory=GPIO
    //% block="I²C %i2c_addr schalte %pin %bit" weight=5
    //% i2c_addr.shadow=pins_gpio_I2C_ADDRESS
    //% pin.shadow=pins_gpio_pin
    //% bit.shadow=toggleOnOff
    export function gpio_writeBit(i2c_addr: number, pin: number, bit: boolean) {
        if (bit)
            //gpio_OUT_Buffer[pADDR & 7] &= ~(2 ** (ebit & 0x07))
            gpio_writeByte(i2c_addr, gpio_OUT_Buffer[i2c_addr & 7] | 2 ** (pin & 0x07))
        else
            //gpio_OUT_Buffer[pADDR & 7] &= ~(2 ** (ebit & 0x07))
            gpio_writeByte(i2c_addr, gpio_OUT_Buffer[i2c_addr & 7] & ~(2 ** (pin & 0x07)))
    }


    //% group="GPIO: General-purpose input/output" subcategory=GPIO
    //% block="I²C %i2c_addr lese INPUT Byte" weight=2
    //% i2c_addr.shadow=pins_gpio_I2C_ADDRESS
    export function gpio_readByte(i2c_addr: number): number { // Bitweise AND setzt die OUTPUT Bits auf 0
        let bu = pins_i2cWriteReadBuffer(i2c_addr, Buffer.fromArray([gpio_eCommandByte.INPUT_PORT]), 1)
        if (bu)
            return bu.getUint8(0)
        else
            return -1
        // return readRegister(pADDR, eCommandByte.INPUT_PORT) & readRegister(pADDR, eCommandByte.CONFIGURATION)
    }

    //% group="GPIO: General-purpose input/output" subcategory=GPIO
    //% block="I²C %i2c_addr schreibe Byte %byte" weight=1
    //% i2c_addr.shadow=pins_gpio_I2C_ADDRESS
    //% byte.min=0 byte.max=255 byte.defl=1
    export function gpio_writeByte(i2c_addr: number, byte: number) {
        gpio_OUT_Buffer[i2c_addr & 7] = byte
        i2cWriteBuffer(i2c_addr, Buffer.fromArray([gpio_eCommandByte.OUTPUT_PORT, byte]))
        //writeRegister(pADDR, eCommandByte.OUTPUT_PORT, byte)
    }



    // ========== 7-Segment Anzeige an Port (7-0) (.GFEDCBA)

    //% group="7-Segment Anzeige an Port (7-0) (.GFEDCBA)" subcategory=GPIO
    //% block="wandle %hexZiffer um in 7-Segment || Punkt %punkt"
    //% hexZiffer.min=0 hexZiffer.max=15
    //% hexZiffer.shadow=pins_hex4
    //% punkt.shadow=toggleOnOff
    export function gpio_7segment(hexZiffer: number, punkt?: boolean) {
        let dp: number = (punkt ? 0b10000000 : 0b00000000) // dezimalpunkt
        switch (hexZiffer) {// GFEDCBA
            case 0: { return 0b0111111 | dp }
            case 1: { return 0b0000110 | dp }
            case 2: { return 0b1011011 | dp }
            case 3: { return 0b1001111 | dp }
            case 4: { return 0b1100110 | dp }
            case 5: { return 0b1101101 | dp }
            case 6: { return 0b1111101 | dp }
            case 7: { return 0b0000111 | dp }
            case 8: { return 0b1111111 | dp }
            case 9: { return 0b1101111 | dp }
            case 10: { return 0b1110111 | dp }
            case 11: { return 0b1111100 | dp }
            case 12: { return 0b0111001 | dp }
            case 13: { return 0b1011110 | dp }
            case 14: { return 0b1111001 | dp }
            case 15: { return 0b1110001 | dp }
            default: { return hexZiffer }
        }
    }

} // gpio.ts
