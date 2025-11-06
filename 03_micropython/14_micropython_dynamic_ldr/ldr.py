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


# the following function handles GET requests for
# /ldr and returns the latest analog value

from machine import ADC

ldr = ADC(1)

@app.get('/ldr')
async def get_ldr(request):
    val = ldr.read_u16()
    print(val)
    return { 'value': val }


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
