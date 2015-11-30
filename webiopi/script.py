import webiopi

GPIO = webiopi.GPIO

Garage1 = 17
Garage2 = 27
Lights = 22

def setup():
    GPIO.setFunction(Garage1, GPIO.OUT)
    GPIO.setFunction(Garage2, GPIO.OUT)
    GPIO.setFunction(Lights, GPIO.OUT)

def loop():
    webiopi.sleep(1)
