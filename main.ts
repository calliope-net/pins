input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    let list: number[] = []
    while (list.length < 8) {
        list.push(0)
    }
})
if (!(pins.simulator())) {
    pins.d4CreateDisplay(pins.pins_DigitalPin(DigitalPin.C16), pins.pins_DigitalPin(DigitalPin.C17))
    pins.d4CreateDisplay(pins.pins_DigitalPin(DigitalPin.P2), pins.pins_DigitalPin(DigitalPin.P3), true)
    pins.d4CreateDisplay(pins.pins_DigitalPin(DigitalPin.P0), pins.pins_DigitalPin(DigitalPin.P1), true)
    pins.d4Clear()
    pins.d7String("-127 -+b °C")
}
