# json-convertor
The app can convert json object by indicating which value has which type
To get the converted object you should put your object in input and click the "Convert" button
After that, you will see two blocks with objects. The first one is your current object, the second one is a converted object with exact types of values.

Types that you can discover:
array;
object; 
boolean; 
integer number; 
floating-point digit; 
zip (postal code); 
uuid (universal unique identifier);
phone number (both with +380 and without it but no more than 12 symbols);
date (in two formats MM/DD/YYYY or MM:DD:YYYY);
internet protocol address (should not include any spaces between numbers or you will get the undefined type);
url (uniform resource locator address);
email (email address);
text (more then 20 symbols);
title (less then 20 symbols);
word (a word);
everything else will be qualified as 'undefined';

if your object has incorrect form you will get the alert massage about that.