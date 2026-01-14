## Expanded Web - Fall 2025

## Course Info

- INTM-SHU 201 Expanded Web
- IMA, NYU Shanghai
- Tue & Thu 2:15 PM - 3:30 PM

## Instructor Info

- Gottfried Haider ([profile](https://shanghai.nyu.edu/academics/faculty/directory/gottfried-haider))
- For contact info and office hours, please refer to class email.

## Overview

This repository contains example sketches that explore the combination between the web/internet and the physical realm in three different technical varieties (which are not meant to be exclusive, or prescriptive for ways the two can be put together):

- [[01](01_p5js_webserial)] Expanding p5.js with [p5.webserial.js](https://github.com/gohai/p5.webserial) to interface with Arduino
- [[02](02_node)] Server-side physical computing with Node.js
- [[03](03_micropython)] Turning microcontrollers (ESP32) into low-{tech,power,cost} hosts for websites using MicroPython


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
* `03_micropython`: Consider developing a socket.io-compatible library
* `03_micropython/10_micropython_wifi_ap_captive`: Find a way to make the popup load faster (esp. on Windows)
