
namespace pins {/* rtc.ts
Calliope i2c Erweiterung für Grove - High Precision RTC (Real Time Clock) PCF85063TP

CMOS Real-Time Clock (RTC) - Quarz-Uhr mit Knopfzelle CR1225 3Volt
[Hardware] https://wiki.seeedstudio.com/Grove_High_Precision_RTC/
[Software] https://github.com/Seeed-Studio/Grove_High_Precision_RTC_PCF85063TP
           https://codeload.github.com/Seeed-Studio/Grove_High_Precision_RTC_PCF85063TP/zip/refs/heads/master
           https://files.seeedstudio.com/wiki/Grove-High_Precision_RTC/res/PCF85063TP.pdf

*/
    const rtc_I2C_ADDRESS = 0x51
    let rtc_Buffer: Buffer //= Buffer.create(7)



    // ========== group="Real Time Clock PCF85063TP" subcategory="RTC Uhr"

    //% group="Real Time Clock PCF85063TP (I²C 0x51)" subcategory="RTC Uhr"
    //% block="Datum und Zeit einlesen" weight=9
    export function rtc_read() {
        rtc_Buffer = pins_i2cWriteReadBuffer(rtc_I2C_ADDRESS, Buffer.fromArray([4]), 7)
    }


    // ========== group="Uhr lesen (vorher 'Datum und Zeit einlesen')" subcategory="RTC Uhr"

    //% group="Uhr lesen (vorher 'Datum und Zeit einlesen')" subcategory="RTC Uhr"
    //% block="%register als Zahl" weight=8
    //% register.min=0 register.max=6
    //% register.shadow=pins_rtc_eRegister
    export function rtc_get_int(register: number): number {
        if (rtc_Buffer && between(register, 0, 6))
            return (rtc_Buffer[register] >> 4) * 10 + (rtc_Buffer[register] & 0x0F)
        else
            return -1
    }

    export enum rtc_eFormat {
        //% block="Datum dd.MM.yy"
        ddMMyy,
        //% block="Datum dd.MM.20yy"
        ddMM20yy,
        //% block="Wochentag ddd"
        ddd,
        //% block="Zeit HH:mm"
        hhmm,
        //% block="Zeit HH:mm:ss"
        hhmss,
        //% block="yyMMddHHmmss"
        yyMMddHHmmss
    }

    //% group="Uhr lesen (vorher 'Datum und Zeit einlesen')" subcategory="RTC Uhr"
    //% block="%format" weight=6
    export function rtc_get_string(format: rtc_eFormat): string {
        if (rtc_Buffer)
            switch (format) {
                case rtc_eFormat.ddMMyy:
                    return (rtc_Buffer[3] >> 4) + (rtc_Buffer[3] & 0x0F) + "." + (rtc_Buffer[5] >> 4) + (rtc_Buffer[5] & 0x0F) + "." + (rtc_Buffer[6] >> 4) + (rtc_Buffer[6] & 0x0F)
                case rtc_eFormat.ddMM20yy:
                    return (rtc_Buffer[3] >> 4) + (rtc_Buffer[3] & 0x0F) + "." + (rtc_Buffer[5] >> 4) + (rtc_Buffer[5] & 0x0F) + ".20" + (rtc_Buffer[6] >> 4) + (rtc_Buffer[6] & 0x0F)
                case rtc_eFormat.ddd:  //wd_string = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][int(RTC_BUFFER[4])]
                    return ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', '-7'][rtc_Buffer[4] & 0x07]
                case rtc_eFormat.hhmm:
                    return (rtc_Buffer[2] >> 4) + (rtc_Buffer[2] & 0x0F) + ":" + (rtc_Buffer[1] >> 4) + (rtc_Buffer[1] & 0x0F) + ":" + (rtc_Buffer[0] >> 4) + (rtc_Buffer[0] & 0x0F)
                case rtc_eFormat.hhmss:
                    return (rtc_Buffer[2] >> 4) + (rtc_Buffer[2] & 0x0F) + ":" + (rtc_Buffer[1] >> 4) + (rtc_Buffer[1] & 0x0F)
                case rtc_eFormat.yyMMddHHmmss:
                    // iso_string = str(RTC_BUFFER[6] >> 4) + str(RTC_BUFFER[6] & 0x0F) + str(RTC_BUFFER[5] >> 4) + str(RTC_BUFFER[5] & 0x0F) + str(RTC_BUFFER[3] >> 4) + str(RTC_BUFFER[3] & 0x0F) + str(RTC_BUFFER[2] >> 4) + str(RTC_BUFFER[2] & 0x0F) + str(RTC_BUFFER[1] >> 4) + str(RTC_BUFFER[1] & 0x0F) + str(RTC_BUFFER[0] >> 4) + str(RTC_BUFFER[0] & 0x0F)
                    return "" + (rtc_Buffer[6] >> 4) + (rtc_Buffer[6] & 0x0F) + (rtc_Buffer[5] >> 4) + (rtc_Buffer[5] & 0x0F) + (rtc_Buffer[3] >> 4) + (rtc_Buffer[3] & 0x0F) + (rtc_Buffer[2] >> 4) + (rtc_Buffer[2] & 0x0F) + (rtc_Buffer[1] >> 4) + (rtc_Buffer[1] & 0x0F) + (rtc_Buffer[0] >> 4) + (rtc_Buffer[0] & 0x0F)
                default:
                    return ""
            }
        else
            return ""
    }


