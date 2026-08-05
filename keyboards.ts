
namespace pins { // keyboards.ts




    // ========== Qwiic Keypad 12 button

    const i2cKeypad_x4B = 0x4B
    let n_i2cKeypadConnected: boolean = undefined
    export enum eKeypadRegisters {
        // KEYPAD_ID = 0x00,
        // KEYPAD_VERSION1 = 0x01,
        // KEYPAD_VERSION2 = 0x02,
        KEYPAD_BUTTON = 0x03,
        // KEYPAD_TIME_MSB = 0x04,
        // KEYPAD_TIME_LSB = 0x05,
        KEYPAD_UPDATE_FIFO = 0x06,
        // KEYPAD_CHANGE_ADDRESS = 0x07
    }

    //% group="Qwiic Keypad 12 Tasten (I²C: 0x4B)" subcategory="Tastaturen" color=#BF007F
    //% block="Keypad angeschlossen" weight=8
    export function keypadConnected() {
        if (n_i2cKeypadConnected === undefined)
            keypad_read()
        return n_i2cKeypadConnected
    }

    //% group="Qwiic Keypad 12 Tasten (I²C: 0x4B)" subcategory="Tastaturen" color=#BF007F
    //% block="Keypad Zeichencode" weight=6
    export function keypad_read() {
        let charCode = 0
        if (n_i2cKeypadConnected || n_i2cKeypadConnected === undefined) {
            n_i2cKeypadConnected = pins_i2cWriteBuffer(i2cKeypad_x4B, Buffer.fromArray([eKeypadRegisters.KEYPAD_UPDATE_FIFO, 1]), n_i2cKeypadConnected) == 0

            if (n_i2cKeypadConnected) {
                let bu = pins_i2cWriteReadBuffer(i2cKeypad_x4B, Buffer.fromArray([eKeypadRegisters.KEYPAD_BUTTON]), 1)
                basic.pause(50) // 25 ms is good, more is better
                if (bu)
                    charCode = bu[0]
            }
        }
        return charCode
    }


    //% group="Qwiic Keypad 12 Tasten (I²C: 0x4B)" subcategory="Tastaturen" color=#BF007F
    //% block="Qwiic Keypad Ereignis auslösen %on" weight=5
    //% on.shadow=toggleOnOff
    export function raiseKeypadEvent(on: boolean) {
        // https://learn.sparkfun.com/tutorials/qwiic-keypad-hookup-guide/hardware-overview
        if (on && onKeyboardEventHandler) {
            if (n_i2cKeypadConnected || n_i2cKeypadConnected == undefined) {
                n_i2cKeypadConnected = pins.i2cWriteBuffer(i2cKeypad_x4B, Buffer.fromArray([eKeypadRegisters.KEYPAD_UPDATE_FIFO, 1]), n_i2cKeypadConnected) == 0

                if (n_i2cKeypadConnected) {
                    pins.i2cWriteBuffer(i2cKeypad_x4B, Buffer.fromArray([eKeypadRegisters.KEYPAD_BUTTON]), true)
                    let buffer = pins.i2cReadBuffer(i2cKeypad_x4B, 1)
                    basic.pause(25) // 25 ms is good, more is better

                    let charCode = buffer[0]
                    if (charCode > 0)
                        onKeyboardEventHandler(charCode, String.fromCharCode(charCode), (charCode >= 32 && charCode <= 127))
                }
            }
        }
    }




    // ========== group="M5Stack Card Keyboard 0x5E" subcategory="Tastaturen"

    const i2cCardKb_x5F = 0x5F

    //% group="M5Stack Card Keyboard 50 Tasten (I²C: 0x5E)" subcategory="Tastaturen" color=#BF007F
    //% block="Keyboard Zeichencode" weight=6
    export function keyboard_read() {
        let buffer = pins.i2cReadBuffer(i2cCardKb_x5F, 1)
        return buffer[0]
    }

    //% group="M5Stack Card Keyboard 50 Tasten (I²C: 0x5E)" subcategory="Tastaturen" color=#BF007F
    //% block="Keyboard Ereignis auslösen %on" weight=3
    //% on.shadow=toggleOnOff
    export function raiseKeyboardEvent(on: boolean) {
        // https://docs.m5stack.com/en/unit/cardkb_1.1
        if (on && onKeyboardEventHandler) {

            let buffer = pins.i2cReadBuffer(i2cCardKb_x5F, 1)

            let charCode = buffer[0]
            if (charCode > 0)
                onKeyboardEventHandler(charCode, String.fromCharCode(charCode), (charCode >= 32 && charCode <= 127))
        }
    }



    // ========== group="Tastatur Ereignis" alle Tastaturen

    let onKeyboardEventHandler: (zeichenCode: number, zeichenText: string, isASCII: boolean) => void

    //% group="Tastatur Ereignis" subcategory="Tastaturen" color=#BF007F
    //% block="wenn Taste gedrückt war" weight=2
    //% draggableParameters=reporter
    export function onKeyboardEvent(cb: (zeichenCode: number, zeichenText: string, isASCII: boolean) => void) {
        onKeyboardEventHandler = cb
    }


} // keyboards.ts
