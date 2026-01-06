#include <Servo.h>

Servo servo1;
Servo servo2;

void setup() {
  Serial.begin(57600);
  servo1.attach(9);
  servo2.attach(10);
}

void loop() {
  if (Serial.available() > 0) {
    String line = Serial.readStringUntil('\n');
    line.trim();  // get rid of unwanted characters
    // first value
    int end = line.indexOf(',');
    String field = (end != -1) ? line.substring(0, end) : line;
    if (field.length() > 0) {
      int value = field.toInt();
      if (value >= 0 && value <= 180) {
        servo1.write(value);  // moves the servo motor
      }
    }
    // second value
    if (end != -1) {
      int start = end+1;
      end = line.indexOf(',', start);
      field = (end != -1) ? line.substring(start, end) : line.substring(start);
      if (field.length() > 0) {
        int value = field.toInt();
        if (value >= 0 && value <= 180) {
          servo2.write(value);  // moves the servo motor
        }
      }
    }
  }
}
