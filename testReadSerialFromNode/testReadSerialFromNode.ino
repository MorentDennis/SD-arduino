
int led = 7;
String inData;
void setup() {
  // put your setup code here, to run once:
 Serial.begin(9600);   // initialize serial communications
 pinMode(led, OUTPUT); 

}

void loop() {
  // put your main code here, to run repeatedly:

while(Serial.available()) {
     inData = Serial.readString();
        // Process message when new line character is received
      Serial.println(inData);
        
}




}
