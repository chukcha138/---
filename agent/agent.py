import psutil
import requests
import time
import socket

SERVER_URL = "https://autopilot-probing-anemic.ngrok-free.dev/api/monitoring/update"

DEVICE_IP = socket.gethostbyname(
    socket.gethostname()
)

def get_data():
    cpu = psutil.cpu_percent(interval=1)
    ram = psutil.virtual_memory().percent
    disk = psutil.disk_usage('/').percent

    net = psutil.net_io_counters()
    network = net.bytes_sent + net.bytes_recv

    return {
        "ip": DEVICE_IP,
        "cpu": cpu,
        "ram": ram,
        "disk": disk,
        "network": network
    }

while True:
    try:
        data = get_data()

        requests.post(
            SERVER_URL,
            json=data
        )

        print("Отправлено:", data)

    except Exception as e:
        print("Ошибка:", e)

    time.sleep(10)