int globalCountTracker = 0;
boolean testMode = true;


#define NUM_OF_BUTTONS  6
#define NUM_OF_POTMETERS 6

struct Button {
  int previousVal = 0;
  int currentVal = 0;
  int pin;
  String label;

  Button() {}

  Button(int pVal, int cVal, int p, String l) 
    : previousVal(pVal), currentVal(cVal), pin(p), label(l) {
      // Print the constructed values in the SerialMonitor during testMode
      if (testMode) {
        Serial.println(String(globalCountTracker) + ": Button created:");
        Serial.print("previousVal: "); Serial.println(previousVal);
        Serial.print("currentVal: "); Serial.println(currentVal);
        Serial.print("pin: "); Serial.println(pin);
        Serial.print("label: "); Serial.println(String(label) + "\n\n");
      }
  }
};

// Button instance
Button buttons[NUM_OF_BUTTONS]; 
int buttonsPins[NUM_OF_BUTTONS] = {1, 2, 3, 4, 5, 6}; 
String buttonLabels[NUM_OF_BUTTONS] = {"B1", "B2", "B3", "B4", "B5", "B6"};


// Pontementer object**
struct PontMeter {
  int previousVal = 0;
  int currentVal = 0;
  int pin;
  String label;

  PontMeter() {}

  PontMeter(int pVal, int cVal, int p, String l) 
    : previousVal(pVal), currentVal(cVal), pin(p), label(l) {

      // Print the constructed values in the SerialMonitor during testMode
      if(testMode){
      Serial.println( String(globalCountTracker) + ": PontMeter created:");
      Serial.print("previousVal: "); Serial.println(previousVal);
      Serial.print("currentVal: "); Serial.println(currentVal);
      Serial.print("pin: "); Serial.println(pin);
      Serial.print("label: "); Serial.println(String(label) + "\n\n");
      }
  }
};

// Pontmeter instance
PontMeter pontMeters[NUM_OF_POTMETERS];

int pontMeterPins[NUM_OF_POTMETERS] = {0, 1, 2, 3, 4, 5}; 
String pontMeterLabels[NUM_OF_POTMETERS] = {"X", "Y", "Z", "A", "B", "C"};


void resetTracker(){
  globalCountTracker = 0;
}

// The setup function
void setup() {
  Serial.begin(9600);

  // Initialize PotMeter array
  resetTracker();
  for (int i = 0; i < NUM_OF_POTMETERS ; i++) {
    globalCountTracker++; 
    pontMeters[i] = PontMeter(0, 0, pontMeterPins[i], pontMeterLabels[i]);
    
  }

  // Initialize Button array
  resetTracker();
  for (int i = 0; i < NUM_OF_BUTTONS ; i++) {
    globalCountTracker++;
    buttons[i] = Button(0, 0, buttonsPins[i], buttonLabels[i]);
    
  }

}

boolean updateReadings

void loop() {  
  delay(1000);
}
