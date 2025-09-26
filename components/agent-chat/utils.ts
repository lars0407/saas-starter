import { StepDetail } from './types';

// Function to parse application_data JSON string and extract job URLs
export const parseApplicationData = (applicationData: string): { jobUrls: string[]; additionalInfo: string } => {
  try {
    // The application_data might be a JSON fragment, so we need to handle it carefully
    let parsed;
    
    // First try to parse as complete JSON
    try {
      parsed = JSON.parse(applicationData);
    } catch {
      // If that fails, try to extract the data part from the fragment
      // Look for the data object in the string
      const dataMatch = applicationData.match(/"data":\s*{([^}]+(?:{[^}]*}[^}]*)*)}/);
      if (dataMatch) {
        const dataString = `{${dataMatch[0]}}`;
        parsed = JSON.parse(dataString);
      } else {
        // Try to parse as a JSON fragment by wrapping it
        parsed = JSON.parse(`{${applicationData}}`);
      }
    }
    
    if (parsed.data) {
      return {
        jobUrls: parsed.data.job_urls || [],
        additionalInfo: parsed.data.additional_information || ''
      };
    }
    return { jobUrls: [], additionalInfo: '' };
  } catch (error) {
    console.error('Error parsing application_data:', error);
    return { jobUrls: [], additionalInfo: '' };
  }
};

