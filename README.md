
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

#### Funktionen

#### 4-Digit Displays

#### I²C

#### OLED Display

#### Tastaturen

#### Joystick

#### Spracherkennung

#### ... RTC Uhr
→ RTC: real-time clock → [de.wikipedia.org/wiki/Echtzeituhr](https://de.wikipedia.org/wiki/Echtzeituhr)
###### [Grove - High Precision RTC (Real Time Clock)](https://wiki.seeedstudio.com/Grove_High_Precision_RTC)

Block **Datum und Zeit einlesen**
* <ins>Muss am Anfang jeder Schleife aufgerufen werden.</ins>
* Liest 7 Byte in Variable RTC_BUFFER.
* BCD codiert: 4 Bit pro Ziffer, Bit `7654` Zehner, Bit `3210` Einer, Jahr 2-stellig

> <ins>Die folgenden Blöcke lesen nur die Variable, nicht den I²C-Bus.</ins>



#### GPIO

#### Wattmeter





## Dieses Projekt bearbeiten ![Build status badge](https://github.com/calliope-net/pins/workflows/MakeCode/badge.svg)

Um dieses Repository in MakeCode zu bearbeiten.

* öffne [https://makecode.calliope.cc/](https://makecode.calliope.cc/)
* klicke auf **Importieren** und dann auf **Importiere URL**
* füge **https://github.com/calliope-net/pins** ein und klicke auf Importieren

## Blocks preview

This image shows the blocks code from the last commit in master.
This image may take a few minutes to refresh.

![A rendered view of the blocks](https://github.com/calliope-net/pins/raw/master/.github/makecode/blocks.png)

#### Metadaten (verwendet für Suche, Rendering)

* for PXT/calliopemini
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
