# hofplaner
Filmplaner für die Internationalen Hofer Filmtage (und andere Festivals) als Webseite

## Installation
Der Ordner `public` muss für den Webserver lesbar sein. Vorausgesetzt wird eine MySQL-Filmdatenbank mit einem leseberechtigten Datenbanknutzer. Die entsprechenden Daten sind in `php/conn_data.php` einzutragen.
Die Filmdatenbank ist sehr rudimentär und sollte eine Tabelle mit folgenden Daten zu den Vorstellungen enthalten:

```
CREATE TABLE `<tablename>` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unixtimestart` int(11) DEFAULT NULL,
  `unixtimeend` int(11) DEFAULT NULL,
  `identifier` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `extras` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```
Bei den Hofer Filmtagen wird die Filmnummer als `identifier` benutzt und das Kino als `extras`.

## Konfiguration
### Festival
Der Zeitraum des Festivals ist in `php/hof_data.php` einzutragen. Der Endtag ist der Tag *nach* dem Ende des Festivals.

### Mindestzeit zwischen Vorstellungen
Am Anfang von `js/main.js`wird diese Zeit in Sekunden definiert. Sie sollte übliche Vespätungen, Q&A-Sitzungen, die Gehzeit zwischen zwei Locations sowie einen Zeitpuffer, um sicheren Einlass und akzeptable Plätze zu bekommen, enthalten. Hier ist sie auf 30 Minuten gesetzt.

## Features
+ Prinzip "angefragt+verfügbar=gekauft" beim Algorithmus der Ticketabfrage erlaubt den Einsatz des Planers direkt am Ticketcontainer
+ plant 30 Minuten Mindestabstand zwischen Vorstellungen ein
+ erlaubt Import gekaufter Tickets in Kalender (sofern der Download funktioniert, s. Bugs)
+ erlaubt Import bestehender Termine von .ics-Dateien in die Auswahl der zeitlichen Verfügbarkeit

## In Planung
+ ausführlichere Datenbank und Auswahl von Sortierkriterien
+ Suchfunktion (?)
+ Prioritätensetzung bei der Filmauswahl
+ Internationalisierung (inkl. Huferisch)
+ App
+ flexiblerer Abstand zwischen Vorstellungen, z.B. konfigurierbar oder von den Kinos aufeinanderfolgender Vorstellungen abhängig...

## Bugs
+ Kurzfilmgruppenscreenings werden falsch behandelt, was zu Doppelbuchungen führen kann, wenn sowohl ein Langfilm als auch sein zugehöriger Kurzfilm bei der Filmauswahl gewählt wurden und der Kurzfilm Teil eines Gruppenscreenings ist.
+ Die Beginn- und Endzeiten bei Kurzfilmgruppenscreenings sind nur beim ersten Film richtig.
+ Der Download gebuchter Filme als .ics-File funktioniert bei einigen mobilen Browsern nicht: iPhones erlauben keinen Download von Textdateien und zumindest einige Versionen des Android Browsers scheinen nicht von einer lokalen Seite herunterzuladen. Der Workaround, über eine weitere Serveranfrage den Download zu generieren, würde das gegebene Datenschutzversprechen brechen. 
