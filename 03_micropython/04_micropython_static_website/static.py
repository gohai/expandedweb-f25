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
    print('Network config:', wlan.ipconfig('addr4'))

do_connect()

from microdot import Microdot, send_file

app = Microdot()

# this code makes all files inside the public
# directory available via http

@app.get('/')
async def index(request):
    # special handling for the homepage
    return send_file('/public/index.html')

@app.route('/<path:path>')
async def static(request, path):
    if '..' in path:
        # directory traversal is not allowed
        return 'Not found', 404
    import os
    try:
        os.stat('/public/' + path)
        return send_file('/public/' + path, max_age=86400)
    except OSError:
        # this returns 404 if the file doesn't exist
        return 'Not found', 404

print('Starting webserver')
try:
    app.run(port=80)
except KeyboardInterrupt:
    app.shutdown()  # prevents EADDRINUSE
    print('Server stopped')
