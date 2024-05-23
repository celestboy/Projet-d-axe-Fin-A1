from machine import Pin, PWM
import network   #import des fonction lier au wifi
import urequests	#import des fonction lier au requetes http
import utime	#import des fonction lier au temps
import ujson	#import des fonction lier aà la convertion en Json

wlan = network.WLAN(network.STA_IF) # met la raspi en mode client wifi
wlan.active(True) # active le mode client wifi

ssid = 'Rlaouiz'
password = 'ry7pfit7mprzv5t'
wlan.connect(ssid, password) # connecte la raspi au réseau
url = "http://192.168.177.64:3000/"

x = 10000
house = {"Gryffindor": [x, 0, 0], "Hufflepuff": [x, x, 0], "Slytherin": [0, x, 0], "Ravenclaw": [0, 0, 10000]}


red = PWM(Pin(17, mode=Pin.OUT))
green = PWM(Pin(18, mode=Pin.OUT))
blue = PWM(Pin(19, mode=Pin.OUT))


red.freq(1_000)
green.freq(1_000)
blue.freq(1_000)

red.duty_u16(0)
green.duty_u16(0)
blue.duty_u16(0)


while not wlan.isconnected():
    print("pas co")
    utime.sleep(1)
    pass

while(True):
    try:
        print("GET")
        r = urequests.get(url) # lance une requete sur l'url
        result = (r.json()["message"])
        print(result) # traite sa reponse en Json
        r.close() # ferme la demande
        utime.sleep(1)
        
        
        resultColors = house[result]
        


        red.duty_u16(resultColors[0])
        green.duty_u16(resultColors[1])
        blue.duty_u16(resultColors[2])


        
    except Exception as e:
        print(e)
    