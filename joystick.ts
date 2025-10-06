
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
        if (q_joystick_buffer[5] == 0) {
            q_button_on_off = !q_button_on_off
            pins_i2cWriteBuffer(q_i2c, Buffer.fromArray([STATUS, 0]))
        }
    }



    // ========== group="Joystick Position 0 .. 128 .. 255" subcategory="Joystick"

    //% group="Joystick Position 0 .. 128 .. 255" subcategory="Joystick"
    //% block="Joystick x || Nullstelle %nullstelle" weight=4
    //% nullstelle.defl=6
    export function get_x(nullstelle?: number) {
        if (nullstelle && between(q_x, STOP - nullstelle, STOP + nullstelle))
            return STOP
        else
            return q_x
    }

    //% group="Joystick Position 0 .. 128 .. 255" subcategory="Joystick"
    //% block="Joystick y || Nullstelle %nullstelle" weight=3
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


} // joystick.ts
