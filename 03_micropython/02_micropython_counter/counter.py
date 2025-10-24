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

from microdot import Microdot

# this defines and initializes a global variable
visitors = 0

app = Microdot()
@app.route('/')
async def index(request):
    # for being able to modify the global variable inside
    # the function we need to declare "global visitors" here
    global visitors
    visitors += 1
    return 'You\'re visitor number ' + str(visitors) + ' since this ESP32 got power'

print('Starting webserver')
app.run(port=80)
