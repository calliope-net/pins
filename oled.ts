
namespace pins // oled.ts
/* 260406 Lutz Elßner
Version ohne RAM, schreibt Text direkt auf das Display
I²C Devices:
https://wiki.seeedstudio.com/Grove-OLED-Display-1.12-SH1107_V3.0/
https://wiki.seeedstudio.com/Grove-OLED-Yellow&Blue-Display-0.96-SSD1315_V1.0/
https://wiki.seeedstudio.com/Grove-OLED_Display_0.96inch/
https://www.sparkfun.com/sparkfun-qwiic-eeprom-breakout-512kbit.html
Datenblatt für alle Displays:
https://files.seeedstudio.com/wiki/Grove-OLED-Display-1.12-(SH1107)_V3.0/res/SH1107V2.1.pdf

*/ {
    export enum oled_i2c_addr { x3C = 0x3C, x3D = 0x3D }
    let q_oled_i2c = oled_i2c_addr.x3C


    // OLED Display (SH1107) kann nur I²C Write; keine i2cRead-Funktion erforderlich
    function i2cWriteBuffer(buffer: Buffer, repeat: boolean = false) {
        if (pins.i2cWriteBuffer(q_oled_i2c, buffer, repeat) != 0)
            basic.showString(toHex(q_oled_i2c, "x"))
    }


    export enum ePages {
        //% block="128x64"
        y64 = 8,
        //% block="128x128"
        y128 = 16
    }
    let q_oled_pages = ePages.y64

    // 6 Bytes zur Cursor Positionierung vor den Daten + 1 Byte 0x40 Display Data
    const cOffset = 7 // Platz am Anfang des Buffer bevor die cx Pixel kommen

    const cx = 128 // max x Pixel (Bytes von links nach rechts)
    let qPages3C = ePages.y64 // Display Höhe (Pages) kann pro I²C Adresse verschieden sein
    let qPages3D = ePages.y64 // 8 oder 16 Pages

    //let qI2C = eI2C.I2C_x3C
    //export function qy() { return qMatrix.length * 8 } // max. y Pixel (von oben nach unten)


    enum eCONTROL { // Co Continuation bit(7); D/C# Data/Command Selection bit(6); following by six "0"s
        // CONTROL ist immer das 1. Byte im Buffer
        x00_xCom = 0x00, // im selben Buffer folgen nur Command Bytes ohne CONTROL dazwischen
        x80_1Com = 0x80, // im selben Buffer nach jedem Command ein neues CONTROL [0x00 | 0x80 | 0x40]
        x40_Data = 0x40  // im selben Buffer folgen nur Display-Data Bytes ohne CONTROL dazwischen
    }





    // ========== group="Hilfe: calliope-net.github.io/matrix" color="#007FFF"

    //% group="Hilfe: calliope-net.github.io/matrix" color="#007FFF" subcategory="OLED"
    //% block="OLED Reset %pPages || invert %pInvert drehen %pFlip %i2c_addr" weight=9
    //% pInvert.shadow="toggleOnOff"
    //% pFlip.shadow="toggleOnOff"
    //% inlineInputMode=inline
    export function oled_reset(pPages: ePages, pInvert = false, pFlip = false, i2c_addr = oled_i2c_addr.x3C) {
        q_oled_pages = pPages
        q_oled_i2c = i2c_addr
        //if (i2c == oled_i2c_addr.x3D) qPages3D = pPages; else qPages3C = pPages
        //if (pI2C) qI2C = pI2C
        let bu: Buffer
        // pro Page einen Buffer(7+128) an Array anfügen (push)
        /*  if (qMatrix.length < pPages) {
             qMatrix = []
             qChangedPages = []
             for (let page = 0; page < pPages; page++) { // Page 0..15 oder 0..7
                 //basic.showNumber(page)
                 bu = Buffer.create(cOffset + cx)
                 bu.fill(0)
 
                 // der Anfang vom Buffer 0..6 wird initialisiert und ändert sich nicht mehr; Daten ab Offset 7..135
                 // Cursor Positionierung an den Anfang jeder Page
                 bu.setUint8(0, eCONTROL.x80_1Com) // CONTROL+1Command
                 bu.setUint8(1, 0xB0 | page & 0x0F) // page number 0-7 B0-B7 - beim 128x128 Display 0x0F
                 // x (Spalte) 7 Bit 0..127 ist immer 0
                 bu.setUint8(2, eCONTROL.x80_1Com) // CONTROL+1Command
                 bu.setUint8(3, 0x00) // lower start column address 0x00-0x0F 4 Bit
                 bu.setUint8(4, eCONTROL.x80_1Com) // CONTROL+1Command
                 bu.setUint8(5, 0x10) // upper start column address 0x10-0x17 3 Bit
 
                 // nach 0x40 folgen die Daten
                 bu.setUint8(6, eCONTROL.x40_Data) // CONTROL Byte 0x40: Display Data
 
                 qMatrix.push(bu) // Array aus 8 oder 16 Buffern je 128 Byte
                 qChangedPages.push(false)
             }
         } */

        // Display initialisieren
        let offset = 0
        bu = Buffer.create(7)   // muss Anzahl der folgenden setUint8 entsprechen
        bu.setUint8(offset++, eCONTROL.x00_xCom) // CONTROL Byte 0x00: folgende Bytes (im selben Buffer) sind alle command und kein CONTROL

        bu.setUint8(offset++, 0x8D)  // Set Charge Pump (nur für Yellow&Blue SSD1315 erforderlich)
        bu.setUint8(offset++, 0x14)  //     Charge Pump (0x10 Disable; 0x14 7,5V; 0x94 8,5V; 0x95 9,0V)

        bu.setUint8(offset++, (pFlip ? 0xA1 : 0xA0)) // Set Segment Re-Map default 0xA0
        bu.setUint8(offset++, (pFlip ? 0xC8 : 0xC0)) // Set Com Output Scan Direction default 0xC0

        bu.setUint8(offset++, (pInvert ? 0xA7 : 0xA6))  // Set display not inverted / A6 Normal A7 Inverse display
        bu.setUint8(offset++, 0xAF)  // Set display ON (0xAE sleep mode)

        i2cWriteBuffer(bu)
        // control.waitMicros(100000)
        basic.pause(100) // 100ms Delay Recommended

        oled_clear()
    }



    export function oled_clear(from_page = 0, to_page = 15) {
        from_page = Math.constrain(from_page, 0, q_oled_pages - 1)
        to_page = Math.constrain(to_page, from_page, q_oled_pages - 1)
        for (let page = from_page; page <= to_page; page++) { // löscht eine Zeile
            oled_text(page, 0, "                ")
        }
    }




    //% group="Text" color="#007FFF" subcategory="OLED"
    //% block="Text Zeile %row Spalte %col %text" weight=7
    //% row.min=0 row.max=15 col.min=0 col.max=15
    //% text.shadow="pins_text"
    export function oled_text(row: number, col: number, text: any) {
        if (between(row, 0, q_oled_pages - 1) && between(col, 0, 15)) {
            let txt = convertToText(text).substr(0, 16)
            let bu = Buffer.create(cOffset + txt.length * 8)
            bu.fill(0)
            // der Anfang vom Buffer 0..6 wird initialisiert und ändert sich nicht mehr; Daten ab Offset 7..135
            // Cursor Positionierung an den Anfang jeder Page
            bu[0] = eCONTROL.x80_1Com // CONTROL+1Command
            bu[1] = 0xB0 | row & 0x0F // page number 0-7 B0-B7 - beim 128x128 Display 0x0F
            // x (Spalte) 7 Bit 0..127 ist immer 0
            bu[2] = eCONTROL.x80_1Com // CONTROL+1Command
            bu[3] = (col * 8) & 0x0F  // lower start column address 0x00-0x0F 4 Bit
            bu[4] = eCONTROL.x80_1Com // CONTROL+1Command
            bu[5] = 0x10 | (col * 8) >> 4 // bu.setUint8(5, 0x10) // upper start column address 0x10-0x17 3 Bit

            // nach 0x40 folgen die Daten
            bu[6] = eCONTROL.x40_Data // CONTROL Byte 0x40: Display Data

            for (let j = 0; j < txt.length; j++) {
                bu.write(cOffset + j * 8,
                    Buffer.fromUTF8(get5x8char(txt.charCodeAt(j)))
                )
            }
            i2cWriteBuffer(bu)
        }
    }



    // ========== private

    function get5x8char(char_code: number): string { // return 5 Byte String
        if (between(char_code, 0x20, 0x7F)) {
            switch (char_code & 0xF0) { // 16 string-Elemente je 8 Byte = 128
                case 0x20:
                    return "\x00\x00\x00\x00\x00\x00\x5F\x00\x00\x00\x00\x07\x00\x07\x00\x14\x7F\x14\x7F\x14\x24\x2A\x7F\x2A\x12\x23\x13\x08\x64\x62\x36\x49\x55\x22\x50\x00\x05\x03\x00\x00\x1C\x22\x41\x00\x00\x41\x22\x1C\x00\x00\x08\x2A\x1C\x2A\x08\x08\x08\x3E\x08\x08\xA0\x60\x00\x00\x00\x08\x08\x08\x08\x08\x60\x60\x00\x00\x00\x20\x10\x08\x04\x02".substr((char_code & 0x0F) * 5, 5)
                //         (  " "               , "!"               , """               , "#"               , "$"               , "%"               , "&"               , "'"               , "("               , ")"               , "*"               , "+"               , ","               , "-"               , "."               , "/"               )
                case 0x30:
                    return "\x3E\x51\x49\x45\x3E\x00\x42\x7F\x40\x00\x62\x51\x49\x49\x46\x22\x41\x49\x49\x36\x18\x14\x12\x7F\x10\x27\x45\x45\x45\x39\x3C\x4A\x49\x49\x30\x01\x71\x09\x05\x03\x36\x49\x49\x49\x36\x06\x49\x49\x29\x1E\x00\x36\x36\x00\x00\x00\xAC\x6C\x00\x00\x08\x14\x22\x41\x00\x14\x14\x14\x14\x14\x41\x22\x14\x08\x00\x02\x01\x51\x09\x06".substr((char_code & 0x0F) * 5, 5)
                //         (  "0"               , "1"               , "2"               , "3"               , "4"               , "5"               , "6"               , "7"               , "8"               , "9"               , ":"               , ";"               , "<"               , "="               , ">"               , "?"               )
                case 0x40:
                    return "\x32\x49\x79\x41\x3E\x7E\x09\x09\x09\x7E\x7F\x49\x49\x49\x36\x3E\x41\x41\x41\x22\x7F\x41\x41\x22\x1C\x7F\x49\x49\x49\x41\x7F\x09\x09\x09\x01\x3E\x41\x41\x51\x72\x7F\x08\x08\x08\x7F\x41\x7F\x41\x00\x00\x20\x40\x41\x3F\x01\x7F\x08\x14\x22\x41\x7F\x40\x40\x40\x40\x7F\x02\x0C\x02\x7F\x7F\x04\x08\x10\x7F\x3E\x41\x41\x41\x3E".substr((char_code & 0x0F) * 5, 5)
                //         (  "@"               , "A"               , "B"               , "C"               , "D"               , "E"               , "F"               , "G"               , "H"               , "I"               , "J"               , "K"               , "L"               , "M"               , "N"               , "O"               )
                case 0x50:
                    return "\x7F\x09\x09\x09\x06\x3E\x41\x51\x21\x5E\x7F\x09\x19\x29\x46\x26\x49\x49\x49\x32\x01\x01\x7F\x01\x01\x3F\x40\x40\x40\x3F\x1F\x20\x40\x20\x1F\x3F\x40\x38\x40\x3F\x63\x14\x08\x14\x63\x03\x04\x78\x04\x03\x61\x51\x49\x45\x43\x7F\x41\x41\x00\x00\x02\x04\x08\x10\x20\x41\x41\x7F\x00\x00\x04\x02\x01\x02\x04\x80\x80\x80\x80\x80".substr((char_code & 0x0F) * 5, 5)
                //         (  "P"               , "Q"               , "R"               , "S"               , "T"               , "U"               , "V"               , "W"               , "X"               , "Y"               , "Z"               , "["               , "\"               , "]"               , "^"               , "_"               )
                case 0x60:
                    return "\x01\x02\x04\x00\x00\x20\x54\x54\x54\x78\x7F\x48\x44\x44\x38\x38\x44\x44\x28\x00\x38\x44\x44\x48\x7F\x38\x54\x54\x54\x18\x08\x7E\x09\x02\x00\x18\xA4\xA4\xA4\x7C\x7F\x08\x04\x04\x78\x00\x7D\x00\x00\x00\x80\x84\x7D\x00\x00\x7F\x10\x28\x44\x00\x41\x7F\x40\x00\x00\x7C\x04\x18\x04\x78\x7C\x08\x04\x7C\x00\x38\x44\x44\x38\x00".substr((char_code & 0x0F) * 5, 5)
                //         (  "`"               , "a"               , "b"               , "c"               , "d"               , "e"               , "f"               ,"g"                , "h"               , "i"               , "j"               , "k"               , "l"               , "m"               , "n"               , "o"               )
                case 0x70:
                    return "\xFC\x24\x24\x18\x00\x18\x24\x24\xFC\x00\x00\x7C\x08\x04\x00\x48\x54\x54\x24\x00\x04\x7F\x44\x00\x00\x3C\x40\x40\x7C\x00\x1C\x20\x40\x20\x1C\x3C\x40\x30\x40\x3C\x44\x28\x10\x28\x44\x1C\xA0\xA0\x7C\x00\x44\x64\x54\x4C\x44\x08\x36\x41\x00\x00\x00\x7F\x00\x00\x00\x41\x36\x08\x00\x00\x02\x01\x01\x02\x01\xFF\xFF\xFF\xFF\xFF".substr((char_code & 0x0F) * 5, 5)
                //         (  "p"               , "q"               , "r"               , "s"               , "t"               , "u"               , "v"               ,"w"                , "x"               , "y"               , "z"               , "{"               , "|"               , "}"               , "~"               , 127               )
                default:
                    return "\xFF\xFF\xFF\xFF\xFF"
            }
        } else {
            let s = "ÄÖÜäöüß€°"
            for (let j = 0; j < s.length; j++) {
                if (s.charCodeAt(j) == char_code)
                    return "\x7D\x0A\x09\x0A\x7D\x3D\x42\x41\x42\x3D\x3D\x40\x40\x40\x3D\x21\x54\x54\x55\x78\x39\x44\x44\x39\x00\x3D\x40\x40\x7D\x00\xFE\x09\x49\x36\x00\x14\x3E\x55\x55\x41\x02\x05\x02\x00\x00".substr(j * 5, 5)
                //         (  "Ä"               , "Ö"               , "Ü"               , "ä"               , "ö"               , "ü"               , "ß"               , "@"               , "°"               )
            }
            return "\xFF\x81\x81\x81\xFF"
        }
    }



} // oled.ts
