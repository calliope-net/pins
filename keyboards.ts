
namespace pins { // keyboards.ts



    // ========== group="M5Stack Card Keyboard 0x5E" subcategory="Tastaturen"

    const i2cCardKb_x5F = 0x5F

    //% group="M5Stack Card Keyboard 50 Tasten (I²C: 0x5E)" subcategory="Tastaturen"
    //% block="I²C Card Keyboard Ereignis auslösen %on" weight=3
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

    //% group="Qwiic Keypad 12 Tasten (I²C: 0x4B)" subcategory="Tastaturen"
    //% block="I²C Qwiic Keypad Ereignis auslösen %on" weight=5
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

    //% group="Qwiic Keypad 12 Tasten (I²C: 0x4B)" subcategory="Tastaturen"
    //% block="Qwiic Keypad angeschlossen" weight=3
    export function keypadConnected() {
        return n_i2cKeypadConnected // kann undefined sein
    }


    // ========== group="Tastatur Ereignis" alle Tastaturen

    let onKeyboardEventHandler: (zeichenCode: number, zeichenText: string, isASCII: boolean) => void

    //% group="Tastatur Ereignis" subcategory="Tastaturen"
    //% block="wenn Taste gedrückt war" weight=2
    //% draggableParameters=reporter
    export function onKeyboardEvent(cb: (zeichenCode: number, zeichenText: string, isASCII: boolean) => void) {
        onKeyboardEventHandler = cb
    }


} // keyboards.ts
