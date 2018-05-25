#include <LiquidCrystal.h>
int redPin= 12;
int bluePin = 11;
int greenPin = 10;
String gameState= "gameOver";

 LiquidCrystal lcd(8, 9, 7, 6, 5, 4);
void setup() {
 lcd.begin(2,16);
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  Serial.begin(9600);
}

void loop() {

/*setColor(0, 0, 255); // Red Color
  /*delay(1000);
  setColor(0, 255, 0); // Green Color
  delay(1000);
  setColor(0, 0, 255); // Blue Color
  delay(1000);
  setColor(255, 255, 255); // White Color
  delay(1000);
  setColor(170, 0, 255); // Purple Color
  delay(1000);*/
  
  //  Serial.println("ok" );
 while(Serial.available()){
    gameState = Serial.readString();
    Serial.println("ok" );
    }
if (gameState == "won"){
    lcd.setCursor(0, 0);
    lcd.print( "you won!!!" );
    setColor(0, 255, 0);
  }
else if (gameState == "playing"){
    lcd.setCursor(0, 0);
    lcd.print( "Playing" );
    
    setColor(140, 255, 0);
  }
else if (gameState == "gameOver"){
      lcd.setCursor(0, 0);
    lcd.print( "Game over" );
    setColor(255, 0, 0);
}
else{
    lcd.setCursor(0, 0);
    lcd.print( "server problems" );
    setColor(255,255,255);
  }
}

void setColor(int redValue, int greenValue, int blueValue) {
  analogWrite(redPin, redValue);
  analogWrite(greenPin, greenValue);
  analogWrite(bluePin, blueValue);
}
