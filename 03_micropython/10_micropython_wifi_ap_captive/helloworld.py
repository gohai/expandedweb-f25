# Expanded Web
# NYUSH F25 - gohai

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

from microdot import Microdot

app = Microdot()

@app.route('/')
async def index(request):
    return 'Hello from ESP'


# after all your own microdot routes, call this function
# which is needed for the captive portal to work

from captiveportal import start_dns_server, register_captive_routes
import uasyncio as asyncio

register_captive_routes(app)

# different structure than before, since this needs to run
# the web server and the DNS server simultaneously

async def main():
    print('Starting webserver')
    asyncio.create_task(start_dns_server(ap_ip))
    try:
        await app.start_server(host='0.0.0.0', port=80, debug=False)
    except KeyboardInterrupt:
        app.shutdown()  # prevents EADDRINUSE
        print('Server stopped')

asyncio.run(main())
