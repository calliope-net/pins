
namespace pins { // i2c.ts

    export enum ei2cAdressen {

        //% block="0x00"
        x00 = 0x00,

        //% block="0x00 Qwiic Ultrasonic Distance Sensor (HC-SR04)""
        UltrasonicDistance_x00 = 0x00,

        //% block="0x03 Grove - 6-Position DIP Switch; 5-Way Switch"
        DIP_x03 = 0x03,

        //% block="0x68 Bosch BMX055 magnetic (Calliope v1-2)"
        magnetic_x10 = 0x10,

        //% block="0x11 Grove - 4-Channel SPDT Relay"
        Rel_x11 = 0x11, Rel_x12 = 0x12,

        //% block="0x68 Bosch BMX055 accelerometer (Calliope v1-2)"
        accelerometer_x18 = 0x18,

        //% block="0x18 Qwiic Single Relay"
        Relay_x18 = 0x18, Relay_x19 = 0x19, Relay_x1E = 0x1E,

        //% block="0x20 SparkFun Qwiic Joystick"
        Joystick_x20 = 0x20,

        //% block="0x20 CalliBot (blockiert 8 Adressen 0x20-0x27)"
        CalliBot_x20 = 0x20,

        //% block="0x21 CalliBot"
        CalliBot_x21 = 0x21,

        //% block="0x22 CalliBot 2"
        CalliBot2_x22 = 0x22,

        //% block="0x27 SparkFun Qwiic GPIO"
        GPIO_x27 = 0x27, GPIO_x26 = 0x26, GPIO_x25 = 0x25, GPIO_x24 = 0x24,
        GPIO_x23 = 0x23, GPIO_x22 = 0x22, GPIO_x21 = 0x21, GPIO_x20 = 0x20,

        // Power Delivery Board - USB-C (Qwiic)
        //Power = 0x28, Power_x29 = 0x29, Power_x2A = 0x2A, Power_x2B = 0x2B,

        //% block="0x29 SparkFun Distance Sensor - 1.3 Meter, VL53L4CD (Qwiic)"
        LaserDistance_x29 = 0x29,

        //% block="0x2A SparkFun Qwiic OpenLog"
        LOG_x2A = 0x2A, LOG_x29 = 0x29,

        //% block="0x30 Grove - 16x2 LCD (nur v5 RGB Backlight)"
        RGB_16x2_V5 = 0x30, // RGB_16x2_x30 = 0x30, RGB_16x2_x62 = 0x62,

        //% block="0x3C Grove - OLED Display 0.96 (SSD1308)"
        OLED_1308_x3C = 0x3C,

        //% block="0x3C Grove - OLED Yellow&Blue Display 0.96 (SSD1315)"
        OLED_16x8_x3C = 0x3C,

        //% block="0x3C Grove - OLED Display 1.12 (SH1107) - Matrix"
        OLED_1286x128_x3C = 0x3C,

        //% block="0x3D Grove - OLED Yellow&Blue Display 0.96 (SSD1315)"
        OLED_16x8_x3D = 0x3D,

        //% block="0x3D Grove - OLED Display 1.12 (SH1107) - Matrix"
        OLED_1286x128_x3D = 0x3D,

        //% block="0x3E Grove - 16x2 LCD Display"
        LCD_16x2_x3E = 0x3E, //LCD_16x2_V4 = 0x70,

        //% block="0x45 Gravity: I2C Digital Wattmeter"
        Wattmeter_x45 = 0x45, Wattmeter_x40 = 0x40, Wattmeter_x41 = 0x41, Wattmeter_x44 = 0x44,

        //% block="0x48 SparkFun Qwiic Keypad - 12 Button"
        Keypad_x4B = 0x4B, Keypad_x4A_Jumper = 0x4A,

        //% block="0x50 SparkFun Qwiic EEPROM Breakout - 512Kbit"
        EEPROM_x50 = 0x50, EEPROM_x51 = 0x51, EEPROM_x52 = 0x52, EEPROM_x53 = 0x53,
        EEPROM_x54 = 0x54, EEPROM_x55 = 0x55, EEPROM_x56 = 0x56, EEPROM_x57 = 0x57,

        //% block="0x51 Grove - High Precision RTC (Real Time Clock)"
        RTC_x51 = 0x51,

        //% block="0x52 M5Stack U024-C Joystick"
        Joystick_x52 = 0x52,

        //% block="0x5F M5Stack U305-B CardKB"
        CardKB_x5F = 0x5F,

        //% block="0x5D SparkFun Qwiic Motor Driver"
        Motor_x5D = 0x5D, Motor_x58 = 0x58, Motor_x59 = 0x59, Motor_x5A = 0x5A, Motor_x5B = 0x5B, Motor_x5C = 0x5C,
        Motor_x5E = 0x5E, Motor_x5F = 0x5F, Motor_x60 = 0x60, Motor_x61 = 0x61,

