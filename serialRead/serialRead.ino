
int xAxis = 0; 

int prevX = 0;



void setup() {
  // initialize serial communications at 9600 bps:
  Serial.begin(9600); 
}

void loop() {
  // read the analog in value:
  xAxis = analogRead(A0);
  //yAxis = analogRead(A1);

  // If the previous value is the same as the new one, the do not send to save
  // communication link between the Arduino and the PC. 


  
  if (prevX != xAxis) {
    // print the results to the serial monitor:
    Serial.print("A"); // Print the letter A to signal the start of the input
    Serial.print(xAxis); // Send the sensor Value (this is an integer)
    Serial.print("B"); // Print the letter B to signal the end of an Input
    prevX = xAxis;
  // Change the previous sensor value
  }
 
  // wait 100 milliseconds before the next loop
  // for the analog-to-digital converter to settle
  // after the last reading. If you are sending too fast
  // there is also a tendency to flood the communication line.
  delay(200);                     
}
