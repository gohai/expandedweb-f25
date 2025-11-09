# Expanded Web
# NYUSH F25 - gohai
# The microcontroller must be registered with
# NYU Shanghai IoT for this example to work.

def do_connect():
    import machine, network
    wlan = network.WLAN()
    wlan.active(True)
    if not wlan.isconnected():
        print('Connecting to NYU IoT WiFi...')
        wlan.connect('nyu-iot', '12345670')
        while not wlan.isconnected():
            machine.idle()
    print('Network config:', wlan.ipconfig('addr4')[0])

do_connect()

from microdot import Microdot, send_file

app = Microdot()


# the following function handles POST requests
# from the website containing color information,
# and sets a Neopixel RGB light on pin 23 accordingly

from machine import Pin
from neopixel import NeoPixel
pin = Pin(23, Pin.OUT)
leds = NeoPixel(pin, 1) # 1 .. how many LEDs

@app.post('/rgb')
async def set_rgb(request):
    print(request.json)
    leds[0] = (request.json['r'], request.json['g'], request.json['b'])
    leds.write()
    return 'OK'


@app.get('/')
async def index(request):
    return send_file('/public/index.html')

@app.route('/<path:path>')
async def static(request, path):
    import os
    try:
        os.stat('/public/' + path)
        return send_file('/public/' + path, max_age=86400)
    except OSError:
        return 'Not found', 404

print('Starting webserver')
try:
    app.run(port=80)
except KeyboardInterrupt:
    app.shutdown()  # prevents EADDRINUSE
    print('Server stopped')
