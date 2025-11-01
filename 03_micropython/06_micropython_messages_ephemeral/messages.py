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


# array for messages
messages = []

@app.get('/messages')
async def get_messages(request):
    # this function is being called whenever the server
    # receives a HTTP GET request for /messages
    # - it returns all messages (in JSON format)
    # (microdot automatically makes it JSON for us)
    return messages

@app.post('/message')
async def post_message(request):
    # this function is being called whenever the server
    # receives a HTTP POST request for /message
    # - the data the client sent is in request.json
    # add the client ip address
    request.json['from'] = request.client_addr[0]
    print(request.json)
    # if we have more than (say) 15 messages, discard the oldest
    # one so that we don't run out of memory eventually
    if len(messages) > 15:
        messages.pop(0)
    # add data to array
    messages.append(request.json)
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

