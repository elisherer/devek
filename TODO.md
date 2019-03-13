## Color
* color picker; (with web colors)
https://codepen.io/amwill/pen/ZbdGeW/

## Image
* Base64, crop, resize

## List
* Add Commas, ticks,...


## Dev Joke of the day

## network

input: 192.168.0.1 / 20

Address:   192.168.0.1           11000000.10101000.00000000.00000001
Netmask:   255.255.240.0 = 20    11111111.11111111.11110000.00000000 // emphasis on this line
Wildcard:  0.0.15.255            00000000.00000000.00001111.11111111
=>
Network:   192.168.0.0/20        11000000.10101000.00000000.00000000 (Class C)
Broadcast: 192.168.15.255        11000000.10101000.00001111.11111111
HostMin:   192.168.0.1           11000000.10101000.00000000.00000001
HostMax:   192.168.15.254        11000000.10101000.00001111.11111110
Hosts/Net: 4094                  (Private Internet)