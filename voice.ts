
namespace pins {/* voice.ts
Am Anfang muss man das Wake-up word:
"Hello robot" sagen, dann geht die blaue LED an.
Jetzt erkennt der Sensor diese Begriffe
und gibt mit voice_read_cmdid() die ID zurück
*/

    const voice_I2C_ADDRESS = 0x64
    const voice_EEPROM_I2C_ADDRESS = 0x50
    // let voice_I2C_connected: boolean = undefined
    /*
    const voice_DF2301Q_I2C_REG_CMDID = 0x02
    const voice_DF2301Q_I2C_REG_PLAY_CMDID = 0x03
    const voice_DF2301Q_I2C_REG_SET_MUTE = 0x04
    const voice_DF2301Q_I2C_REG_SET_VOLUME = 0x05
    const voice_DF2301Q_I2C_REG_WAKE_TIME = 0x06
    */
    export enum voice_eRegister {
        CMDID = 0x02, PLAY_CMDID = 0x03, SET_MUTE = 0x04, SET_VOLUME = 0x05, WAKE_TIME = 0x06
    }

    //% blockId=pins_voice_eRegister blockHidden=true
    //% group="Voice Recognition Sensor (I²C 0x64)" subcategory="Spracherkennung"
    //% block="%pRegister"
    export function pins_voice_eRegister(pRegister: voice_eRegister): number { return pRegister }


    // ========== group="Gravity: Voice Recognition Sensor" subcategory="Spracherkennung"

    //% group="Voice Recognition Sensor (I²C 0x64)" subcategory="Spracherkennung" color=#1ABC9C
    //% block="Kommando ID" weight=7
    export function voice_read_cmdid(): number { // repeat=true muss angegeben werden
        if (pins_i2cWriteBuffer(voice_I2C_ADDRESS, Buffer.fromArray([voice_eRegister.CMDID]), true) == 0)
            return pins_i2cReadBuffer(voice_I2C_ADDRESS, 1).getUint8(0)
        else
            return -1
        //let bu = pins_i2cWriteReadBuffer(voice_I2C_ADDRESS, Buffer.fromArray([voice_DF2301Q_I2C_REG_CMDID]), 1)
        //return bu[0]
    }

    //% group="Voice Recognition Sensor (I²C 0x64)" subcategory="Spracherkennung"
    //% block="spiele Antwort ID %id" weight=5
    export function voice_play_cmdid(id: number) {
        pins_i2cWriteBuffer(voice_I2C_ADDRESS, Buffer.fromArray([voice_eRegister.PLAY_CMDID, id]))
    }



    // ========== group="Konfiguration" subcategory="Spracherkennung"

    //% group="Konfiguration" subcategory="Spracherkennung"
    //% block="Voice Sensor angeschlossen" weight=8
    export function voice_connected(): boolean {
        let bu = pins_i2cWriteReadBuffer(voice_I2C_ADDRESS, Buffer.fromArray([voice_eRegister.WAKE_TIME]), 1)
        return bu ? true : false
    }

    //% group="Konfiguration" subcategory="Spracherkennung"
    //% block="Wachzeit %sekunden Sekunden" weight=7
    //% sekunden.min=5 sekunden.max=60 sekunden.defl=15
    export function voice_waketime(sekunden: number) {
        pins_i2cWriteBuffer(voice_I2C_ADDRESS, Buffer.fromArray([voice_eRegister.WAKE_TIME, sekunden]))
    }

    //% group="Konfiguration" subcategory="Spracherkennung"
    //% block="Lautsprecher %on || Lautstärke %volume" weight=5
    //% on.shadow=toggleOnOff
    //% volume.min=5 volume.max=15
    export function voice_speaker(on: boolean, volume: number) { // true = Mute = aus
        pins_i2cWriteBuffer(voice_I2C_ADDRESS, Buffer.fromArray([voice_eRegister.SET_MUTE, on ? 0 : 1]))
        if (on && volume)
            pins_i2cWriteBuffer(voice_I2C_ADDRESS, Buffer.fromArray([voice_eRegister.SET_VOLUME, volume]))
    }

