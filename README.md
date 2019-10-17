# hofplaner
Filmplaner für die Internationalen Hofer Filmtage (und andere Festivals)

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
) ENGINE=InnoDB AUTO_INCREMENT=383 DEFAULT CHARSET=utf8mb4;
```

## Konfiguration
### Festival
Der Zeitraum des Festivals ist in `php/hof_data.php` einzutragen.

### Mindestzeit zwischen Vorstellungen
Am Anfang von `js/main.js`wird diese Zeit in Sekunden definiert. Sie sollte übliche Vespätungen, Q&A-Sitzungen, die Gehzeit zwischen zwei Locations sowie einen Zeitpuffer, um sicheren Einlass und akzeptable Plätze zu bekommen, enthalten. Hier ist sie auf 30 Minuten gesetzt.

## In Planung
+ ausführlichere Datenbank und Auswahl von Sortierkriterien
+ Suchfunktion (?)
+ Prioritätensetzung bei der Filmauswahl
+ Internationalisierung (inkl. Huferisch)

