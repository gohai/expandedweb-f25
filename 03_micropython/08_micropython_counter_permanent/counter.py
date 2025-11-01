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


state = {
    'clicks': 0
}

import ujson
try:
    with open('counter.json', 'r') as f:
        state = ujson.load(f)
except Exception as e:
    pass

# since we don't want to write to the file every time
# someone clicks, this uses a timer to do it if at
# least 5 seconds have elapsed since the last click
from machine import Timer
timer = Timer(1)

@app.get('/clicks')
async def get_clicks(request):
    return state

@app.post('/click')
async def post_click(request):
    print('click from', request.client_addr[0])
    state['clicks'] += 1
    timer.init(mode=Timer.ONE_SHOT, period=5000, callback=save_state)
    return state

def save_state(t):
    # save to file
    try:
        with open('counter.json', 'w') as f:
            ujson.dump(state, f)
        print('saved state to file')
    except Exception as e:
        pass


@app.get('/')
async def index(request):
    return send_file('/public/index.html')

@app.route('/<path:path>')
async def static(request, path):
    if '..' in path:
        return 'Not found', 404
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

