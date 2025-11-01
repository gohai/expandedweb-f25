# Expanded Web
# NYUSH F25 - gohai
# The microcontroller must be registered with
# NYU Shanghai IoT for this example to work.

def do_connect():
    import network
    # AP_IF makes it set up its own access point
    wifi = network.WLAN(network.AP_IF)
    wifi.active(True)
    # make sure to change this to a unique name!
    wifi.config(essid='Expanded Web')
    # we could also set the channel (1-13) here
    print('Starting WiFi access point...')
    print('Network config:', wifi.ipconfig('addr4'))

do_connect()

from microdot import Microdot

app = Microdot()
@app.route('/')
async def index(request):
    return 'Hello from ESP'

print('Starting webserver')
try:
    app.run(port=80)
except KeyboardInterrupt:
    app.shutdown()  # prevents EADDRINUSE
    print('Server stopped')
