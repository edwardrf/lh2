#!/bin/sh
while [ 1 ]; do
	socat -T10 pty,link=/dev/ttyS100,raw,echo=0,b57600,group=dialout,mode=0666,wait-slave tcp:lamp.local:9090    
done
