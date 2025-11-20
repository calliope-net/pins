
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

    export enum rtc_eControl {
        Control_1 = 0, Control_2 = 1, Offset = 2, RAM_byte = 3,
        Sekunde = 4, Minute = 5, Stunde = 6, Tag = 7, Wochentag = 8, Monat = 9, Jahr = 10
    }
    export enum rtc_eRegister { Sekunde = 0, Minute = 1, Stunde = 2, Tag = 3, Wochentag = 4, Monat = 5, Jahr = 6 }
    //  export enum eFormat { DEC, zehner, einer, BCD }

    //% blockId=pins_rtc_eRegister blockHidden=true
    //% group="Real Time Clock PCF85063TP" subcategory="RTC Uhr"
    //% block="%pRegister"
    export function pins_rtc_eRegister(pRegister: rtc_eRegister): number { return pRegister }


    // ========== group="Real Time Clock PCF85063TP" subcategory="RTC Uhr"

    //% group="Real Time Clock PCF85063TP" subcategory="RTC Uhr"
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

    // group="Uhr lesen (vorher 'Datum und Zeit einlesen')" subcategory="RTC Uhr"
    // block="Datum als Text" weight=6
    /*   export function rtc_get_date(): string {
          // date_string = str(RTC_BUFFER[3] >> 4) + str(RTC_BUFFER[3] & 0x0F) + "." + str(RTC_BUFFER[5] >> 4) + str(RTC_BUFFER[5] & 0x0F) + ".20" + str(RTC_BUFFER[6] >> 4) + str(RTC_BUFFER[6] & 0x0F)
          if (rtc_Buffer)
              return (rtc_Buffer[3] >> 4) + (rtc_Buffer[3] & 0x0F) + "." + (rtc_Buffer[5] >> 4) + (rtc_Buffer[5] & 0x0F) + ".20" + (rtc_Buffer[6] >> 4) + (rtc_Buffer[6] & 0x0F)
          else
              return ""
      } */

    // group="Uhr lesen (vorher 'Datum und Zeit einlesen')" subcategory="RTC Uhr"
    // block="Zeit als Text" weight=4
    /*  export function rtc_get_time(): string {
         // time_string = str(RTC_BUFFER[2] >> 4) + str(RTC_BUFFER[2] & 0x0F) + ":" + str(RTC_BUFFER[1] >> 4) + str(RTC_BUFFER[1] & 0x0F) + ":" + str(RTC_BUFFER[0] >> 4) + str(RTC_BUFFER[0] & 0x0F)
         if (rtc_Buffer)
             return (rtc_Buffer[2] >> 4) + (rtc_Buffer[2] & 0x0F) + ":" + (rtc_Buffer[1] >> 4) + (rtc_Buffer[1] & 0x0F) + ":" + (rtc_Buffer[0] >> 4) + (rtc_Buffer[0] & 0x0F)
         else
             return ""
     } */

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
    //% block="%format" weight=3
    export function rtc_get(format: rtc_eFormat): string {
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

    //% group="Uhr lesen (vorher 'Datum und Zeit einlesen')" subcategory="RTC Uhr"
    //% block="Array (7 Byte) [s,m,H,d,w,M,y] im Format BCD" weight=1
    export function rtc_get_array(): number[] {
        if (rtc_Buffer)
            return rtc_Buffer.toArray(NumberFormat.UInt8LE)
        else
            return []
    }




    //% group="RTC Register" subcategory="RTC Uhr"
    //% block="read RTC Register" weight=9
    export function rtc_read_control(register: rtc_eControl): number {
        return pins_i2cWriteReadBuffer(rtc_I2C_ADDRESS, Buffer.fromArray([register]), 1).getUint8(0)
    }

    //% group="RTC Register" subcategory="RTC Uhr"
    //% block="write RTC Register" weight=8
    export function rtc_write_control(register: rtc_eControl, byte: number): number {
        return pins_i2cWriteBuffer(rtc_I2C_ADDRESS, Buffer.fromArray([register, byte]))
    }



} // rtc.ts