// Function to generate step details based on event type
export const generateStepDetails = (eventType: string, eventStatus: string): { stepCount: number; stepDetails: StepDetail[] } => {
  const baseSteps: StepDetail[] = [];
  let stepCount = 0;

  switch (eventType) {
    case 'job_imported':
    case 'Job importiert':
      stepCount = 4;
      baseSteps.push(
        {
          id: '1',
          description: 'Job-Informationen werden ausgelesen',
          status: 'completed'
        },
        {
          id: '2',
          description: 'Die Daten wurden erfolgreich strukturiert',
          status: 'completed'
        },
        {
          id: '3',
          description: 'Job erfolgreich in die Datenbank importiert',
          status: 'completed'
        },
        {
          id: '4',
          description: 'Job wurde dem Nutzer zugewiesen',
          status: 'completed'
        }
      );
      break;

    case 'autoapply_created':
    case 'Auto-Bewerbung erstellt':
      stepCount = 5;
      baseSteps.push(
        {
          id: '1',
          description: 'Job-URL wird gesucht und im Browser geöffnet',
          status: 'completed'
        },
        {
          id: '2',
          description: 'Profilinformationen werden geladen und für das Formular vorbereitet',
          status: 'completed'
        },
        {
          id: '3',
          description: 'Lebenslauf wird ausgewählt und in die Bewerbung eingefügt',
          status: 'completed'
        },
        {
          id: '4',
          description: 'Agent wird angewiesen, die Bewerbung vollständig einzureichen',
          status: 'completed'
        },
        {
          id: '5',
          description: 'Browser wird geladen und für die Übertragung der Daten genutzt',
          status: 'completed'
        }
      );
      break;

    case 'Application successful':
    case 'Bewerbung erfolgreich':
      // Zufällige Anzahl von Schritten zwischen 8-15
      const availableSteps = [
        'Job-Seite geöffnet und "Jetzt bewerben"-Button lokalisiert',
        'Bewerbungsformular geladen und analysiert',
        'Formularfelder identifiziert (Vorname, Nachname, E-Mail, Stadt, Telefon)',
        'Persönliche Daten automatisch ausgefüllt',
        'E-Mail-Adresse bestätigt und validiert',
        'Stadt aus Dropdown-Menü ausgewählt',
        'Telefonnummer mit Ländervorwahl eingegeben',
        'Lebenslauf hochgeladen und validiert',
        'Anschreiben generiert und hochgeladen',
        'Zusatzfelder im Formular erkannt und befüllt',
        'Checkbox für Datenschutzerklärung angeklickt',
        'Pflichtfelder auf Vollständigkeit überprüft',
        'Button „Weiter" geklickt',
        'Navigationsschritt im Bewerbungsprozess abgeschlossen',
        'Fehlermeldung abgefangen und korrigiert',
        'Dateiformat der Anhänge geprüft',
        'Eingetragene Daten gegen Profilinformationen abgeglichen',
        'Kalenderfeld mit Verfügbarkeit ausgefüllt',
        'Radiobutton für Arbeitsmodell (Vollzeit/Teilzeit) gewählt',
        'Standortpräferenz bestätigt',
        'Eingabeformular gescrollt und verdeckte Felder sichtbar gemacht',
        'Captcha erkannt und automatisch gelöst',
        'Session-Cookie gespeichert und wiederverwendet',
        'Sicherheitsabfrage beantwortet',
        'Eingetragene Telefonnummer auf Länge geprüft',
        'Eingetragene E-Mail gegen Regex validiert',
        'Feld für Gehaltsvorstellung ausgefüllt',
        'Mehrfachauswahl im Dropdown getroffen',
        'Datei-Upload abgeschlossen und Fortschrittsbalken überwacht',
        'Eingaben final gespeichert und Formular abgesendet',
        'Bestätigungsseite geladen und Status gelesen',
        'Eingereichte Bewerbung im Dashboard registriert',
        'Erfolgsmeldung identifiziert und dokumentiert'
      ];
      
      // Zufällige Anzahl zwischen 8-15 Schritten
      stepCount = Math.floor(Math.random() * 8) + 8; // 8-15 Schritte
      
      // Zufällige Schritte aus der Liste auswählen
      const shuffledSteps = [...availableSteps].sort(() => Math.random() - 0.5);
      const selectedSteps = shuffledSteps.slice(0, stepCount);
      
      selectedSteps.forEach((step, index) => {
        baseSteps.push({
          id: (index + 1).toString(),
          description: step,
          status: 'completed'
        });
      });
      break;

    case 'cover_letter_created':
    case 'cover letter created':
    case 'Anschreiben erstellt':
      stepCount = 4;
      baseSteps.push(
        {
          id: '1',
          description: 'Job-Beschreibung analysiert und Anforderungen extrahiert',
          status: 'completed'
        },
        {
          id: '2',
          description: 'Persönliche Daten und Erfahrungen verarbeitet',
          status: 'completed'
        },
        {
          id: '3',
          description: 'Anschreiben mit KI generiert und personalisiert',
          status: 'completed'
        },
        {
          id: '4',
          description: 'Anschreiben validiert und als PDF exportiert',
          status: 'completed'
        }
      );
      break;

    case 'resume_created':
    case 'resume created':
    case 'Lebenslauf erstellt':
      stepCount = 5;
      baseSteps.push(
        {
          id: '1',
          description: 'Job-Anforderungen und Schlüsselwörter analysiert',
          status: 'completed'
        },
        {
          id: '2',
          description: 'Bestehende Lebenslauf-Daten verarbeitet',
          status: 'completed'
        },
        {
          id: '3',
          description: 'Lebenslauf für Job optimiert und angepasst',
          status: 'completed'
        },
        {
          id: '4',
          description: 'ATS-kompatible Formatierung angewendet',
          status: 'completed'
        },
        {
          id: '5',
          description: 'Lebenslauf validiert und als PDF exportiert',
          status: 'completed'
        }
      );
      break;

    default:
      stepCount = 1;
      baseSteps.push({
        id: '1',
        description: 'Prozess abgeschlossen',
        status: eventStatus === 'done' ? 'completed' : 'pending'
      });
  }

  return { stepCount, stepDetails: baseSteps };
};

export const getEventDescriptionFromType = (eventType: string, eventStatus: string) => {
  const actionMap: { [key: string]: string } = {
    'job_imported': '📥 Job erfolgreich importiert',
    'resume_created': '📄 Lebenslauf erstellt',
    'coverletter_created': '✍️ Anschreiben erstellt',
    'cover_letter_created': '✍️ Anschreiben erstellt',
    'autoapply_created': '🤖 Auto-Bewerbung erstellt',
    'application_submitted': '🎯 Bewerbung eingereicht',
    'job_search': '🔍 Job-Suche durchgeführt',
    'document_generation': '📝 Dokument generiert'
  };
  
  const translatedAction = actionMap[eventType] || `✅ ${eventType.replace(/_/g, ' ')}`;
  const status = eventStatus === 'done' ? '✅ Fertig' : '⏳ Läuft...';
  
  let actionText = translatedAction;
  if (eventType === 'autoapply_created' && String(eventStatus).toLowerCase() === 'done') {
    actionText = `${translatedAction} — Beschreibung: Du kannst das Fenster schließen. In der Regel dauert es ca. 10 Minuten, kann aber auch bis zu 24 Stunden dauern. Wir informieren dich, wenn die Bewerbung eingereicht ist.`;
  }
  
  return {
    action: actionText,
    status: status
  };
};
