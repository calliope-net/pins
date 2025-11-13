input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    pins.d4CreateDisplay(pins.pins_DigitalPin(DigitalPin.C16), pins.pins_DigitalPin(DigitalPin.C17), false)
    pins.clear()
})
if (!(pins.simulator())) {
    pins.createDisplay(DigitalPin.C16, DigitalPin.C17)
    pins.clear()
    pins.segmente_anzeigen(7, 0)
    pins.segmente_anzeigen(130, 6)
    pins.segmente_anzeigen(137, 11)
}
