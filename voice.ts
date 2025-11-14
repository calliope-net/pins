
namespace pins {/* voice.ts
Am Anfang muss man das Wake-up word:
"Hello robot" sagen, dann geht die blaue LED an.
Jetzt erkennt der Sensor diese Begriffe
und gibt mit voice_read_cmdid() die ID zurück:
command_list = [
    # Wake-up words	1..2
    '0', # 0
    'Wake-up words for learning',
    'Hello robot',
    '3',
    '4',
    # Commands for learning	5..21
    'The first custom command', # 5
    'The second custom command',
    'The third custom command',
    'The fourth custom command',
    'The fifth custom command',
    'The sixth custom command', # 10
    'The seventh custom command',
    'The eighth custom command',
    'The ninth custom command',
    'The tenth custom command',
    'The eleventh custom command', # 15
    'The twelfth custom command',
    'The thirteenth custom command',
    'The fourteenth custom command',
    'The fifteenth custom command',
    'The sixteenth custom command', # 20
    'The seventeenth custom command',
    # Fixed Command Words 22..142
    'Go forward',
    'Retreat',
    'Park a car',
    'Turn left ninety degrees', # 25
    'Turn left forty-five degrees',
    'Turn left thirty degrees',
    'Turn right ninety degrees',
    'Turn right forty-five degrees',
    'Turn right thirty degrees', # 30
    'Shift down a gear',
    'Line tracking mode',
    'Light tracking mode',
    'Bluetooth mode',
    'Obstacle avoidance mode', # 35
    'Face recognition',
    'Object tracking',
    'Object recognition',
    'Line tracking',
    'Color recognition', # 40
    'Tag recognition',
    'Object sorting',
    'Qr code recognition',
    'General settings',
    'Clear screen', # 45
    'Learn once',
    'Forget',
    'Load model',
    'Save model',
    'Take photos and save them', # 50
    'Save and return',
    'Display number zero',
    'Display number one',
    'Display number two',
    'Display number three', # 55
    'Display number four',
    'Display number five',
    'Display number six',
    'Display number seven',
    'Display number eight', # 60
    'Display number nine',
    'Display smiley face',
    'Display crying face',
    'Display heart',
    'Turn off dot matrix', # 65
    'Read current posture',
    'Read ambient light',
    'Read compass',
    'Read temperature',
    'Read acceleration', # 70
    'Reading sound intensity',
    'Calibrate electronic gyroscope',
    'Turn on the camera',
    'Turn off the camera',
    'Turn on the fan', # 75
    'Turn off the fan',
    'Turn fan speed to gear one',
    'Turn fan speed to gear two',
    'Turn fan speed to gear three',
    'Start oscillating', # 80
    'Stop oscillating',
    'Reset',
    'Set servo to ten degrees',
    'Set servo to thirty degrees',
    'Set servo to forty-five degrees', # 85
    'Set servo to sixty degrees',
    'Set servo to ninety degrees',
    'Turn on the buzzer',
    'Turn off the buzzer',
    'Turn on the speaker', # 90
    'Turn off the speaker',
    'Play music',
    'Stop playing',
    'The last track',
    'The next track', # 95
    'Repeat this track',
    'Volume up',
    'Volume down',
    'Change volume to maximum',
    'Change volume to minimum', # 100
    'Change volume to medium',
    'Play poem',
    'Turn on the light',
    'Turn off the light',
    'Brighten the light', # 105
    'Dim the light',
    'Adjust brightness to maximum',
    'Adjust brightness to minimum',
    'Increase color temperature',
    'Decrease color temperature', # 110
    'Adjust color temperature to maximum',
    'Adjust color temperature to minimum',
    'Daylight mode',
    'Moonlight mode',
    'Color mode', # 115
    'Set to red',
    'Set to orange',
    'Set to yellow',
    'Set to green',
    'Set to cyan', # 120
    'Set to blue',
    'Set to purple',
    'Set to white',
    'Turn on ac',
    'Turn off ac', # 125
    'Increase temperature',
    'Decrease temperature',
    'Cool mode',
    'Heat mode',
    'Auto mode', # 130
    'Dry mode',
    'Fan mode',
    'Enable blowing up & down',
    'Disable blowing up & down',
    'Enable blowing right & left', # 135
    'Disable blowing right & left',
    'Open the window',
    'Close the window',
    'Open curtain',
    'Close curtain', # 140
    'Open the door',
    'Close the door' # 142
]
*/
    const voice_I2C_ADDRESS = 0x64
    const voice_DF2301Q_I2C_REG_CMDID = 0x02


    //% group="Gravity: Voice Recognition Sensor" subcategory="Spracherkennung"
    //% block="Kommando ID" weight=7
    export function voice_read_cmdid(): number {
        let bu = pins_i2cWriteReadBuffer(voice_I2C_ADDRESS, Buffer.fromArray([voice_DF2301Q_I2C_REG_CMDID]), 1)
        return bu[0]
    }


} // voice.ts
