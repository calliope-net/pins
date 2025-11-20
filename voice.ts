
namespace pins {/* voice.ts
Am Anfang muss man das Wake-up word:
"Hello robot" sagen, dann geht die blaue LED an.
Jetzt erkennt der Sensor diese Begriffe
und gibt mit voice_read_cmdid() die ID zurück
*/

    const voice_I2C_ADDRESS = 0x64
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
    //% group="Gravity: Voice Recognition Sensor" subcategory="Spracherkennung"
    //% block="%pRegister"
    export function pins_voice_eRegister(pRegister: voice_eRegister): number { return pRegister }


    // ========== group="Gravity: Voice Recognition Sensor" subcategory="Spracherkennung"

    //% group="Gravity: Voice Recognition Sensor" subcategory="Spracherkennung"
    //% block="Kommando ID" weight=7
    export function voice_read_cmdid(): number { // repeat=true muss angegeben werden
        if (pins_i2cWriteBuffer(voice_I2C_ADDRESS, Buffer.fromArray([voice_eRegister.CMDID]), true) == 0)
            return pins_i2cReadBuffer(voice_I2C_ADDRESS, 1).getUint8(0)
        else
            return -1
        //let bu = pins_i2cWriteReadBuffer(voice_I2C_ADDRESS, Buffer.fromArray([voice_DF2301Q_I2C_REG_CMDID]), 1)
        //return bu[0]
    }

    //% group="Gravity: Voice Recognition Sensor" subcategory="Spracherkennung"
    //% block="spiele Antwort ID %id" weight=5
    export function voice_play_cmdid(id: number) {
        pins_i2cWriteBuffer(voice_I2C_ADDRESS, Buffer.fromArray([voice_eRegister.PLAY_CMDID, id]))
    }


