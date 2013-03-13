#!/bin/sh
stty -F /dev/ttyUSB0 hupcl
socat -T3 - /dev/ttyATH0,raw,echo=0,b57600
