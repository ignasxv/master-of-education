// #include <Arduino.h>

int globalCountTracker = 0;
boolean testMode = true;
#define BAUD_RATE 9600
#define efficientMode false


#define NUM_OF_BUTTONS  4
#define NUM_OF_POTMETERS 6

struct Button {
  boolean state = false;
  int currentState = 0;
  int lastState = 1;
  int pin;
  String label;

  Button() {}

  Button(int s, int p, String l) 
    : state(s), pin(p), label(l) {
      // Print the constructed values in the SerialMonitor during testMode
      if (testMode) {
        Serial.println(String(globalCountTracker) + ": Button created:");
        Serial.print("State: "); Serial.println(state);
        Serial.print("pin: "); Serial.println(pin);
        Serial.print("label: "); Serial.println(String(label) + "\n\n");
      }
  }
};

// Button instance
Button buttons[NUM_OF_BUTTONS]; 
int buttonsPins[NUM_OF_BUTTONS] = {4, 5, 6, 7}; 
String buttonLabels[NUM_OF_BUTTONS] = {"B1", "B2", "B3", "B4"};


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

int pontMeterPins[NUM_OF_POTMETERS] = {0, 3, 4, 1, 2, 5}; 
String pontMeterLabels[NUM_OF_POTMETERS] = {"X", "Y", "Z", "A", "B", "C"};



void resetTracker(){
  globalCountTracker = 0;
}

// The setup function
void setup() {
  pinMode(12, OUTPUT);
  Serial.begin(BAUD_RATE);

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
    buttons[i] = Button(0, buttonsPins[i], buttonLabels[i]);
    pinMode(buttonsPins[i],INPUT);
    
  }

}

boolean updateReadings(){

  // tracking whether there was changes to the readings during this function call
  boolean isChange = false;

  // Serial.println("Fx to update and keep track of reading changes");

  for(int i = 0; i < NUM_OF_POTMETERS; i++){

      // updating potentiometer
      PontMeter* pot = &pontMeters[i];
      pot->currentVal = round( analogRead(pot->pin) / 1024.0 * 50 );

      if( pot->previousVal != pot->currentVal  ){
        pot->previousVal = pot->currentVal;

        if(efficientMode) Serial.println( "{" + pot->label + ":" + String(pot->currentVal) + "}" );

        isChange = true;
      }

  }


  // Updating buttongs ( revisit: find ways to run this logic in the same loop with potentiometers )
  for(int i = 0; i < NUM_OF_BUTTONS; i++){

      // updating potentiometer
      Button* btn = &buttons[i];

      btn->currentState = digitalRead(btn->pin);

      if ( btn->currentState != btn->lastState && btn->currentState == 1 ) { 
        btn->state = !btn->state;

        if(efficientMode) Serial.println( "{" + btn->label + ":" + String(btn->state) + "}" );

        isChange = true;
      } 
      // delay(50);
      btn->lastState = btn->currentState;

  }

  return isChange;
}

void printReadings(){
  
   for(int i = 0; i < NUM_OF_POTMETERS ; i++){
    PontMeter* current  = &pontMeters[i];
    // Serial.println(current.pin);
    Serial.print( "{" + current->label + ":" + String( current->currentVal ) + "}");
    Serial.print(",");
   }

   for(int i = 0; i < NUM_OF_BUTTONS ; i++){
    Button* currentBtn  = &buttons[i];
    // Serial.println(current.pin);
    Serial.print( "{" + currentBtn->label + ":" + String( currentBtn->state ) + "}");
    if( i+1 < NUM_OF_BUTTONS ) 
      Serial.print(",");
    else 
      Serial.println();
   }


}



void loop() {  
  if(efficientMode){
    updateReadings();
  }
  else if ( updateReadings()) { 
    printReadings(); 
  }

  digitalWrite(12, buttons[2].state);
  // Serial.println(buttons[2].state);

  delay(200);
}
