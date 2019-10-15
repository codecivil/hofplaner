<?php
//include php scripts
$core = glob('../php/*.php');

foreach ( $core as $component )
{
	require_once($component);
}

$servername = $SESSION['servername'];
$dbname = $SESSION['dbname'];
$username = $SESSION['connuser'];
$password = $SESSION['connpwd'];
unset($SESSION);

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname) or die ("Connection failed.");
mysqli_set_charset($conn,"utf8");

//get all titles
$stmt_array = array();
$stmt_array['stmt'] = "SELECT * from hof2019 ORDER BY title";
$_database = execute_stmt($stmt_array,$conn,true)['result'];
$_titles = array_unique(execute_stmt($stmt_array,$conn)['result']['title']);
$conn->close();
?>
<html lang="de-DE">
	<head profile="http://gmpg.org/xfn/11">
		<meta charset="utf-8" />
		<meta http-equiv="Content-Script-Type" content="text/javascript"/>
		<meta name="language" content="de-DE" />
		<meta name="content-language" content="de-DE" />
		<meta http-equiv="imagetoolbar" content="no" />
		<link rel="stylesheet" type="text/css" media="screen, projection, print" href="/css/colors.css" />
		<link rel="stylesheet" type="text/css" media="screen, projection, print" href="/css/info.css" />
		<link rel="stylesheet" type="text/css" media="screen, projection, print" href="/css/main.css" />
		<script type="text/javascript" src="/js/main.js"></script>
	</head>
	<body>
		<div id="background"></div>
		<nav>
			<ul>