    //% group="Konfiguration" subcategory="Spracherkennung"
    //% block="Register %reg (2..6) lesen" weight=3
    // reg.min=2 reg.max=6
    //% reg.shadow=pins_voice_eRegister reg.defl=pins.voice_eRegister.WAKE_TIME
    export function voice_register(reg: number) {
        if (between(reg, voice_eRegister.CMDID, voice_eRegister.WAKE_TIME)) { // 2..6
            let bu = pins_i2cWriteReadBuffer(voice_I2C_ADDRESS, Buffer.fromArray([reg]), 1)
            if (bu)
                return bu.getUint8(0)
            else
                return -1
        } else
            return NaN
    }



    // ========== group="Kommandos 5..142 und 200..208" subcategory="Spracherkennung"

    //% blockId=pins_voice_command_enum
    //% group="Kommandos 5..142 und 200..208" subcategory="Spracherkennung"
    //% block="Kommando ID %e" weight=5
    export function voice_command_enum(e: voice_FixedCommandWords) {
        return e
    }

    export enum voice_FixedCommandWords {
        //% block="5 stop"
        W5 = 5,
        //% block="6 vorwärts"
        W6 = 6,
        //% block="7 rückwärts"
        W7 = 7,
        //% block="8 nach links"
        W8 = 8,
        //% block="9 nach rechts"
        W9 = 9,
        //% block="10 links vor"
        W10 = 10,
        //% block="11 links zurück"
        W11 = 11,
        //% block="12 rechts vor"
        W12 = 12,
        //% block="13 rechts zurück"
        W13 = 13,
        //% block="14 links drehen"
        W14 = 14,
        //% block="15 rechts drehen"
        W15 = 15,
        //% block="16 L"
        W16 = 16,
        //% block="17 M"
        W17 = 17,
        //% block="18 N"
        W18 = 18,
        //% block="19 O"
        W19 = 19,
        //% block="20 P"
        W20 = 20,
        //% block="21 Q"
        W21 = 21,


