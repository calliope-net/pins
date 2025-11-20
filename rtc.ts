
namespace pins {/* rtc.ts
Calliope i2c Erweiterung für Grove - High Precision RTC (Real Time Clock) PCF85063TP

CMOS Real-Time Clock (RTC) - Quarz-Uhr mit Knopfzelle CR1225 3Volt
[Hardware] https://wiki.seeedstudio.com/Grove_High_Precision_RTC/
[Software] https://github.com/Seeed-Studio/Grove_High_Precision_RTC_PCF85063TP
           https://codeload.github.com/Seeed-Studio/Grove_High_Precision_RTC_PCF85063TP/zip/refs/heads/master
           https://files.seeedstudio.com/wiki/Grove-High_Precision_RTC/res/PCF85063TP.pdf

*/
    const rtc_I2C_ADDRESS = 0x51
    let n_Buffer: Buffer //= Buffer.create(7)

    export enum eControl { Control_1 = 0, Control_2 = 1, Offset = 2, RAM_byte = 3 }
    export enum eFormat { DEC, zehner, einer, BCD }
    export enum rtc_eRegister { Sekunde = 0, Minute = 1, Stunde = 2, Tag = 3, Wochentag = 4, Monat = 5, Jahr = 6 }


    //% blockId=pins_rtc_eRegister blockHidden=true
    //% group="Real Time Clock PCF85063TP" subcategory="RTC Uhr"
    //% block="%pRegister"
    export function pins_rtc_eRegister(pRegister: rtc_eRegister): number { return pRegister }




    //% group="Real Time Clock PCF85063TP" subcategory="RTC Uhr"
    //% block="Datum und Zeit einlesen"
    export function rtc_read() {
        n_Buffer = pins_i2cWriteReadBuffer(rtc_I2C_ADDRESS, Buffer.fromArray([4]), 7)
    }

    //% group="Real Time Clock PCF85063TP" subcategory="RTC Uhr"
    //% block="Array (7 Byte) [s,m,H,d,w,M,y] im Format BCD"
    export function rtc_get_array() {
        return n_Buffer.toArray(NumberFormat.UInt8LE)
    }

    //% group="Uhr lesen (vorher 'Datum und Zeit einlesen')" subcategory="RTC Uhr"
    //% block="%register als Zahl" weight=6
    //% register.min=0 register.max=6
    //% register.shadow=pins_rtc_eRegister
    export function rtc_get_int(register: number) {
        return n_Buffer.toArray(NumberFormat.UInt8LE)
    }


} // rtc.ts