        //% block="0x68 Bosch BMX055 gyro (Calliope v1-2)"
        gyro_x68 = 0x68,

        //% block="0x72 SparkFun 16x2 SerLCD - RGB Backlight (Qwiic)"
        LCD_16x2_x72 = 0x72,

        //% block="0x72 SparkFun 20x4 SerLCD - RGB Backlight (Qwiic)"
        LCD_20x4_x72 = 0x72,

        //% block="0x7F"
        x7F = 0x7F
    }


    // ========== group="I²C" subcategory=I²C

    //% group="I²C Write / Read" subcategory=I²C
    //% block="i2cWriteBuffer I²C %i2cAdresse Buffer %buf || repeat %repeat" weight=9
    //% i2cAdresse.min=0 i2cAdresse.max=127
    //% repeat.shadow=toggleYesNo
    export function pins_i2cWriteBuffer(i2cAdresse: number, buf: Buffer, repeat = false) {
        return pins.i2cWriteBuffer(i2cAdresse, buf, repeat)
    }

    //% group="I²C Write / Read" subcategory=I²C
    //% block="i2cReadBuffer I²C %i2cAdresse size %size || repeat %repeat" weight=8
    //% i2cAdresse.min=0 i2cAdresse.max=127
    //% size.min=1 size.max=128 size.defl=1
    //% repeat.shadow=toggleYesNo
    export function pins_i2cReadBuffer(i2cAdresse: number, size: number, repeat = false) {
        return pins.i2cReadBuffer(i2cAdresse, size, repeat)
    }



    //% blockId=pins_i2cAdressen
    //% group="I²C Adressen Liste" subcategory=I²C
    //% block="%i2cAdresse"
    //% blockSetVariable=i2cAdresse
    export function pins_i2cAdressen(i2cAdresse: ei2cAdressen): number {
        return i2cAdresse
    }


    //% group="sammelt gültige I²C-Adressen in Array" subcategory=I²C
    //% block="I²C-Scan von %von_i2cAdresse bis %bis_i2cAdresse Pause %ms ms"
    //% von_i2cAdresse.shadow=pins_i2cAdressen
    //% bis_i2cAdresse.shadow=pins_i2cAdressen bis_i2cAdresse.defl=pins.ei2cAdressen.x7F
    //% ms.min=0 ms.max=500 ms.defl=100
    export function i2cScan(von_i2cAdresse: number, bis_i2cAdresse: number, ms: number): number[] {
        let a: number[] = []
        if (between(von_i2cAdresse, 0, 127) && between(bis_i2cAdresse, 0, 127) && von_i2cAdresse <= bis_i2cAdresse) {
            let b = Buffer.create(1)
            b.setUint8(0, 0)
            let ex: number = 0
            for (let i = von_i2cAdresse; i <= bis_i2cAdresse; i++) {

                if (i == ei2cAdressen.LCD_16x2_x3E) { // reagiert nicht auf 1 Byte 0x00
                    pins.i2cWriteBuffer(ei2cAdressen.magnetic_x10, b) // vorher eine gültige Adresse aufrufen
                    ex = pins.i2cWriteBuffer(i, b)
                    //ex = pins.i2cWriteBuffer(i, Buffer.fromArray([0x80, 0x01]))
                }
                else
                    ex = pins.i2cWriteBuffer(i, b)

                if (ex == 0) {
                    a.push(i)
                    if (a.length >= 32)
                        break
                }
                basic.pause(ms)
            }
            pins.i2cWriteBuffer(ei2cAdressen.magnetic_x10, b) // am Ende eine gültige Adresse aufrufen
        }
        return a
    }


    //% group="sammelt gültige I²C-Adressen in HEX-String" subcategory=I²C
    //% block="I²C-Scan von %von_i2cAdresse bis %bis_i2cAdresse Pause %ms ms"
    //% von_i2cAdresse.shadow=pins_i2cAdressen
    //% bis_i2cAdresse.shadow=pins_i2cAdressen bis_i2cAdresse.defl=pins.ei2cAdressen.x7F
    //% ms.min=0 ms.max=500 ms.defl=100
    export function i2cScanToHex(von_i2cAdresse: number, bis_i2cAdresse: number, ms: number): string {
        return Buffer.fromArray(i2cScan(von_i2cAdresse, bis_i2cAdresse, ms)).toHex()
    }


    //% group="Funktionen" subcategory=I²C
    //% block="%i0 zwischen %i1 und %i2" weight=4
    export function between(i0: number, i1: number, i2: number): boolean { return (i0 >= i1 && i0 <= i2) }


} // i2c.ts