    export enum rtc_e25LED { Datum, Zeit }

    //% group="Uhr lesen (vorher 'Datum und Zeit einlesen')" subcategory="RTC Uhr"
    //% block="Binär Uhr (25 LED Matrix) %p25LED" weight=4
    export function Anzeige25LED(p25LED: rtc_e25LED) {
        if (rtc_Buffer && p25LED == rtc_e25LED.Datum) {
            plot25LED(0, rtc_get_int(rtc_eRegister.Tag))        // x=0 Days 0..31
            plot25LED(1, rtc_get_int(rtc_eRegister.Wochentag))  // x=1 Weekday 0..6
            plot25LED(2, rtc_get_int(rtc_eRegister.Monat))      // x=2 Months 1..12
            plot25LED(3, rtc_Buffer[rtc_eRegister.Jahr] >> 4)   // x=3 Years Zehner 00..90
            plot25LED(4, rtc_Buffer[rtc_eRegister.Jahr] & 0x0F) // x=4 Years Einer 0..9

            /*    plot25LED(0, i2c.BIN(getByte(eRegister.Days, eFormat.DEC))) // x=0 Days
               plot25LED(1, []) // x=1 unplot
               plot25LED(2, i2c.BIN(getByte(eRegister.Months, eFormat.DEC))) // x=2 Months
               plot25LED(3, i2c.BIN(getByte(eRegister.Years, eFormat.DEC) >> 5)) // x=3 Years 32..99
               plot25LED(4, i2c.BIN(getByte(eRegister.Years, eFormat.DEC))) // x=4 Years 00..31 */
        }
        else if (rtc_Buffer && p25LED == rtc_e25LED.Zeit) {
            plot25LED(0, rtc_get_int(rtc_eRegister.Stunde))         // Stunde 0..23
            plot25LED(1, rtc_Buffer[rtc_eRegister.Minute] >> 4)     // Minute 00..50
            plot25LED(2, rtc_Buffer[rtc_eRegister.Minute] & 0x0F)   // Minute 0..9
            plot25LED(3, rtc_Buffer[rtc_eRegister.Sekunde] >> 4)    // Stunde 00..20
            plot25LED(4, rtc_Buffer[rtc_eRegister.Sekunde] & 0x0F)  // Stunde 0..9

            /*   plot25LED(0, i2c.BIN(getByte(eRegister.Hours, eFormat.DEC)))
              plot25LED(1, i2c.BIN(getByte(eRegister.Minutes, eFormat.zehner)))
              plot25LED(2, i2c.BIN(getByte(eRegister.Minutes, eFormat.einer)))
              plot25LED(3, i2c.BIN(getByte(eRegister.Seconds, eFormat.zehner)))
              plot25LED(4, i2c.BIN(getByte(eRegister.Seconds, eFormat.einer))) */
        }
    }


    //% group="Uhr lesen (vorher 'Datum und Zeit einlesen')" subcategory="RTC Uhr"
    //% block="Buffer (7 Byte) [s,m,H,d,w,M,y] im Format BCD" weight=2
    export function rtc_get_array(): Buffer {
        return rtc_Buffer
    }



    // ========== group="Uhr stellen" subcategory="RTC Uhr"

    let rtc_key_string = ""

    //% group="Uhr stellen *rdd# (* Register 2 Ziffern #)" subcategory="RTC Uhr"
    //% block="Uhr stellen 1 Zeichencode %key_code" weight=9
    export function rtc_set_key(key_code: number) {
        /*
        1. Zeichen: *
        2. Zeichen: Register 0..6
        3. und 4.: 2 Ziffern dezimal Zahl 00..59
        5. Zeichen: # speichern
        Register: [0]=Seconds, [1]=Minutes, [2]=Hours, [3]=Days, [4]=Weekdays, [5]=Months, [6]=Years
        Weekdays 0..6: [0]=Sonntag
        */

        let key_char = String.fromCharCode(key_code)
        if (key_char == '*')
            rtc_key_string = key_char
        else if (key_code >= 48 && key_code <= 57 && rtc_key_string.length > 0 && rtc_key_string.length < 4)
            rtc_key_string += key_char
        else if ((key_char == '#' || key_code == 13) && rtc_key_string.length == 4) {
            //rtc_write(int(key_string[1], 10), int(key_string[2 : 4], 10))
            rtc_set_string(rtc_key_string)
            rtc_key_string += '#'
        }
        return rtc_key_string
    }

