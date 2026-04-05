
namespace pins // wattmeter.ts
/* 230828 231007 https://github.com/calliope-net/wattmeter
[Hardware]  https://www.dfrobot.com/product-1827.html
[Datasheet] https://github.com/DFRobot/Wiki/raw/master/SEN0291/res/INA219.pdf
            Register ab Seite 18

https://www.digikey.de/de/products/detail/dfrobot/SEN0291/10279750
https://www.mouser.de/ProductDetail/426-SEN0291

https://media.digikey.com/pdf/Data%20Sheets/DFRobot%20PDFs/SEN0291_Web.pdf
https://wiki.dfrobot.com/Gravity:%20I2C%20Digital%20Wattmeter%20SKU:%20SEN0291

https://github.com/DFRobot/DFRobot_INA219
https://github.com/DFRobot/DFRobot_INA219/blob/master/Python/RespberryPi/DFRobot_INA219.py

Modul wurde geliefert mit eingestellter i2c-Adresse 0x45; DIP Schalter mit Schutzfolie zugeklebt

Calibration
In the actual measurement environment, measurement errors come from many sources.
However, for the Gravity: I2C Digital Wattmeter, the voltage measurement does not need to be calibrated,
and the current measurement error mainly comes from the error of the resistance of the sampling resistor,
which will have a significant impact on the current measurement.
If calibration is not performed, the relative error of the maximum current measurement is about 3%.
If a single-point linear calibration is performed using a high-precision multimeter or an electronic load,
the linearity error of the system can be effectively eliminated, and the maximum relative error can be up to ±0.2%.

If you don't have a regulated power supply nor a DC electronic load on the hand, follow the steps below to calibrate the current measurement:
- Connect the Arduino UNO, multimeter (switch to amperemeter) and load (gas sensor, motor or LCD screen etc. ) as shown below.
    It is recommended that the load power consumption should no less than 100mA.
- Upload the following sample code to Arduino UNO.
- Modify the value of the variable "float ina219Reading_mA = 1000;" according to the readings of the serial port print "Current"
    and "float extMeterReading_mA = 1000;" according to the current readings of the multimeter.
- Upload the sample code to Arduino UNO again.
- Calibration finished.
[Schaltbild] https://raw.githubusercontent.com/DFRobot/Wiki/master/SEN0291/image/SEN0291_cal2_Arduino(EN).png


Code anhand der Python library und Datenblätter neu programmiert von Lutz Elßner im August, September 2023
*/ {
    const q_i2c_wattmeter_x45 = 0x45
    let q_i2c_wattmeter_connected: boolean // undefined

    export enum eRegister {
        REG_CONFIG = 0x00,          // Config register
        REG_SHUNTVOLTAGE = 0x01,    // Shunt Voltage Register
        REG_BUSVOLTAGE = 0x02,      // Bus Voltage Register
        REG_POWER = 0x03,           // Power Register
        REG_CURRENT = 0x04,         // Current Register
        REG_CALIBRATION = 0x05      // Register Calibration
    }
    const INA219_CONFIG_RESET = 0x8000 // Config reset register



    //% group="Wattmeter (I²C 0x45)" subcategory="Wattmeter" color=#002F5F
    //% block="Wattmeter Reset || Calibration %calibration_value"
    //% calibration_value.defl=4096
    export function wattmeter_reset(calibration_value?: number) {
        //n_i2cCheck = (ck ? true : false) // optionaler boolean Parameter kann undefined sein
        //n_i2cError = 0 // Reset Fehlercode

        write_register(eRegister.REG_CONFIG, INA219_CONFIG_RESET) // 0x8000
        write_register(eRegister.REG_CALIBRATION, calibration_value)

        //writeCONFIGURATION(pADDR, 0x8000)
        //writeCALIBRATION(pADDR, calibration_value)
    }




    // ========== group="Messwerte lesen"

    //% group="Messwerte lesen" subcategory="Wattmeter" color=#002F5F
    //% block="Spannung U in V" weight=8
    export function get_bus_voltage_V() { // get the BusVoltage （Voltage of IN- to GND)
        //return (read_ina_reg(pADDR, eRegister.REG_BUSVOLTAGE) >> 1) * 0.001            // py   0.001/2=0.0005

        // die letzten 3 Bit 2-1-0 gehögen nicht zum Messwert | - | CNVR | OVF
        return (read_register(eRegister.REG_BUSVOLTAGE).getNumber(NumberFormat.UInt16BE, 0) >> 3) * 0.004    // cpp  0.004/8=0.0005
        //  return (read_Register_UInt16BE(pADDR, eRegister.REG_BUSVOLTAGE) >> 3) * 0.004    // cpp  0.004/8=0.0005
    }

    //% group="Messwerte lesen" subcategory="Wattmeter" color=#002F5F
    //% block="Strom I in mA" weight=7
    export function get_current_mA() { // get the Current(Current flows across IN+ and IN-)
        return read_register(eRegister.REG_CURRENT).getNumber(NumberFormat.Int16BE, 0)
        // return read_Register_mit_Vorzeichen_Int16BE(pADDR, eRegister.REG_CURRENT)
    }

    //% group="Messwerte lesen" subcategory="Wattmeter" color=#002F5F
    //% block="Leistung P=U*I in mW" weight=6
    export function get_power_mW() { // get the Current(Current flows across IN+ and IN-)
        return read_register(eRegister.REG_POWER).getNumber(NumberFormat.Int16BE, 0) * 20
        // return read_Register_mit_Vorzeichen_Int16BE(pADDR, eRegister.REG_POWER) * 20
    }

    //% group="Messwerte lesen" subcategory="Wattmeter" color=#002F5F
    //% block="Shunt Spannung U in mV" weight=4
    export function get_shunt_voltage_mV() { // get the ShuntVoltage （Voltage of the sampling resistor, IN+ to NI-)
        return read_register(eRegister.REG_SHUNTVOLTAGE).getNumber(NumberFormat.Int16BE, 0)
        // return read_Register_mit_Vorzeichen_Int16BE(pADDR, eRegister.REG_SHUNTVOLTAGE)  // py
    }






    // ========== private

    function read_register(register: eRegister): Buffer { // return: Buffer 2 Byte
        //let bu = Buffer.create(1)
        //bu.setUint8(0, register)
        return pins_i2cWriteReadBuffer(q_i2c_wattmeter_x45, Buffer.fromArray([register]), 2)
        //i2cWriteBuffer(q_i2c_wattmeter_x45, bu, true)
        //return i2cReadBuffer(q_i2c_wattmeter_x45, 2)
    }

    function write_register(register: eRegister, value: number) { // value: uint16_t
        let bu = Buffer.create(3)
        bu.setUint8(0, register)
        bu.setNumber(NumberFormat.UInt16BE, 1, value)
        pins_i2cWriteBuffer(q_i2c_wattmeter_x45, bu)
    }


} // wattmeter.ts
