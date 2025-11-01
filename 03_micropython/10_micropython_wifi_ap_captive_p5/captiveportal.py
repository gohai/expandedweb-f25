import socket
import uasyncio as asyncio

async def start_dns_server(ap_ip):
    # Very small DNS server that replies to ANY A-query with our AP IP.
    # This is the classic captive-portal trick.
    ip_bytes = bytes(int(x) for x in ap_ip.split('.'))

    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.setblocking(False)
    s.bind(('0.0.0.0', 53))
    print('DNS server listening on 53, forcing to', ap_ip)

    while True:
        try:
            data, addr = s.recvfrom(512)
        except OSError:
            await asyncio.sleep(0)
            continue

        if not data:
            await asyncio.sleep(0)
            continue

        # build DNS response
        dns_id = data[0:2]
        flags = b'\x81\x80'          # standard query response, no error
        qdcount = b'\x00\x01'
        ancount = b'\x00\x01'
        nscount = b'\x00\x00'
        arcount = b'\x00\x00'
        header = dns_id + flags + qdcount + ancount + nscount + arcount

        question = data[12:]

        # answer: name is pointer to question (0xc00c)
        answer = b'\xc0\x0c'         # pointer to offset 12
        answer += b'\x00\x01'        # type A
        answer += b'\x00\x01'        # class IN
        answer += b'\x00\x00\x00\x1e'  # TTL = 30s
        answer += b'\x00\x04'        # IPv4 length
        answer += ip_bytes

        resp = header + question + answer
        try:
            s.sendto(resp, addr)
        except OSError:
            pass

        await asyncio.sleep(0)

def register_captive_routes(app):
    # Android / ChromeOS
    @app.route('/generate_204')
    async def android_204(request):
        return '', 302, {'Location': '/'}

    @app.route('/gen_204')
    async def android_gen_204(request):
        return '', 302, {'Location': '/'}

    # Apple
    @app.route('/hotspot-detect.html')
    async def apple_captive(request):
        return '', 302, {'Location': '/'}

    # Windows
    @app.route('/ncsi.txt')
    async def windows_ncsi(request):
        return 'Microsoft NCSI', 200

    # ignore
    @app.route('/favicon.ico')
    async def favicon(request):
        return '', 204

    # redirect everything else
    @app.route('/<path:path>')
    async def catch_all(request, path):
        return '', 302, {'Location': '/'}