    //% group="Uhr stellen *rdd# (* Register 2 Ziffern #)" subcategory="RTC Uhr"
    //% block="Uhr stellen 5 Zeichen %key_string" weight=7
    export function rtc_set_string(key_string: string) { // *259 (1) register (2-3) byte dezimal
        if (key_string && key_string.length >= 4 && key_string.charAt(0) == "*" && !Number.isNaN(parseInt(key_string.substr(1, 3), 10)))
            rtc_write_control(parseInt(key_string.charAt(1), 10) + 4, rtc_convert_byte(parseInt(key_string.substr(2, 2), 10), rtc_eFormat_BCD.bcd))
    }



    // ========== group="RTC Register" subcategory="RTC Uhr"

    //% group="RTC Register" subcategory="RTC Uhr"
    //% block="RTC angeschlossen" weight=9
    export function rtc_connected(): boolean {
        if (!rtc_Buffer)
            rtc_read()
        return rtc_Buffer ? true : false
    }

    export enum rtc_eControl {
        Control_1 = 0, Control_2 = 1, Offset = 2, RAM_byte = 3,
        Sekunde = 4, Minute = 5, Stunde = 6, Tag = 7, Wochentag = 8, Monat = 9, Jahr = 10
    }

    //% group="RTC Register" subcategory="RTC Uhr"
    //% block="read RTC Register %register" weight=7
    export function rtc_read_control(register: rtc_eControl): number {
        return pins_i2cWriteReadBuffer(rtc_I2C_ADDRESS, Buffer.fromArray([register]), 1).getUint8(0)
    }

    //% group="RTC Register" subcategory="RTC Uhr"
    //% block="write RTC Register %register Byte %byte" weight=6
    //% register.defl=pins.rtc_eControl.Control_2 byte.defl=6
    export function rtc_write_control(register: rtc_eControl, byte: number): number { // defl: CLKOUT=1Hz
        return pins_i2cWriteBuffer(rtc_I2C_ADDRESS, Buffer.fromArray([register, byte]))
    }

    export enum rtc_eFormat_BCD {
        //% block="BCD → DEC"
        dec,
        //% block="BCD Zehner"
        zehner,
        //% block="BCD Einer"
        einer,
        //% block="DEC → BCD"
        bcd
    }

    //% group="RTC Register" subcategory="RTC Uhr"
    //% block="convert Byte %byte %format" weight=5
    //% byte.min=0 byte.max=255
    export function rtc_convert_byte(byte: number, format: rtc_eFormat_BCD): number {
        byte = byte & 0xFF
        switch (format) {
            case rtc_eFormat_BCD.dec:
                return (byte >> 4) * 10 + byte & 0x0F
            case rtc_eFormat_BCD.zehner:
                return byte >> 4
            case rtc_eFormat_BCD.einer:
                return byte & 0x0F
            case rtc_eFormat_BCD.bcd:
                return (Math.idiv(byte, 10) << 4) + byte % 10
            default:
                return 0
        }
        /*  let iByte = byte & 0xFF
         if (format == eFormat.DEC) { iByte = (iByte >> 4) * 10 + iByte & 0x0F }
         else if (format == eFormat.zehner) { iByte = iByte >> 4 }
         else if (format == eFormat.einer) { iByte = iByte % 16 }
         else if (format == eFormat.BCD) { iByte = Math.trunc(iByte / 10) * 16 + iByte % 10 }
         return iByte */
    }

    export enum rtc_eRegister { // yyMMddHHmmss
        //% block="0 Sekunde"
        Sekunde = 0,
        //% block="1 Minute"
        Minute = 1,
        //% block="2 Stunde"
        Stunde = 2,
        //% block="3 Tag"
        Tag = 3,
        //% block="4 Wochentag"
        Wochentag = 4,
        //% block="5 Monat"
        Monat = 5,
        //% block="6 Jahr"
        Jahr = 6
    }

    //% blockId=pins_rtc_eRegister blockHidden=true
    //% group="Real Time Clock PCF85063TP" subcategory="RTC Uhr"
    //% block="%pRegister"
    export function pins_rtc_eRegister(pRegister: rtc_eRegister): number { return pRegister }



} // rtc.ts
