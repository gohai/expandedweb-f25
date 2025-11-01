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


# same as 06_micropython_messages_ephemeral, except here
# we save and load the messages to a file so that they are
# permanent (even with the power goes out)

messages = []

# load from file
import ujson
try:
    with open('messages.json', 'r') as f:
        messages = ujson.load(f)
except Exception as e:
    messages = []


@app.get('/messages')
async def get_messages(request):
    return messages

@app.post('/message')
async def post_message(request):
    request.json['from'] = request.client_addr[0]
    print(request.json)
    if len(messages) > 15:
        messages.pop(0)
    messages.append(request.json)
    # save to file
    try:
        with open('messages.json', 'w') as f:
            ujson.dump(messages, f)
    except Exception as e:
        pass
    return messages


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

