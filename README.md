### Future work

* `02_node/06_node_dynamic_messages`: Switch from httpGet() and httpPost() to fetch() everywhere?
* `02_node/10_node_live_state_objects`: Make an analogous example with a list (e.g. collaborative drawing?)
* `02_node/13_node_dynamic_arduino_out`: Add support for automatic reconnect (e.g. after the Arduino browns out etc; `Error: ENXIO: no such device or address, write Emitted 'error' event on SerialPort instance at:`)
* `02_node/13_node_dynamic_arduino_out`: Necessary to read from the serial buffer? (Kaylee encountered this problem on a Raspberry Pi)
* `02_node/16_node_webcam_mjpeg`: Add Raspberry Pi (camera) support
* `02_node/18_node_dynamic_thermal_printer`: Improve example, add mutually exclusive access (against concurrent requests)

* `03_micropython`: Make more Pythonic? (e.g. __main__)
* `03_micropython`: Add an example of collaborative or persistent servo movement
* `03_micropython`: Add an example that explores solar/battery (`IO0`)
* `03_micropython`: Add an example that combines ESP32 with Arduino (as peripheral)
* `03_micropython`: Explore [camera](https://github.com/lemariva/micropython-camera-driver)?