<!--				<li id="nav_info" onclick="toggle('info')">INFO</li> -->
				<li id="nav_planung" onclick="toggle('planung')">DIREKT ZUR FILMPLANUNG</li>
			</ul>
		</nav>
		<div id="info">
			<div class="_info title_wrapper"><div class="_info title">HOF<br />PLA<br />NER</div></div>
			<input type="checkbox" hidden id="cb_plan">
			<label for="cb_plan">
				<div class="_info p">
					<div class="closed"></div>
					<div class="expanded"></div>
					<div class="_info ptitle" >Plane Deine Filme</div>
					In drei Schritten sagst Du, was Du sehen willst und wann Du Zeit hast, und Du bekommst Info über mögliche
					Ticketkombinationen. Die vielversprechendste Abfragereihenfolge kann dann abgespielt werden.
				</div>
				<div class="clear"></div>
			</label>
			<div class="info_expanded">
				<div><span class="step">1</span> Wähle Deine Filme</div>
				<div><span class="step">2</span> Markiere ausverkaufte Vorstellungen</div>
				<div><span class="step">3</span> Wähle Deine Zeiten</div>
				<div><span class="step">4</span> Erfahre Deine Optionen</div>
				<div><span class="step">5</span> Starte den Bestellablauf: Bestelle die angezeigte Vorstellung oder gib Dein Smartphone dem Kartenverkäufer.
				Ist die Vorstellung verfügbar, klicke "ja", ansonsten "nein" und fahre mit der nächsten Vorstellung fort. Links oben siehst Du, wieviele
				Filme noch offen sind.
				</div>
				<div class="button yes" onclick="unhide('planung');">Ja, alles klar! Los geht's!</div>
			</div>
			<div class="_info title_wrapper"><div class="_info title">WE<br />DONT<br />TRACK</div></div>
			<input type="checkbox" hidden id="cb_track">
			<label for="cb_track">
				<div class="_info p">
					<div class="closed"></div>
					<div class="expanded"></div>
					<div class="_info ptitle" >Deine Privatsphäre</div>
					Die ist wichtig. Daher bleiben Deine Filmauswahlen, verfügbare Zeiten und generell alle Daten, die während der Benutzung anfallen, bei Dir.
				</div>
				<div class="clear"></div>
			</label>
			<div class="info_expanded">
				<div><span class="step">1</span> Die einzige Verbindung zum codecivil-Server besteht darin, diese Homepage herunterzuladen und dabei die 
				aktuelle Filmdatenbank abzufragen.</div>
				<div><span class="step">2</span> Jede weitere Verarbeitung der Daten geschieht ausschließlich auf Deinem Gerät. Du kannst also nach dem Laden der Homepage auch offline weiter arbeiten.</div>
				<div><span class="step">3</span> Wie schnell die Berechnungen sind, hängt dann natürlich von Deinem Smartphone oder Computer ab.
				Zum Teil sind umfangreiche Zwischenspeicher und viele Rechenoperationen nötig. Auf älteren Geräten kann es daher passieren, dass die
				Software nicht funktioniert.</div>
			</div>
			<div class="_info title_wrapper"><div class="_info title">UNDER<br />THE<br />HOOD</div></div>
			<input type="checkbox" hidden id="cb_hood">
			<label for="cb_hood">
				<div class="_info p">
					<div class="closed"></div>
					<div class="expanded"></div>
					<div class="_info ptitle" >Open Source</div>
					Der "Algorithmus" ist kein Geheimnis. Erfahre mehr über die Software oder lade sie frei herunter und verbessere sie.
				</div>
				<div class="clear"></div>
			</label>
			<div class="info_expanded">
				<div><span class="step">1</span> Das Programm berechnet zuerst alle Möglichkeiten, die gewünschten Filme zu den verfügbaren Zeiten ohne
				Überlapp zu verteilen.</div>
				<div><span class="step">2</span> Filme, deren sämtliche Vorstellungen außerhalb dieser Zeiten fallen, werden von vornherein ausgeschlossen und
				die Zeitpläne nur für die restlichen Filme berechnet.</div>
				<div><span class="step">3</span> Normalerweise weiß man nicht exakt im Vorhinein, welche Vorstellungen noch verfügbar sind. Um die Leute an
				der Kasse nicht zu sehr zu strapazieren, muss der "Algorithmus" so gebaut sein, dass angefragte Filme bei Verfügbarkeit auch sofort gekauft werden.</div>
				<div><span class="step">4</span> Mit dieser Einschränkung gibt es keinen Algorithmus, der einen möglichen Filmplan mit Sicherheit findet. Man
				kann aber mit einer geschickten Wahl der Abfragereihenfolge die Wahrscheinlichkeit dafür maximieren.</div>
				<div><span class="step">5</span> Hier werden die Vorstellungen, die in den meisten vorausberechneten Filmplänen vorkommen, zuerst abgefragt.
				Das lässt bei Verfügbarkeit den größten Spielraum für die nächste Abfrage und vermeidet unnötige Abfragen, wenn es keine Karten mehr gibt.</div>
				<div><span class="step">6</span> Sind 
				für einen Film alle Vorstellungen zu den verfügbaren Zeiten ausverkauft, so wird der Film aus der Bestellliste entfernt und die Pläne
				für die verbleibenden Filme neu berechnet.</div>
				<div><span class="step">7</span> Ob es tatsächlich der "beste" Algorithmus ist? Vielleicht findest Du ja einen besseren.</div>
				<div><span class="step">8</span> Alle Berechnungen laufen auf Deinem Gerät. Wie schnell Lösungen gefunden werden, hängt also von 
				Deinem Smartphone oder Computer ab.
				Zum Teil sind umfangreiche Zwischenspeicher und viele Rechenoperationen nötig. Auf älteren Geräten kann es daher passieren, dass die
				Software nicht funktioniert.</div>
			</div>
			<div class="_info title_wrapper"><div class="_info title">BY<br />CODE<br />CIVIL</div></div>
			<input type="checkbox" hidden id="cb_cc">
			<label for="cb_cc">
				<div class="_info p">
					<div class="closed"></div>
					<div class="expanded"></div>
					<div class="_info ptitle" >Mehr davon</div>
					Diese Seite wurde von codecivil zur Verfügung gestellt. Dies ist keine offizielle Seite der Hofer Filmtage.
				</div>
				<div class="clear"></div>
			</label>
			<div class="info_expanded"><em>codecivil</em> ist ein ICT-Dienstleister, der auf ressourcenschonende und Open-Source-Lösungen spezialisiert ist. Mehr findest Du auf der
			Homepage <a href="https://www2.codecivil.de">https://www2.codecivil.de</a>.</div>
			<div class="_info title_wrapper"><div class="_info title">DS<br />GV<br />O</div></div>
			<input type="checkbox" hidden id="cb_dsgvo">
			<label for="cb_dsgvo">
				<div class="_info p">
					<div class="closed"></div>
					<div class="expanded"></div>
					<div class="_info ptitle" >Impressum und Datenschutz</div>
					Adressen, Quellen, Privatsphäre etc.
				</div>
				<div class="clear"></div>
			</label>
			<div class="info_expanded">
				<div id="impressum_wrapper">
					<div id="impressum_title"><h1>Impressum</h1></div>
					<div id="impressum">
						Angaben gemäß § 5 TMG:<br>
						Dr. Marco Kühnel<br>
						codecivil Dr. Marco Kühnel ICT Services<br>
						Vechteweg 4<br>
						30539 Hannover<br>
						<br>
						Kontakt:<br>
						Telefon: 	+49 (0) 170 7507391<br>
						E-Mail: 	kuehnel@codecivil.de<br>
						<br>
						Umsatzsteuer-ID:<br>
						Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br>
						DE 296 659 690<br>
						Finanzamt Hannover-Mitte<br>
						<br>
						Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:<br>
						Dr. Marco Kühnel<br>
						Vechteweg 4<br>
						30539 Hannover <br>
						<br>
						Quellenangaben für die verwendeten Bilder, Grafiken und Schriftarten:<br>
						<br>
						SVG-Grafiken von<br>
						https://fontawesome.com/icons<br>
						chevron-circle-right-solid.svg, chevron-down-solid.svg, chevron-left-solid.svg, chevron-right-solid.svg, clipboard-list-solid.svg, redo-alt-solid.svg, ticket-alt-solid.svg 
						Lizenz: <a href="https://fontawesome.com/license">https://fontawesome.com/license</a><br>
						<br>
						Schriftart "Jellee" aus<br>
						https://fontlibrary.org/en/font/jellee-typeface<br>
						Autor: Alfredo Marco Pradil, Lizenz: SIL Open Font License<br>
					</div>
				</div>
				<div id="dsgvo_wrapper">
					<div id="dsgvo">
						<h1>Datenschutzerklärung</h1>
						<h2>1. Datenschutz auf einen Blick</h2>
						<h3>Allgemeine Hinweise</h3>
						<p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.</p>
						<h3>Datenerfassung auf unserer Website</h3>
						<p>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</p>
						<p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>
						<p>Wie erfassen wir Ihre Daten?</p>
						<p>Daten werden automatisch beim 
	Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem 
	technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des 
	Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald 
	Sie unsere Website betreten. Sie können diese Anwendung auch 
	herunterladen und offline benutzen. Bei der Offline-Nutzung erfolgt 
	keinerlei Datenerfassung.</p>
						<p>Wofür nutzen wir Ihre Daten?</p>
						<p>Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.</p>
						<p>Welche Rechte haben Sie bezüglich Ihrer Daten?</p>
						<p>Sie haben jederzeit das Recht unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung, Sperrung oder Löschung dieser Daten zu verlangen. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.</p>

						<h3>Analyse-Tools und Tools von Drittanbietern</h3>
						<p>Beim Besuch unserer Website kann Ihr Surf-Verhalten statistisch ausgewertet werden. Das geschieht mit sogenannten Analyseprogrammen. Die Analyse Ihres Surf-Verhaltens erfolgt in der Regel anonym; das Surf-Verhalten kann nicht zu Ihnen zurückverfolgt werden. Wir werten dabei nur die Server-Log-Dateien aus und sammeln darüber hinaus keine Daten. Sie können der Analyse Ihrer personenbezogenen Daten widersprechen. Über die Widerspruchsmöglichkeiten werden wir Sie in dieser Datenschutzerklärung informieren.</p>

						<h2>2. Allgemeine Hinweise und Pflichtinformationen</h2>
						<h3>Datenschutz</h3>
						<p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
						Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können. Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das geschieht.
						Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.</p>

						<h3>Hinweis zur verantwortlichen Stelle</h3>
						<p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
						<p>
						codecivil Dr. Marco Kühnel ICT Services<br />
						Vechteweg 4<br />
						30539 Hannover <br />
						e-Mail: kuehnel@codecivil.de</br >
						</p>
						<h3>Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
						<p>Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Dazu reicht eine formlose Mitteilung per E-Mail an uns. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.</p>
						<h3>Beschwerderecht bei der zuständigen Aufsichtsbehörde</h3>
						<p>Im Falle datenschutzrechtlicher Verstöße steht dem Betroffenen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu. Die Landesbeauftragte für den Datenschutz Niedersachsen erreichen Sie unter<br />
						<br />
						Barbara Thiel <br />
						Prinzenstraße 5<br />
						30159 Hannover<br />
						<br />
						Telefon: 05 11/120-45 00<br />
						Telefax: 05 11/120-45 99<br />
						<br />
						E-Mail: poststelle@lfd.niedersachsen.de<br />
						</p>

						<h3>Recht auf Datenübertragbarkeit</h3>
						<p>Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, maschinenlesbaren Format aushändigen zu lassen. Sofern Sie die direkte Übertragung der Daten an einen anderen Verantwortlichen verlangen, erfolgt dies nur, soweit es technisch machbar ist.</p>
						<h3>Auskunft, Sperrung, Löschung</h3>
						<p>Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden.</p>
						<h3>Widerspruch gegen Werbe-Mails</h3>
						<p>Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-E-Mails, vor.</p>

						<h2>3. Datenschutzanfragen</h2>
						<p>Für Anfragen bezüglich Ihrer bei uns gespeicherten Daten wenden Sie sich bitte an<br />
						<br />
						codecivil Dr. Marco Kühnel ICT Services<br />
						Vechteweg 4<br />
						30539 Hannover <br />
						e-Mail: kuehnel@codecivil.de</br >
						</p>

						<h2>4. Datenerfassung auf unserer Website</h2>
						<h3>Server-Log-Dateien</h3>
						<p>Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
						<ul>
							<li>Browsertyp und Browserversion</li>
						<li>verwendetes Betriebssystem</li>
						<li>Referrer URL</li>
						<li>Hostname des zugreifenden Rechners</li>
						<li>Uhrzeit der Serveranfrage</li>
						<li>gekürzte IP-Adresse; es werden nur die ersten beiden Oktetts gespeichert; diese lassen Rückschlüsse nur auf das verwendete Netz zu, nicht aber auf den einzelnen Nutzer.</li>
						</ul>
						Eine Zusammenführung dieser 
	Daten mit anderen Datenquellen wird nicht vorgenommen. Sie können diese 
	Seite auch offline nutzen. In diesem Fall werden keinerlei Daten 
	erhoben.
						Grundlage für die Datenverarbeitung ist Art. 6 Abs. 1 lit. f DSGVO, der die Verarbeitung von Daten zur Erfüllung eines Vertrags oder vorvertraglicher Maßnahmen gestattet.
						</p>


						<h2>5. Zukünftige Änderungen</h2>
						<p>Aufgrund der technischen Entwicklung im Internet und sich entwickelnder sozialer und rechtlicher Praktiken ist es gegebenenfalls nötig, diese Datenschutzhinweise anzupassen und zu ergänzen. Über Aktualisierungen informieren wir an dieser Stelle.</p>
					</div>
				</div>

			</div>
		</div>
		<div id="planung" hidden>
			<div id="choosemovies" class="section">
				<h1><div class="step">1</div> Welche Filme willst Du sehen?<span class="back" onclick="_back(this);">&nbsp;</span></h1>
				<form method="POST" id="formMovies" action="" onsubmit="getMovies(this.closest('form')); return false;">
					<?php foreach ( $_titles as $index=>$title ) {
						?>
						<input type="checkbox" hidden id="movie_<?php echo($index); ?>" value="<?php echo($title); ?>" name="movie[]">
						<label for="movie_<?php echo($index);?>"><?php echo($title); ?></label>
						<?php }
					?>
					<input id="submitMovies" type="submit" hidden>
					<label for="submitMovies"></label>
				</form>
			</div>
			<div id="marksoldout" class="section" hidden>
				<h1><span class="step">2</span> Willst Du ausverkaufte Vorstellungen markieren? <span class="back" onclick="_back(this);">&nbsp;</span></h1>
				<div class="button yes" onclick="generateFormSoldOut()">ja</div>
				<div class="button no" onclick="hide('formSoldOut'); unhide('choosetimes')">nein</div>
				<form id="formSoldOut" action="" onsubmit="markSoldOut(this); return false;"></form>
			</div>
			<div id="choosetimes" class="section" hidden>
				<h1><span class="step">3</span> Hast Du immer Zeit? <span class="back" onclick="_back(this);">&nbsp;</span></h1>
				<div class="button yes" onclick="hide('choosetimestable'); hide('labelSubmitTimes'); getAllTimes(document.getElementById('formTimes')); prepareStorage(getResults); return false;">ja</div>
				<div class="button no" onclick=" unhide('labelSubmitTimes'); unhide('choosetimestable');">nein</div>
				<form id="formTimes" action="" onsubmit="getTimes(this); prepareStorage(getResults); return false;"></form>
				<div id="choosetimestable" hidden>
					<table id="timestable">
						<?php
							$_date = array();
							$_start = $HOF['start'];
							while ( $_start < $HOF['end'] ) {
								$_date[] = clone $_start;
								$_start = $_start->modify('+1 day');
							}
							for ( $i = -1; $i < 24; $i++ ) {
								?>
								<tr>
								<?php if ( $i == -1 ) { ?>
									<th>&nbsp;</th>
								<?php } else { ?>
									<th onclick="toggleClass('hour<?php echo($i);?>')">
										<?php echo($i); ?> - <?php echo($i+1); ?>
									</th>
								<?php }
								$_now = new DateTime('now');
								foreach ( $_date as $day ) {
									$_day = clone $day;
									if ( $i == -1 ) {
										?>
										<th onclick="toggleClass('day<?php echo($day->format('U'));?>')"><?php echo($day->format('D, d.m.')); ?></th>
										<?php
									} else {
										?>
										<td>
											<input
												form="formTimes"
												id="slot_<?php echo($day->format('U').'_'.$i); ?>"
												type="checkbox"
												hidden
												<?php if ( $_now->format('U') < $_day->modify('+'.$i.' hours')->format('U') ) { ?>
													checked
												<?php } ?>
												value="[<?php echo($_day->format('U')); ?>,<?php echo($_day->modify('+1 hour')->format('U')); ?>]"
												name="times[]"
												class="day<?php echo($day->format('U'));?> hour<?php echo($i);?>"
											>
											<label for="slot_<?php echo($day->format('U').'_'.$i); ?>">&nbsp;</label>
										</td>
										<?php
									}
								}
								?>
								</tr>
								<?php
							}
						?>
					</table>
					<input form="formTimes" id="submitTimes" type="submit" hidden>
					<label for="submitTimes" id="labelSubmitTimes"></label>
				</div>
			</div>
			<div id="getresult_wrapper" class="section" hidden>
				<h1><span class="step">4</span> So viele Optionen hast Du <span class="back" onclick="_back(this);">&nbsp;</span></h1>				
				<div id="getresult"></div>
				<div>Klicke das Ticket, um die Ticketabfrage zu starten.</div>
				<form action="" onsubmit="prepareStorage(startOrder); return false;">
					<input id="submitOrder" type="submit" hidden disabled>
					<label for="submitOrder" id="labelSubmitOrder"></label>
				</form>
			</div>
			<div id="orderwindow"></div>
			<div hidden>
				<div id="database">
				<?php
					echo(json_encode($_database));
				?>
				</div>
				<div id="movieshidden">[]</div>
				<div id="soldouthidden">[]</div>
				<div id="unavailablehidden">[]</div>
				<div id="timeshidden">[]</div>
				<div id="resultshidden">[]</div>
				<div id="history">
					<div id="hist_movies" class="hist">
						<div id="tmp_movies">[]</div>
					</div>
					<div id="hist_soldout" class="hist">
						<div id="tmp_soldout">[]</div>
					</div>
					<div id="hist_unavailable" class="hist">
						<div id="tmp_unavailable">[]</div>
					</div>
					<div id="hist_available" class="hist">
						<div id="tmp_available">[]</div>
					</div>
					<div id="hist_times" class="hist">
						<div id="tmp_times">[]</div>
					</div>
					<div id="hist_results" class="hist">
						<div id="tmp_results">[]</div>
					</div>
					<div id="hist_pay" class="hist">
						<div id="tmp_pay">0</div>
					</div>
				</div>
			</div>
		</div>
	<script>
		adaptTouchiness();
	</script>
	</body>
</html>
