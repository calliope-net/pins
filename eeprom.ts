
namespace pins // eeprom.ts
/*
https://github.com/calliope-net/eeprom
https://www.sparkfun.com/products/18355
[Datasheet] https://www.onsemi.com/pub/Collateral/CAT24C512-D.PDF
https://learn.sparkfun.com/tutorials/qwiic-eeprom-hookup-guide


https://github.com/sparkfun/Qwiic_EEPROM_Py/archive/main.zip 
Nach dem Beispiel - Code 'qwiic_eeprom.py'
https://github.com/sparkfun/Qwiic_EEPROM_Py/blob/main/qwiic_eeprom.py
*/
{
    // ========== I²C ==========
    export enum eI2Ceeprom { EEPROM_x50 = 0x50 }
    export enum eEEPROM_Startadresse { F800 = 0xF800, FC00 = 0xFC00, F000 = 0xF000, F400 = 0xF400 }

    // I2C EEPROM lesen -> in Buffer
    function i2cReadEEPROM(eeprom_location: number, size: number, i2c = eI2Ceeprom.EEPROM_x50): Buffer {
        if (between(eeprom_location, 0, 65536 - size)) {
            let bu = Buffer.create(2)
            bu.setNumber(NumberFormat.UInt16BE, 0, eeprom_location)
            pins.i2cWriteBuffer(i2c, bu, true) // sendet 2 Byte 16 Bit Adresse
            return pins.i2cReadBuffer(i2c, size) // empfängt die Daten
        }
        else
            return Buffer.create(size)
    }

    // I2C  Buffer -> EEPROM programmieren
    function i2cWriteEEPROM(eeprom_location: number, buData: Buffer, i2c = eI2Ceeprom.EEPROM_x50) {
        if (between(eeprom_location, 0, 65536 - buData.length)) {
            let bu = Buffer.create(2 + buData.length) // 2 Byte 16 Bit Adresse, dann die Daten Byte (length)
            bu.setNumber(NumberFormat.UInt16BE, 0, eeprom_location)
            bu.write(2, buData)
            if (pins.i2cWriteBuffer(i2c, bu) != 0) { // schreibt diese Bytes ab Startadresse in EEPROM
                basic.showNumber(i2c) // bei I²C Fehler die I²C Adresse anzeigen
                control.waitMicros(100000) // 100ms
                return false // und Abbruch
            } else {
                control.waitMicros(10000) // 10ms
                return true
            }
        } else return false
    }



    // ==========  group="EEPROM schreiben und lesen" color="#FF7F3F" subcategory="EEPROM"

    //% group="EEPROM lesen (I²C 0x50)" color="#FF7F3F" subcategory="EEPROM"
    //% block="EEPROM lesen Adresse %adr Länge %size || %i2c" weight=6
    export function readEEPROM(adr: number, size: number, i2c = eI2Ceeprom.EEPROM_x50): number[] {
        return i2cReadEEPROM(adr, size, i2c).toArray(NumberFormat.UInt8LE)
    }

    //% group="EEPROM schreiben (Adresse: 0..65535)" color="#FF7F3F" subcategory="EEPROM"
    //% block="EEPROM schreiben Adresse %adr Bytes %bytes || %i2c" weight=4
    //% byte.min=0 byte.max=255
    export function progEEPROM(adr: number, bytes: number[], i2c = eI2Ceeprom.EEPROM_x50) {
        return i2cWriteEEPROM(adr, Buffer.fromArray(bytes), i2c)
    }

    //% group="EEPROM 512 Page-Adressen je 128 Byte" color="#FF7F3F" subcategory="EEPROM"
    //% block="Page %x3 %x2 %x1"
    export function page(x4: H4, x3: H3, x2: H2) {
        return x4 + x3 + x2
    }

    // HEX Parameter
    /* export enum H1 {
        x0 = 0x0, x1 = 0x1, x2 = 0x2, x3 = 0x3, x4 = 0x4, x5 = 0x5, x6 = 0x6, x7 = 0x7,
        x8 = 0x8, x9 = 0x9, xA = 0xA, xB = 0xB, xC = 0xC, xD = 0xD, xE = 0xE, xF = 0xF
    } */
    export enum H2 {
        x00 = 0x00, /*x10 = 0x10, x20 = 0x20, x30 = 0x30, x40 = 0x40, x50 = 0x50, x60 = 0x60, x70 = 0x70,*/
        x80 = 0x80 /*, x90 = 0x90, xA0 = 0xA0, xB0 = 0xB0, xC0 = 0xC0, xD0 = 0xD0, xE0 = 0xE0, xF0 = 0xF0*/
    }
    export enum H3 {
        x000 = 0x000, x100 = 0x100, x200 = 0x200, x300 = 0x300, x400 = 0x400, x500 = 0x500, x600 = 0x600, x700 = 0x700,
        x800 = 0x800, x900 = 0x900, xA00 = 0xA00, xB00 = 0xB00, xC00 = 0xC00, xD00 = 0xD00, xE00 = 0xE00, xF00 = 0xF00
    }
    export enum H4 {
        x0000 = 0x0000, x1000 = 0x1000, x2000 = 0x2000, x3000 = 0x3000, x4000 = 0x4000, x5000 = 0x5000, x6000 = 0x6000, x7000 = 0x7000,
        x8000 = 0x8000, x9000 = 0x9000, xA000 = 0xA000, xB000 = 0xB000, xC000 = 0xC000, xD000 = 0xD000, xE000 = 0xE000, xF000 = 0xF000
    }

} // eeprom.ts