    // ========== group="Konfiguration" subcategory="Spracherkennung"

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
        if (between(reg, voice_eRegister.CMDID, voice_eRegister.WAKE_TIME)) {
            let bu = pins_i2cWriteReadBuffer(voice_I2C_ADDRESS, Buffer.fromArray([reg]), 1)
            if (bu)
                return bu.getUint8(0)
            else
                return -1
        } else
            return NaN
    }


    // ========== group="Kommandos" subcategory="Spracherkennung"

    //% group="Kommandos 0..142 und 200..208" subcategory="Spracherkennung"
    //% block="Kommando ID %id als Text" weight=5
    export function voice_command_text(id: number) {
        if (id >= 0 && id <= 142)
            return [
                // Wake-up words	1..2
                '0', // 0
                'Wake-up words for learning',
                'Hello robot',
                '3',
                '4',
                // Commands for learning 5..21 A..Q
                "A", // 5
                "B", "C", "D", "E", "F", // 10
                "G", "H", "I", "J", "K", // 15
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
                'Shift down a gear',
                'Line tracking mode',
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
                'Display crying face',
                'Display heart',
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
                'The next track', // 95
                'Repeat this track',
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
                'Decrease temperature',
                'Cool mode',
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
                'Close the door' // 142
            ].get(id)
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


    //% blockId=pins_voice_command_enum
    //% group="Kommandos 5..142 und 200..208" subcategory="Spracherkennung"
    //% block="Kommando ID %e" weight=5
    export function voice_command_enum(e: voice_FixedCommandWords) {
        return e
    }

    export enum voice_FixedCommandWords {
        //% block="5 A"
        W5 = 5,
        //% block="6 B"
        W6 = 6,
        //% block="7 C"
        W7 = 7,
        //% block="8 D"
        W8 = 8,
        //% block="9 E"
        W9 = 9,
        //% block="10 F"
        W10 = 10,
        //% block="11 G"
        W11 = 11,
        //% block="12 H"
        W12 = 12,
        //% block="13 I"
        W13 = 13,
        //% block="14 J"
        W14 = 14,
        //% block="15 K"
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
        //% blockId="voiceRecognition_W24" block="Park a car"
        W24 = 24,
        //% blockId="voiceRecognition_W25" block="Turn left ninety degrees"
        W25 = 25,
        //% blockId="voiceRecognition_W26" block="Turn left forty-five degrees"
        W26 = 26,
        //% blockId="voiceRecognition_W27" block="Turn left thirty degrees"
        W27 = 27,
        //% blockId="voiceRecognition_W28" block="Turn right ninety degrees"
        W28 = 28,
        //% blockId="voiceRecognition_W29" block="Turn right forty-five degrees"
        W29 = 29,
        //% blockId="voiceRecognition_W30" block="Turn right thirty degrees"
        W30 = 30,
        //% blockId="voiceRecognition_W31" block="Shift down a gear"
        W31 = 31,
        //% blockId="voiceRecognition_W32" block="Line tracking mode"
        W32 = 32,
        //% blockId="voiceRecognition_W33" block="Light tracking mode"
        W33 = 33,
        //% blockId="voiceRecognition_W34" block="Bluetooth mode"
        W34 = 34,
        //% blockId="voiceRecognition_W35" block="Obstacle avoidance mode"
        W35 = 35,
        //% blockId="voiceRecognition_W36" block="Face recognition"
        W36 = 36,
        //% blockId="voiceRecognition_W37" block="Object tracking"
        W37 = 37,
        //% blockId="voiceRecognition_W38" block="Object recognition"
        W38 = 38,
        //% blockId="voiceRecognition_W39" block="Line tracking"
        W39 = 39,
        //% blockId="voiceRecognition_W40" block="Color recognition"
        W40 = 40,
        //% blockId="voiceRecognition_W41" block="Tag recognition"
        W41 = 41,
        //% blockId="voiceRecognition_W42" block="Object sorting"
        W42 = 42,
        //% blockId="voiceRecognition_W43" block="Qr code recognition"
        W43 = 43,
        //% blockId="voiceRecognition_W44" block="General settings"
        W44 = 44,
        //% blockId="voiceRecognition_W45" block="Clear screen"
        W45 = 45,
        //% blockId="voiceRecognition_W46" block="Learn once"
        W46 = 46,
        //% blockId="voiceRecognition_W47" block="Forget"
        W47 = 47,
        //% blockId="voiceRecognition_W48" block="Load model"
        W48 = 48,
        //% blockId="voiceRecognition_W49" block="Save model"
        W49 = 49,
        //% blockId="voiceRecognition_W50" block="Take photos and save them"
        W50 = 50,
        //% blockId="voiceRecognition_W51" block="Save and return"
        W51 = 51,
        //% blockId="voiceRecognition_W52" block="Display number zero"
        W52 = 52,
        //% blockId="voiceRecognition_W53" block="Display number one"
        W53 = 53,
        //% blockId="voiceRecognition_W54" block="Display number two"
        W54 = 54,
        //% blockId="voiceRecognition_W55" block="Display number three"
        W55 = 55,
        //% blockId="voiceRecognition_W56" block="Display number four"
        W56 = 56,
        //% blockId="voiceRecognition_W57" block="Display number five"
        W57 = 57,
        //% blockId="voiceRecognition_W58" block="Display number six"
        W58 = 58,
        //% blockId="voiceRecognition_W59" block="Display number seven"
        W59 = 59,
        //% blockId="voiceRecognition_W60" block="Display number eight"
        W60 = 60,
        //% blockId="voiceRecognition_W61" block="Display number nine"
        W61 = 61,
        //% blockId="voiceRecognition_W62" block="Display smiley face"
        W62 = 62,
        //% blockId="voiceRecognition_W63" block="Display crying face"
        W63 = 63,
        //% blockId="voiceRecognition_W64" block="Display heart"
        W64 = 64,
        //% blockId="voiceRecognition_W65" block="Turn off dot matrix"
        W65 = 65,
        //% blockId="voiceRecognition_W66" block="Read current posture"
        W66 = 66,
        //% blockId="voiceRecognition_W67" block="Read ambient light"
        W67 = 67,
        //% blockId="voiceRecognition_W68" block="Read compass"
        W68 = 68,
        //% blockId="voiceRecognition_W69" block="Read temperature"
        W69 = 69,
        //% blockId="voiceRecognition_W70" block="Read acceleration"
        W70 = 70,
        //% blockId="voiceRecognition_W71" block="Reading sound intensity"
        W71 = 71,
        //% blockId="voiceRecognition_W72" block="Calibrate electronic gyroscope"
        W72 = 72,
        //% blockId="voiceRecognition_W73" block="Turn on the camera"
        W73 = 73,
        //% blockId="voiceRecognition_W74" block="Turn off the camera"
        W74 = 74,
        //% blockId="voiceRecognition_W75" block="Turn on the fan"
        W75 = 75,
        //% blockId="voiceRecognition_W76" block="Turn off the fan"
        W76 = 76,
        //% blockId="voiceRecognition_W77" block="Turn fan speed to gear one"
        W77 = 77,
        //% blockId="voiceRecognition_W78" block="Turn fan speed to gear two"
        W78 = 78,
        //% blockId="voiceRecognition_W79" block="Turn fan speed to gear three"
        W79 = 79,
        //% blockId="voiceRecognition_W80" block="Start oscillating"
        W80 = 80,
        //% blockId="voiceRecognition_W81" block="Stop oscillating"
        W81 = 81,
        //% blockId="voiceRecognition_W82" block="Reset"
        W82 = 82,
        //% blockId="voiceRecognition_W83" block="Set servo to ten degrees"
        W83 = 83,
        //% blockId="voiceRecognition_W84" block="Set servo to thirty degrees"
        W84 = 84,
        //% blockId="voiceRecognition_W85" block="Set servo to forty-five degrees"
        W85 = 85,
        //% blockId="voiceRecognition_W86" block="Set servo to sixty degrees"
        W86 = 86,
        //% blockId="voiceRecognition_W87" block="Set servo to ninety degrees"
        W87 = 87,
        //% blockId="voiceRecognition_W88" block="Turn on the buzzer"
        W88 = 88,
        //% blockId="voiceRecognition_W89" block="Turn off the buzzer"
        W89 = 89,
        //% blockId="voiceRecognition_W90" block="Turn on the speaker"
        W90 = 90,
        //% blockId="voiceRecognition_W91" block="Turn off the speaker"
        W91 = 91,
        //% blockId="voiceRecognition_W92" block="Play music"
        W92 = 92,
        //% blockId="voiceRecognition_W93" block="Stop playing"
        W93 = 93,
        //% blockId="voiceRecognition_W94" block="The last track"
        W94 = 94,
        //% blockId="voiceRecognition_W95" block="The next track"
        W95 = 95,
        //% blockId="voiceRecognition_W96" block="Repeat this track"
        W96 = 96,
        //% blockId="voiceRecognition_W97" block="Volume up"
        W97 = 97,
        //% blockId="voiceRecognition_W98" block="Volume down"
        W98 = 98,
        //% blockId="voiceRecognition_W99" block="Change volume to maximum"
        W99 = 99,
        //% blockId="voiceRecognition_W100" block="Change volume to minimum"
        W100 = 100,
        //% blockId="voiceRecognition_W101" block="Change volume to medium"
        W101 = 101,
        //% blockId="voiceRecognition_W102" block="Play poem"
        W102 = 102,
        //% blockId="voiceRecognition_W103" block="Turn on the light"
        W103 = 103,
        //% blockId="voiceRecognition_W104" block="Turn off the light"
        W104 = 104,
        //% blockId="voiceRecognition_W105" block="Brighten the light"
        W105 = 105,
        //% blockId="voiceRecognition_W106" block="Dim the light"
        W106 = 106,
        //% blockId="voiceRecognition_W107" block="Adjust brightness to maximum"
        W107 = 107,
        //% blockId="voiceRecognition_W108" block="Adjust brightness to minimum"
        W108 = 108,
        //% blockId="voiceRecognition_W109" block="Increase color temperature"
        W109 = 109,
        //% blockId="voiceRecognition_W110" block="Decrease color temperature"
        W110 = 110,
        //% blockId="voiceRecognition_W111" block="Adjust color temperature to maximum"
        W111 = 111,
        //% blockId="voiceRecognition_W112" block="Adjust color temperature to minimum"
        W112 = 112,
        //% blockId="voiceRecognition_W113" block="Daylight mode"
        W113 = 113,
        //% blockId="voiceRecognition_W114" block="Moonlight mode"
        W114 = 114,
        //% blockId="voiceRecognition_W115" block="Color mode"
        W115 = 115,
        //% blockId="voiceRecognition_W116" block="Set to red"
        W116 = 116,
        //% blockId="voiceRecognition_W117" block="Set to orange"
        W117 = 117,
        //% blockId="voiceRecognition_W118" block="Set to yellow"
        W118 = 118,
        //% blockId="voiceRecognition_W119" block="Set to green"
        W119 = 119,
        //% blockId="voiceRecognition_W120" block="Set to cyan"
        W120 = 120,
        //% blockId="voiceRecognition_W121" block="Set to blue"
        W121 = 121,
        //% blockId="voiceRecognition_W122" block="Set to purple"
        W122 = 122,
        //% blockId="voiceRecognition_W123" block="Set to white"
        W123 = 123,
        //% blockId="voiceRecognition_W124" block="Turn on ac"
        W124 = 124,
        //% blockId="voiceRecognition_W125" block="Turn off ac"
        W125 = 125,
        //% blockId="voiceRecognition_W126" block="Increase temperature"
        W126 = 126,
        //% blockId="voiceRecognition_W127" block="Decrease temperature"
        W127 = 127,
        //% blockId="voiceRecognition_W128" block="Cool mode"
        W128 = 128,
        //% blockId="voiceRecognition_W129" block="Heat mode"
        W129 = 129,
        //% blockId="voiceRecognition_W130" block="Auto mode"
        W130 = 130,
        //% blockId="voiceRecognition_W131" block="Dry mode"
        W131 = 131,
        //% blockId="voiceRecognition_W132" block="Fan mode"
        W132 = 132,
        //% blockId="voiceRecognition_W133" block="Enable blowing up and down"
        W133 = 133,
        //% blockId="voiceRecognition_W134" block="Disable blowing up and down"
        W134 = 134,
        //% blockId="voiceRecognition_W135" block="Enable blowing right and left"
        W135 = 135,
        //% blockId="voiceRecognition_W136" block="Disable blowing right and left"
        W136 = 136,
        //% blockId="voiceRecognition_W137" block="Open the window"
        W137 = 137,
        //% blockId="voiceRecognition_W138" block="Close the window"
        W138 = 138,
        //% blockId="voiceRecognition_W139" block="Open curtain"
        W139 = 139,
        //% blockId="voiceRecognition_W140" block="Close curtain"
        W140 = 140,
        //% blockId="voiceRecognition_W141" block="Open the door"
        W141 = 141,
        //% blockId="voiceRecognition_W142" block="Close the door"
        W142 = 142
    }

    export enum voice_LearningRelatedCommands {
        //% blockId="voiceRecognition_W200" block="Learning wake word"
        W200 = 200,
        //% blockId="voiceRecognition_W201" block="Learning command word"
        W201 = 201,
        //% blockId="voiceRecognition_W202" block="Re-learn"
        W202 = 202,
        //% blockId="voiceRecognition_W203" block="Exit learning"
        W203 = 203,
        //% blockId="voiceRecognition_W204" block="I want to delete"
        W204 = 204,
        //% blockId="voiceRecognition_W205" block="Delete wake word"
        W205 = 205,
        //% blockId="voiceRecognition_W206" block="Delete command word"
        W206 = 206,
        //% blockId="voiceRecognition_W207" block="Exit deleting"
        W207 = 207,
        //% blockId="voiceRecognition_W208" block="Delete all"
        W208 = 208
    }


} // voice.ts
