#!/usr/bin/lua

require "header"
printHeader()

os.execute("stty -F /dev/ttyUSB0 hupcl");
os.execute("stty -F /dev/ttyUSB0 cs8 57600 ignbrk -brkint -icrnl -imaxbel -opost -onlcr -isig -icanon -iexten -echo -echoe -echok -echoctl -echoke noflsh -ixon -crtscts -hupcl");
os.execute("sleep 1")
os.execute("echo a > /dev/ttyUSB0");
os.execute("sleep 1")
os.execute("echo c > /dev/ttyUSB0");
os.execute("sleep 1")
os.execute("echo a > /dev/ttyUSB0");
