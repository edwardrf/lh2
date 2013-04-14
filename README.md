#LH2, web interface for lamp array

## SSH commands
Reset Arduino over command line

    stty -F /dev/ttyUSB0 hupcl
    sleep 1
    stty -F /dev/ttyUSB0 -hupcl


Set serial port speed and mode to communicate with arduino

    stty -F /dev/ttyUSB0 cs8 57600 ignbrk -brkint -icrnl -imaxbel -opost -onlcr -isig -icanon -iexten -echo -echoe -echok -echoctl -echoke noflsh -ixon -crtscts

