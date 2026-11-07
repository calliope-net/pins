
> Diese Seite bei [https://calliope-net.github.io/pins/](https://calliope-net.github.io/pins/) öffnen

### Calliope Erweiterung für Pins: viele externe Module programmieren.

Die Erweiterung für den vorhandenen Menüpunkt *Pins* enthält Blöcke für viele externe Module gleichzeitig.
Durch Beschränkung auf Grundfunktionen bleibt die Anzahl der Blöcke übersichtlich.
> Für mehr Funktionen gibt es zu jedem Modul eine eigene Erweiterung.

## Als Erweiterung verwenden 

Dieses Repository kann als **Erweiterung** in MakeCode hinzugefügt werden.

* öffne Makecode in der App oder die Webseite [https://makecode.calliope.cc/](https://makecode.calliope.cc/)
* klicke auf **Neues Projekt** und gib deinem Projekt einen Namen
* wähle die zu deinem Calliope mini passende Hardware v1, v2 oder v3
* klicke auf **Erweiterungen**
* schreibe die folgende **Projekt-URL**:
* **calliope-net/pins**
* mit der Tastatur oben in das weiße Feld und klicke auf ENTER
* klicke auf das Rechteck **pins** (kann von der Tastatur verdeckt sein)
* jetzt sind unter dem Menüpunkt *Fortgeschritten - Pins* neue Einträge:

![](png/pins.png)

## Blöcke und Parameter

### Pins

#### ... mehr

#### ... Buffer

#### ... Funktionen

#### ... 4-Digit Displays

#### ... I²C

#### ... OLED Display

#### ... Tastaturen


→ Numeric Keypad: Tastatur, Ziffernblock → [en.wikipedia.org/wiki/Keypad](https://en.wikipedia.org/wiki/Keypad)
###### [SparkFun Qwiic Keypad - 12 Tasten](https://www.sparkfun.com/products/15290)
> Keypad speichert mehrere gedrückte Tasten, bei langsamer Abfrage geht nichts verloren.\
> Mit /INT kann ein Hardware Interrupt ausgelöst werden.

Block **RTC angeschlossen** : Boolean
* Gibt True zurück, wenn das Uhr Modul am I²C Bus erkannt wird.


Block **keypad_read** () : Byte
* Gibt 0 zurück wenn keine Taste gedrückt, sonst ASCII-Code der gedrückten Taste.

Taste|0|1|2|3|4|5|6|7|8|9|*|#
---|---|---|---|---|---|---|---|---|---|---|---|---
Code|48|49|50|51|52|53|54|55|56|57|42|35



#### ... Joystick

#### ... Spracherkennung

#### ... RTC Uhr
→ [de.wikipedia.org/wiki/Echtzeituhr](https://de.wikipedia.org/wiki/Echtzeituhr)\
→ [Grove - High Precision RTC (Real Time Clock PCF85063TP)](https://wiki.seeedstudio.com/Grove_High_Precision_RTC)  (I²C 0x51)

##### Uhr lesen

Block **Datum und Zeit einlesen**
* <ins>Muss am Anfang jeder Schleife aufgerufen werden.</ins>
* Liest 7 Byte in eine interne Variable (Buffer).

> <ins>Die folgenden Blöcke lesen nur die interne Variable, nicht die Uhr.</ins>

Block **`0 Sekunde` als Zahl** : Byte
* gibt `Auswahl` als Dezimalzahl zurück. Es gibt 7 Register 0..6:
  * `0` Sekunde `ss` 00..59
  * `1` Minute `mm` 00..59
  * `2` Stunde `HH` 00..23
  * `3` Tag `dd` 01..31
  * `4` Wochentag `ddd` So Mo Di Mi Do Fr Sa (00..06)
  * `5` Monat `MM` 01..12
  * `6` Jahr `yy` 00..99

Block **`Datum dd.MM.yy`** : String
* gibt `Auswahl` als Text (String) zurück:
  * Datum dd.MM.yy
  * Datum dd.MM.20yy
  * Datum dd.MM
  * Wochentag ddd (2 Zeichen So Mo ..)
  * Zeit HH:mm
  * Zeit HH:mm:ss
  * Zeit mm:ss
  * yyMMddHHmmss (12 Zeichen)

Block **zeige `Zeit Hmmss` binär in 25 LED Matrix**

* Zeigt in den 5 Spalten der LED Matrix Zeit oder Datum an.
* Von den leuchtenden roten LEDs die Binärzahlen addieren.

`Zeit Hmmss`

|0|1|2|3|4|Binärzahl
|---|---|---|---|---|---
|H| | | | |2^4=16
|H| |m| |s|2^3=8
|H|m|m|s|s|2^2=4
|H|m|m|s|s|2^1=2
|H|m|m|s|s|2^0=1

`Datum wdMyy` (Wochentag 0..6, Tag 0..31, Monat 1..12, Jahr Zehner 0_..9_, Jahr Einer _0.._9)

|0|1|2|3|4|Binärzahl
|---|---|---|---|---|---
| |d| | | |2^4=16
| |d|M|y|y|2^3=8
|w|d|M|y|y|2^2=4
|w|d|M|y|y|2^1=2
|w|d|M|y|y|2^0=1

Block **Buffer (7Byte) [s,m,H,d,w,M,y] im Format BCD** : Buffer

* Gibt die interne Variable (Buffer) zurück. 7 Byte Index=Register `0`..`6`.
* Jedes Byte ist BCD codiert (BCD: binär codierte Dezimalzahl).
* 4 Bit pro Ziffer, Bit `7654` Zehner, Bit `3210` Einer, Jahr 2-stellig
* Formel zum Umrechnen BCD → DEC:\
`(rtc_Buffer[register] >> 4) * 10 + (rtc_Buffer[register] & 0x0F)`

Block **oscillator stop** : Boolean
* Gibt True zurück, wenn die Uhr neu gestellt werden muss.
* Kann bedeuten, dass die Knopfzelle leer wird.

##### Uhr stellen

Block **Uhr stellen 1 Zeichencode** (ascii_code) : String
* Stellt die Uhr mit 5 ASCII Zeichen-Codes von Keypad oder Keyboard.
* erlaubte Codes: 42=* 48=0 49=1 50=2 51=3 52=4 53=5 54=6 55=7 56=8 57=9 35=# 13=ENTER
* Alle anderen Codes sind wirkungslos und geben nur den aktuellen String zurück.
* Muss 5 mal mit ASCII Code aufgerufen werden. Gibt den zusammengesetzten String zurück.\
  *1. Zeichen:* `*` alle Zeichen löschen, neue Eingabe beginnen\
  *2. Zeichen:* Register Nummer `0..6`\
  *3. und 4. Zeichen:* Zahl, die in das Register geschrieben wird. 2 Ziffern dezimal `00..59`\
  *5. Zeichen:* `#` speichern (ascii_code=35 oder ENTER=13)
* Wenn 5 Zeichen gültig sind, wird mit dem folgenden Block das Register geändert.


Block **Uhr stellen 5 Zeichen** (*000#)
* Schreibt ein Byte in das entsprechende Register.
* 00..59 wird in BCD konvertiert und im RTC-Modul gespeichert. 
* Beispiele:
  * `*120#` setzt Minute auf 20
  * `*401#` Montag
  * `*000#` Sekunde 0


##### RTC Register

Block **RTC angeschlossen** : Boolean
* Gibt True zurück, wenn das Uhr Modul am I²C Bus erkannt wird.

Block **read RTC Register** : Byte\
Block **write RTC Register** (byte)
* Liest oder schreibt ein bestimmtes Register.

Block **convert Byte** (byte, `BCD → DEC`)  : Byte
* Konvertiert ein Byte von → in:
  * BCD → DEC
  * BCD Zehner
  * BCD Einer
  * DEC → BCD

#### ... GPIO

#### ... Wattmeter

