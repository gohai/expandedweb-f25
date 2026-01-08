#include <FastLED.h>

#define NUM_LEDS 60
#define DATA_PIN 3

CRGB leds[NUM_LEDS];
int next_led = 0;    // 0..NUM_LEDS-1
byte next_col = 0;   // 0..2
byte next_rgb[3];    // temporary storage for next color

void setup() {
  Serial.begin(115200);
  FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, NUM_LEDS);
  // comment out the next line if you are using external 5V (for full br.)
  FastLED.setBrightness(50);
  leds[0] = CRGB::Red;
  FastLED.show();
  delay(1000);
  leds[0] = CRGB::Black;
  FastLED.show();
}

void loop() {
  while (Serial.available()) {
    char in = Serial.read();
    if (in & 0x80) {
      // synchronization: now comes the first color of the first LED
      next_led = 0;
      next_col = 0;
    }
    if (next_led < NUM_LEDS) {
      next_rgb[next_col] = in << 1;
      next_col++;
      if (next_col == 3) {
        leds[next_led] = CRGB(next_rgb[0], next_rgb[1], next_rgb[2]);
        next_led++;
        next_col = 0;
      }
    }
    if (next_led == NUM_LEDS) {
      FastLED.show();
      next_led++;
    }
  }
}
