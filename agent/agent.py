import os

os.environ["SSL_CERT_FILE"] = ""
os.environ["REQUESTS_CA_BUNDLE"] = ""

import ssl
ssl._create_default_https_context = ssl._create_unverified_context

import psutil
import requests
import time
import socket

SERVER_URL = "https://tech-monitor-backend-t8kp.onrender.com/api/monitoring/update"

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

        response = requests.post(
            SERVER_URL,
            json=data,
            timeout=10,
            verify=False
        )

        print("Отправлено:", data)
        print("Статус:", response.status_code)

    except Exception as e:
        print("Ошибка:", e)

    time.sleep(10)