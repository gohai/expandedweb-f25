import socket
import uasyncio as asyncio

# based on metachris/micropython-captiveportal
class DNSQuery:
    def __init__(self, data):
        self.data = data
        self.domain = ''
        tipo = (data[2] >> 3) & 15  # Opcode bits
        if tipo == 0:  # Standard query
            ini = 12
            lon = data[ini]
            while lon != 0:
                self.domain += data[ini + 1:ini + lon + 1].decode('utf-8') + '.'
                ini += lon + 1
                lon = data[ini]
        #print('DNSQuery domain: ' + self.domain)

    def response(self, ip):
        #print('DNSQuery response: {} ==> {}'.format(self.domain, ip))
        if self.domain:
            packet = self.data[:2] + b'\x81\x80'
            packet += self.data[4:6] + self.data[4:6] + b'\x00\x00\x00\x00'  # Questions and Answers Counts
            packet += self.data[12:]  # Original Domain Name Question
            packet += b'\xC0\x0C'  # Pointer to domain name
            packet += b'\x00\x01\x00\x01\x00\x00\x00\x3C\x00\x04'  # Response type, ttl and resource data length -> 4 bytes
            packet += bytes(map(int, ip.split('.')))  # 4 bytes of IP
        return packet

# based on metachris/micropython-captiveportal
async def run_dns_server(target = '192.168.4.1'):
    """ function to handle incoming dns requests """
    udps = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    udps.setblocking(False)
    udps.bind(('0.0.0.0', 53))

    while True:
        try:
            yield asyncio.core._io_queue.queue_read(udps)
            data, addr = udps.recvfrom(4096)
            #print('Incoming DNS request...')

            DNS = DNSQuery(data)
            udps.sendto(DNS.response(target), addr)

            #print('Replying: {:s} -> {:s}'.format(DNS.domain, target))

        except Exception as e:
            print("DNS server error:", e)
            await asyncio.sleep_ms(3000)

    udps.close()

def register_captive_routes(app):
    # Android / ChromeOS
    @app.route('/generate_204')
    async def android_204(request):
        return '', 302, {'Location': '/'}

    @app.route('/gen_204')
    async def android_gen_204(request):
        return '', 302, {'Location': '/'}

    # Apple
    # XXX: does this work with 302?
    @app.route('/hotspot-detect.html')
    async def apple_captive(request):
        print('Got GET request for /hotspot-detect.html')
        #html = '<!DOCTYPE html>'
        #html += '<html>'
        #html += '<head>'
        #html += '<meta http-equiv="refresh" content="0; URL=/" />'
        #html += '</head>'
        #html += '<body>Loading...</body>'
        #html += '</html>'
        #return html, { 'Content-Type': 'text/html' }
        return '', 302, {'Location': '/'}

    # Windows
    @app.route('/ncsi.txt')
    async def windows_ncsi(request):
        return 'Microsoft NCSI', 200

    # XXX: ignore favicon
    #@app.route('/favicon.ico')
    #async def favicon(request):
    #    return '', 204

    # XXX: do we need a catch-all?
    # redirect everything else
    #@app.route('/<path:path>')
    #async def catch_all(request, path):
    #    print('Redirecting ' + request.method + ' ' + request.path + ' to /')
    #    return '', 302, {'Location': '/'}
