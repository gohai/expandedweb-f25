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
# from the website containing angle information,
# and sets a servo motor connected to pin 23 accordingly

from machine import Pin, PWM
class Servo:
    def __init__(self, pin, freq=50, us_min=544, us_max=2400, duty_bits=10):
        self.pwm = PWM(Pin(pin), freq=freq)
        self.us_min = us_min
        self.us_max = us_max
        self.duty_max = (1 << duty_bits) - 1  # 1023 for 10-bit
    
    def angle(self, degrees):
        degrees = max(0, min(180, degrees))
        us = self.us_min + (self.us_max - self.us_min) * degrees / 180
        duty = int(self.duty_max * (us / 20000.0))
        self.pwm.duty(duty)
    
    def deinit(self):
        self.pwm.deinit()

servo = Servo(pin=23)

@app.post('/servo')
async def set_servo(request):
    print(request.json)
    servo.angle(request.json['angle'])
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
