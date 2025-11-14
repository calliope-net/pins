input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
	
})
if (!(pins.simulator())) {
    pins.addDisplay(pins.pins_DigitalPin(DigitalPin.C16), pins.pins_DigitalPin(DigitalPin.C17))
    pins.addDisplay(pins.pins_DigitalPin(DigitalPin.P2), pins.pins_DigitalPin(DigitalPin.P3))
    pins.addDisplay(pins.pins_DigitalPin(DigitalPin.P0), pins.pins_DigitalPin(DigitalPin.P1))
}