        //% block="22 Go forward"
        W22 = 22,
        //% block="23 Retreat"
        W23 = 23,
        //% block="Park a car"
        W24 = 24,
        //% block="Turn left ninety degrees"
        W25 = 25,
        //% block="Turn left forty-five degrees"
        W26 = 26,
        //% block="Turn left thirty degrees"
        W27 = 27,
        //% block="Turn right ninety degrees"
        W28 = 28,
        //% block="Turn right forty-five degrees"
        W29 = 29,
        //% block="Turn right thirty degrees"
        W30 = 30,
        //% block="Shift down a gear"
        W31 = 31,
        //% block="Line tracking mode"
        W32 = 32,
        //% block="Light tracking mode"
        W33 = 33,
        //% block="Bluetooth mode"
        W34 = 34,
        //% block="Obstacle avoidance mode"
        W35 = 35,
        //% block="Face recognition"
        W36 = 36,
        //% block="Object tracking"
        W37 = 37,
        //% block="Object recognition"
        W38 = 38,
        //% block="Line tracking"
        W39 = 39,
        //% block="Color recognition"
        W40 = 40,
        //% block="Tag recognition"
        W41 = 41,
        //% block="Object sorting"
        W42 = 42,
        //% block="Qr code recognition"
        W43 = 43,
        //% block="General settings"
        W44 = 44,
        //% block="Clear screen"
        W45 = 45,
        //% block="Learn once"
        W46 = 46,
        //% block="Forget"
        W47 = 47,
        //% block="Load model"
        W48 = 48,
        //% block="Save model"
        W49 = 49,
        //% block="Take photos and save them"
        W50 = 50,
        //% block="Save and return"
        W51 = 51,
        //% block="Display number zero"
        W52 = 52,
        //% block="Display number one"
        W53 = 53,
        //% block="Display number two"
        W54 = 54,
        //% block="Display number three"
        W55 = 55,
        //% block="Display number four"
        W56 = 56,
        //% block="Display number five"
        W57 = 57,
        //% block="Display number six"
        W58 = 58,
        //% block="Display number seven"
        W59 = 59,
        //% block="Display number eight"
        W60 = 60,
        //% block="Display number nine"
        W61 = 61,
        //% block="Display smiley face"
        W62 = 62,
        //% block="Display crying face"
        W63 = 63,
        //% block="Display heart"
        W64 = 64,
        //% block="Turn off dot matrix"
        W65 = 65,
        //% block="Read current posture"
        W66 = 66,
        //% block="Read ambient light"
        W67 = 67,
        //% block="Read compass"
        W68 = 68,
        //% block="Read temperature"
        W69 = 69,
        //% block="Read acceleration"
        W70 = 70,
        //% block="Reading sound intensity"
        W71 = 71,
        //% block="Calibrate electronic gyroscope"
        W72 = 72,
        //% block="Turn on the camera"
        W73 = 73,
        //% block="Turn off the camera"
        W74 = 74,
        //% block="Turn on the fan"
        W75 = 75,
        //% block="Turn off the fan"
        W76 = 76,
        //% block="Turn fan speed to gear one"
        W77 = 77,
        //% block="Turn fan speed to gear two"
        W78 = 78,
        //% block="Turn fan speed to gear three"
        W79 = 79,
        //% block="80 Start oscillating"
        W80 = 80,
        //% block="81 Stop oscillating"
        W81 = 81,
        //% block="82 Reset"
        W82 = 82,
        //% block="83 Set servo to ten degrees"
        W83 = 83,
        //% block="84 Set servo to thirty degrees"
        W84 = 84,
        //% block="85 Set servo to forty-five degrees"
        W85 = 85,
        //% block="86 Set servo to sixty degrees"
        W86 = 86,
        //% block="87 Set servo to ninety degrees"
        W87 = 87,
        //% block="88 Turn on the buzzer"
        W88 = 88,
        //% block="89 Turn off the buzzer"
        W89 = 89,
        //% block="90 Turn on the speaker"
        W90 = 90,
        //% block="91 Turn off the speaker"
        W91 = 91,
        //% block="92 Play music"
        W92 = 92,
        //% block="93 Stop playing"
        W93 = 93,
        //% block="94 The last track"
        W94 = 94,
        //% block="95 The next track"
        W95 = 95,
        //% block="96 Repeat this track"
        W96 = 96,
        //% block="97 Volume up"
        W97 = 97,
        //% block="98 Volume down"
        W98 = 98,
        //% block="99 Change volume to maximum"
        W99 = 99,
        //% block="100 Change volume to minimum"
        W100 = 100,
        //% block="101 Change volume to medium"
        W101 = 101,
        //% block="102 Play poem"
        W102 = 102,
        //% block="103 Turn on the light"
        W103 = 103,
        //% block="104 Turn off the light"
        W104 = 104,
        //% block="105 Brighten the light"
        W105 = 105,
        //% block="106 Dim the light"
        W106 = 106,
        //% block="107 Adjust brightness to maximum"
        W107 = 107,
        //% block="108 Adjust brightness to minimum"
        W108 = 108,
        //% block="109 Increase color temperature"
        W109 = 109,
        //% block="110 Decrease color temperature"
        W110 = 110,
        //% block="111 Adjust color temperature to maximum"
        W111 = 111,
        //% block="112 Adjust color temperature to minimum"
        W112 = 112,
        //% block="113 Daylight mode"
        W113 = 113,
        //% block="114 Moonlight mode"
        W114 = 114,
        //% block="115 Color mode"
        W115 = 115,
        //% block="116 Set to red"
        W116 = 116,
        //% block="117 Set to orange"
        W117 = 117,
        //% block="118 Set to yellow"
        W118 = 118,
        //% block="119 Set to green"
        W119 = 119,
        //% block="120 Set to cyan"
        W120 = 120,
        //% block="121 Set to blue"
        W121 = 121,
        //% block="122 Set to purple"
        W122 = 122,
        //% block="123 Set to white"
        W123 = 123,
        //% block="124 Turn on ac"
        W124 = 124,
        //% block="125 Turn off ac"
        W125 = 125,
        //% block="126 Increase temperature"
        W126 = 126,
        //% block="127 Decrease temperature"
        W127 = 127,
        //% block="128 Cool mode"
        W128 = 128,
        //% block="129 Heat mode"
        W129 = 129,
        //% block="130 Auto mode"
        W130 = 130,
        //% block="131 Dry mode"
        W131 = 131,
        //% block="132 Fan mode"
        W132 = 132,
        //% block="133 Enable blowing up and down"
        W133 = 133,
        //% block="134 Disable blowing up and down"
        W134 = 134,
        //% block="135 Enable blowing right and left"
        W135 = 135,
        //% block="136 Disable blowing right and left"
        W136 = 136,
        //% block="137 Open the window"
        W137 = 137,
        //% block="138 Close the window"
        W138 = 138,
        //% block="139 Open curtain"
        W139 = 139,
        //% block="140 Close curtain"
        W140 = 140,
        //% block="141 Open the door"
        W141 = 141,
        //% block="142 Close the door"
        W142 = 142,


