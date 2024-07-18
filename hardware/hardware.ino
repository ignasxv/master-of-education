struct Button{
  int previousVal = 0;
  int currentVal = 0;
};

struct Pont{
  int previousVal = 0;
  int currentVal = 0;
};

struct Readings{
  int currentVal = 0;
  int previousVal = 0;
};


//Struct instances
Button button;
Pont pont;
Readings readings;

void setup() {
  Serial.begin( 9600 );
  
}

void updateReadings() {
  if (pont.currentVal != pont.previousVal) {
    readings.currentVal = pont.currentVal;
    pont.previousVal = pont.currentVal;
  } else if (button.currentVal != button.previousVal) {
    readings.currentVal = button.currentVal;
    button.previousVal = button.currentVal;
  } else {
    // If neither pont nor button values have changed, keep the current reading value 
    readings.currentVal = readings.currentVal;
    
    
  }
  
  
}

void loop() {

       if( digitalRead(6) ) button.currentVal = 200;
  else if (digitalRead(4) ) button.currentVal = 300; 
  else if (digitalRead(8) ) button.currentVal = 400;
  else if (digitalRead(7) ) button.currentVal = 500;
  else if (digitalRead(5) ) button.currentVal = 600;

  pont.currentVal = round(analogRead(1) / 1024.00 * 100);

  updateReadings();
  
  if(readings.currentVal != readings.previousVal) {

    Serial.println(readings.currentVal);
    
    readings.previousVal = readings.currentVal;
    
  }
  
  delay(100);
  
}
