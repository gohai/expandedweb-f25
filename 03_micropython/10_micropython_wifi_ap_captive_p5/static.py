# Expanded Web
# NYUSH F25 - gohai
# The microcontroller must be registered with
# NYU Shanghai IoT for this example to work.

def do_connect():
    import network
    ap = network.WLAN(network.AP_IF)
    ap.active(True)
    # make sure to change this to a unique name!
    ap.config(essid='Expanded Web')
    print('Starting WiFi access point...')
    ap_ip = ap.ipconfig('addr4')[0]
    print('Network config:', ap_ip)
    return ap_ip

ap_ip = do_connect()

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
    import os
    try:
        os.stat('/public/' + path)
        return send_file('/public/' + path, max_age=86400)
    except OSError:
        # for the captive portal, redirect to / for files that don't exist
        return '', 302, {'Location': '/'}


# after all your own microdot routes, call this function
# which is needed for the captive portal to work

from captiveportal import start_dns_server, register_captive_routes
import uasyncio as asyncio

register_captive_routes(app)

async def main():
    print('Starting webserver')
    asyncio.create_task(start_dns_server(ap_ip))
    try:
        await app.start_server(host='0.0.0.0', port=80, debug=False)
    except KeyboardInterrupt:
        app.shutdown()  # prevents EADDRINUSE
        print('Server stopped')

asyncio.run(main())