        //% block="200 Learning wake word"
        W200 = 200,
        //% block="201 Learning command word"
        W201 = 201,
        //% block="202 Re-learn"
        W202 = 202,
        //% block="203 Exit learning"
        W203 = 203,
        //% block="204 I want to delete"
        W204 = 204,
        //% block="205 Delete wake word"
        W205 = 205,
        //% block="206 Delete command word"
        W206 = 206,
        //% block="207 Exit deleting"
        W207 = 207,
        //% block="208 Delete all"
        W208 = 208
    }

   /*  export enum voice_LearningRelatedCommands {
        //% block="Learning wake word"
        W200 = 200,
        //% block="Learning command word"
        W201 = 201,
        //% block="Re-learn"
        W202 = 202,
        //% block="Exit learning"
        W203 = 203,
        //% block="I want to delete"
        W204 = 204,
        //% block="Delete wake word"
        W205 = 205,
        //% block="Delete command word"
        W206 = 206,
        //% block="Exit deleting"
        W207 = 207,
        //% block="Delete all"
        W208 = 208
    } */



    // ========== group="Kommandos 0..142 und 200..208" subcategory="Spracherkennung"

    //% group="Kommandos 0..142 und 200..208" subcategory="Spracherkennung"
    //% block="Kommando ID %id als Text" weight=5
    export function voice_command_text(id: number) {
        // Calliope v2 erlaubt nur Array Längen bis 32 Elemente
        if (id >= 0 && id <= 31) // && id <= 142
            return [
                // Wake-up words	1..2
                '0', // 0
                'Wake-up words for learning',
                'Hello robot',
                '3',
                '4',
                // Commands for learning 5..21 A..Q
                "stop", // 5
                "vorwärts",
                "rückwärts",
                "nach links",
                "nach rechts",
                "links vor", // 10
                "links zurück",
                "rechts vor",
                "rechts zurück",
                "links drehen",
                "rechts drehen", // 15
                "L", "M", "N", "O", "P", // 20
                "Q", // 21
                // Fixed Command Words 22..142
                'Go forward',
                'Retreat',
                'Park a car',
                'Turn left ninety degrees', // 25
                'Turn left forty-five degrees',
                'Turn left thirty degrees',
                'Turn right ninety degrees',
                'Turn right forty-five degrees',
                'Turn right thirty degrees', // 30
                'Shift down a gear' // 31
            ].get(id)
        else if (id >= 32 && id <= 63)
            return [
                'Line tracking mode', // 32-32 = 0
                'Light tracking mode',
                'Bluetooth mode',
                'Obstacle avoidance mode', // 35
                'Face recognition',
                'Object tracking',
                'Object recognition',
                'Line tracking',
                'Color recognition', // 40
                'Tag recognition',
                'Object sorting',
                'Qr code recognition',
                'General settings',
                'Clear screen', // 45
                'Learn once',
                'Forget',
                'Load model',
                'Save model',
                'Take photos and save them', // 50
                'Save and return',
                'Display number zero',
                'Display number one',
                'Display number two',
                'Display number three', // 55
                'Display number four',
                'Display number five',
                'Display number six',
                'Display number seven',
                'Display number eight', // 60
                'Display number nine',
                'Display smiley face',
                'Display crying face' // 63-32 = 31
            ].get(id - 32)
        else if (id >= 64 && id <= 95)
            return [
                'Display heart', // 64-64 = 0
                'Turn off dot matrix', // 65
                'Read current posture',
                'Read ambient light',
                'Read compass',
                'Read temperature',
                'Read acceleration', // 70
                'Reading sound intensity',
                'Calibrate electronic gyroscope',
                'Turn on the camera',
                'Turn off the camera',
                'Turn on the fan', // 75
                'Turn off the fan',
                'Turn fan speed to gear one',
                'Turn fan speed to gear two',
                'Turn fan speed to gear three',
                'Start oscillating', // 80
                'Stop oscillating',
                'Reset',
                'Set servo to ten degrees',
                'Set servo to thirty degrees',
                'Set servo to forty-five degrees', // 85
                'Set servo to sixty degrees',
                'Set servo to ninety degrees',
                'Turn on the buzzer',
                'Turn off the buzzer',
                'Turn on the speaker', // 90
                'Turn off the speaker',
                'Play music',
                'Stop playing',
                'The last track',
                'The next track' // 95-64 = 31
            ].get(id - 64)
        else if (id >= 96 && id <= 127)
            return [
                'Repeat this track', // 96-96 = 0
                'Volume up',
                'Volume down',
                'Change volume to maximum',
                'Change volume to minimum', // 100
                'Change volume to medium',
                'Play poem',
                'Turn on the light',
                'Turn off the light',
                'Brighten the light', // 105
                'Dim the light',
                'Adjust brightness to maximum',
                'Adjust brightness to minimum',
                'Increase color temperature',
                'Decrease color temperature', // 110
                'Adjust color temperature to maximum',
                'Adjust color temperature to minimum',
                'Daylight mode',
                'Moonlight mode',
                'Color mode', // 115
                'Set to red',
                'Set to orange',
                'Set to yellow',
                'Set to green',
                'Set to cyan', // 120
                'Set to blue',
                'Set to purple',
                'Set to white',
                'Turn on ac',
                'Turn off ac', // 125
                'Increase temperature',
                'Decrease temperature' // 127-96 = 31
            ].get(id - 96)
        else if (id >= 128 && id <= 142)
            return [
                'Cool mode', // 128-128 = 0
                'Heat mode',
                'Auto mode', // 130
                'Dry mode',
                'Fan mode',
                'Enable blowing up & down',
                'Disable blowing up & down',
                'Enable blowing right & left', // 135
                'Disable blowing right & left',
                'Open the window',
                'Close the window',
                'Open curtain',
                'Close curtain', // 140
                'Open the door',
                'Close the door' // 142-128 = 14
            ].get(id - 128)
        else if (id >= 200 && id <= 208)
            return [
                // Learning - related commands 200..208
                'Learning wake word	', // 200
                'Learning command word',
                'Re-learn',
                'Exit learning',
                'I want to delete',
                'Delete wake word', // 205
                'Delete command word',
                'Exit deleting',
                'Delete all' // 208
            ].get(id - 200)
        else
            return ""
    }


    //% group="Kommandos 0..142 und 200..208" subcategory="Spracherkennung" color=#1ABC9C
    //% block="Kommando ID %id aus EEPROM" weight=3
    export function voice_command_text_eeprom(id: number) {
        const eeprom_startadresse = 0xDD00
        if (id >= 200 && id <= 208)
            id -= 57
        let bu = Buffer.create(2) // EEPROM Startadresse 16 Bit
        bu.setNumber(NumberFormat.UInt16BE, 0, eeprom_startadresse + (id >> 2) * 128)
        bu = pins_i2cWriteReadBuffer(voice_EEPROM_I2C_ADDRESS, bu, 128)
        let csv_list = bu.toString().split(";")
        if (csv_list.length >= 4)
            return csv_list[id & 3]
        else
            return ""
    }


} // voice.ts
