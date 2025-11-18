
namespace pins {/* voice.ts
Am Anfang muss man das Wake-up word:
"Hello robot" sagen, dann geht die blaue LED an.
Jetzt erkennt der Sensor diese Begriffe
und gibt mit voice_read_cmdid() die ID zurück
*/

    const voice_I2C_ADDRESS = 0x64
    let voice_I2C_connected: boolean = undefined
    const voice_DF2301Q_I2C_REG_CMDID = 0x02
    const voice_DF2301Q_I2C_REG_PLAY_CMDID = 0x03
    const voice_DF2301Q_I2C_REG_SET_MUTE = 0x04
    const voice_DF2301Q_I2C_REG_SET_VOLUME = 0x05
    const voice_DF2301Q_I2C_REG_WAKE_TIME = 0x06



    // ========== group="Gravity: Voice Recognition Sensor" subcategory="Spracherkennung"

    //% group="Gravity: Voice Recognition Sensor" subcategory="Spracherkennung"
    //% block="Kommando ID" weight=7
    export function voice_read_cmdid(): number {
        if (pins_i2cWriteBuffer(voice_I2C_ADDRESS, Buffer.fromArray([voice_DF2301Q_I2C_REG_CMDID]), true) == 0)
            return pins_i2cReadBuffer(voice_I2C_ADDRESS, 1).getUint8(0)
        else
            return -1
        //let bu = pins_i2cWriteReadBuffer(voice_I2C_ADDRESS, Buffer.fromArray([voice_DF2301Q_I2C_REG_CMDID]), 1)
        //return bu[0]
    }

    //% group="Gravity: Voice Recognition Sensor" subcategory="Spracherkennung"
    //% block="spiele Antwort ID %id" weight=5
    export function voice_play_cmdid(id: number) {
        pins_i2cWriteBuffer(voice_I2C_ADDRESS, Buffer.fromArray([voice_DF2301Q_I2C_REG_PLAY_CMDID, id]))
    }


    // ========== group="Konfiguration" subcategory="Spracherkennung"

    //% group="Konfiguration" subcategory="Spracherkennung"
    //% block="Wachzeit %sekunden Sekunden" weight=7
    //% sekunden.min=5 sekunden.max=60 sekunden.defl=15
    export function voice_waketime(sekunden: number) {
        pins_i2cWriteBuffer(voice_I2C_ADDRESS, Buffer.fromArray([voice_DF2301Q_I2C_REG_WAKE_TIME, sekunden]))
    }

    //% group="Konfiguration" subcategory="Spracherkennung"
    //% block="Lautsprecher %on || Lautstärke %volume" weight=5
    //% on.shadow=toggleOnOff
    //% volume.min=5 volume.max=15
    export function voice_speaker(on: boolean, volume: number) { // true = Mute = aus
        pins_i2cWriteBuffer(voice_I2C_ADDRESS, Buffer.fromArray([voice_DF2301Q_I2C_REG_SET_MUTE, on ? 0 : 1]))
        if (on && volume)
            pins_i2cWriteBuffer(voice_I2C_ADDRESS, Buffer.fromArray([voice_DF2301Q_I2C_REG_SET_VOLUME, volume]))
    }



    // ========== group="Kommandos" subcategory="Spracherkennung"

    //% group="Kommandos 0..142 und 200..208" subcategory="Spracherkennung"
    //% block="Kommando Text ID %id" weight=5
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


    //% group="Kommandos 0..142 und 200..208" subcategory="Spracherkennung"
    //% block="spiele ODE" weight=4
    export function play_ode() {
        const melodyArray = ['e4', 'e', 'f', 'g', 'g', 'f', 'e', 'd', 'c', 'c', 'd', 'e', 'e:6', 'd:2', 'd:8', 'e:4', 'e', 'f', 'g', 'g', 'f', 'e', 'd', 'c', 'c', 'd', 'e', 'd:6', 'c:2', 'c:8']
        music.startMelody(melodyArray, MelodyOptions.Once)
    }

} // voice.ts
