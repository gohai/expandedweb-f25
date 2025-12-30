# Expanded Web
# NYUSH F25 - gohai

def do_connect():
    import network
    # AP_IF makes it set up its own access point
    ap = network.WLAN(network.AP_IF)
    ap.active(True)
    # make sure to change this to a unique name!
    ap.config(essid='Expanded Web')
    # we could also set the channel (1-13) here
    print('Starting WiFi access point...')
    ap_ip = ap.ipconfig('addr4')[0]
    print('Network config:', ap_ip)
    return ap_ip

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
