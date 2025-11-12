if (!(pins.simulator())) {
    pins.createDisplay(DigitalPin.C16, DigitalPin.C17)
    pins.clear()
    pins.segmente_anzeigen(7, 0)
    pins.segmente_anzeigen(130, 6)
}
