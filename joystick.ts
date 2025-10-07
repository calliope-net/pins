
namespace pins  // joystick.ts
/*

n_x = JOYSTICK_BUFFER[0] # X_MSB = 0x03 Current Horizontal Position (MSB First)
n_y = JOYSTICK_BUFFER[2] # Y_MSB = 0x05 Current Vertical Position (MSB First)
n_button_position = (JOYSTICK_BUFFER[4] == 0) # Current Button Position BUTTON 0:ist gedrückt
# wenn Button gedrückt war, STATUS auf 0 setzen

Lutz Elßner, Freiberg, Oktober 2025, lutz@elssner.net
*/ {

    const q_i2c: number = 0x20
    const STOP = 128
    const X_MSB = 3
    const STATUS = 8
    let q_joystick_buffer: Buffer
    let q_x = STOP
    let q_y = STOP
    let q_button_position = false
    let q_button_on_off = false


    // ========== group="in jeder Schleife aufrufen" subcategory="Joystick"

    //% group="in jeder Schleife aufrufen" subcategory="Joystick"
    //% block="Joystick einlesen"
    export function read_joystick() {
        q_joystick_buffer = pins_i2cWriteReadBuffer(q_i2c, Buffer.fromArray([X_MSB]), 6)
        q_x = q_joystick_buffer[0]
        q_y = q_joystick_buffer[2]
        q_button_position = q_joystick_buffer[4] == 0
        if (q_joystick_buffer[5] == 1) { // Button Status: Indicates if button was pressed since last read of button state. Clears after read.
            q_button_on_off = !q_button_on_off // OnOff umschalten
            pins_i2cWriteBuffer(q_i2c, Buffer.fromArray([STATUS, 0]))
        }
    }



    // ========== group="Joystick Position 0 .. 128 .. 255" subcategory="Joystick"

    //% group="Joystick Position 0 .. 128 .. 255" subcategory="Joystick"
    //% block="Joystick x || Stop bei 128 ±%nullstelle" weight=4
    //% nullstelle.defl=6
    export function get_x(nullstelle?: number) {
        if (nullstelle && between(q_x, STOP - nullstelle, STOP + nullstelle))
            return STOP
        else
            return q_x
    }

    //% group="Joystick Position 0 .. 128 .. 255" subcategory="Joystick"
    //% block="Joystick y || Stop bei 128 ± %nullstelle" weight=3
    //% nullstelle.defl=6
    export function get_y(nullstelle?: number) {
        if (nullstelle && between(q_y, STOP - nullstelle, STOP + nullstelle))
            return STOP
        else
            return q_y
    }



    // ========== group="Joystick Button" subcategory="Joystick"

    //% group="Joystick Button" subcategory="Joystick"
    //% block="Button ist gedrückt" weight=3
    export function get_button_position() { return q_button_position }

    //% group="Joystick Button" subcategory="Joystick"
    //% block="Button an/aus" weight=2
    export function get_button_on_off() { return q_button_on_off }



    // ========== group="Raupensteuerung -1 .. 0 .. +1" subcategory="Joystick"

    //% group="Raupensteuerung 0..128..255 | -MAX..0..+MAX" subcategory="Joystick"
    //% block="Raupensteuerung [ml,mr] || PWM_MAX %pwm_max"
    export function raupensteuerung(pwm_max?: number): number[] {
        // 0 .. 128 .. 255 -> -1 .. 0 .. +1
        let x = (q_y * 2) / 255 - 1
        let y = (q_x * 2) / 255 - 1

        // 3. Totzone (Deadband) joystick ±122..133 wird 0
        const deadband = 0.05
        if (Math.abs(x) < deadband)
            x = 0
        if (Math.abs(y) < deadband)
            y = 0

        /*
        x:lenken (-1 links .. 0 .. +1 rechts)
        y:fahren (-1 rückwärts .. 0 .. +1 vorwärts)
        Berechnet linke und rechte Motorwerte aus
        Joystick-Eingaben x, y im Bereich [-1.0, +1.0]
        deadband: Schwelle, unterhalb derer das
        Signal auf 0 gesetzt wird
        ml, mr: Referenzen für die
        Motor-Ausgangswerte im Bereich [-1.0, +1.0]
        */
        // 1. Rohmixing
        let ml = y + x
        let mr = y - x

        // 2. Normalisierung(Skalierung), falls Werte außerhalb[-1, 1]
        let maxv = Math.max(Math.abs(ml), Math.abs(mr))
        if (maxv > 1) {
            ml /= maxv
            mr /= maxv
        }
        // 3. Totzone (Deadband) steht oben
        // 4. Skalierung auf PWM - Bereich[-PWM_MAX.. + PWM_MAX]
        //PWM_MAX = 512 für fischertechnik Controller
        if (pwm_max) {
            ml = Math.round(ml * pwm_max)
            mr = Math.round(mr * pwm_max)
        }
        else {
            // 127,5 sollte mit round aus 128 aufgerundet werden
            // sonst Math.ceil aufrunden auf 128, weil Nullstelle = 127,5
            ml = Math.round(Math.map(ml, -1, 1, 0, 255))
            mr = Math.round(Math.map(mr, -1, 1, 0, 255))
        }
        return [ml, mr]
    }



} // joystick.ts
