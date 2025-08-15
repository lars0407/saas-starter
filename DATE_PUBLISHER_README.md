# Date Publisher - Datumsveröffentlichung

## Übersicht

Der Date Publisher ist eine Utility-Funktionalität, die es ermöglicht, Daten in vordefinierten Zeitintervallen zu veröffentlichen und zu verwalten. Die veröffentlichten Daten werden automatisch nach Ablauf der gewählten Zeit gelöscht.

## Zeitintervalle

- **1d (24 Stunden)**: Für kurzfristige Veröffentlichungen → **Datenbank: 1**
- **3d (3 Tage)**: Für mittelfristige Projekte → **Datenbank: 3**
- **7d (1 Woche)**: Für wöchentliche Aktivitäten → **Datenbank: 7**
- **30d (1 Monat)**: Für längerfristige Veröffentlichungen → **Datenbank: 30**

## Funktionalitäten

### Kernfunktionen

- **Automatische Zeitverwaltung**: Daten werden nach Ablauf der gewählten Zeit automatisch gelöscht
- **Mehrere Veröffentlichungen**: Unterstützung für mehrere gleichzeitige Veröffentlichungen
- **Lokale Speicherung**: Alle Daten werden im Browser gespeichert
- **Echtzeit-Updates**: Automatische Aktualisierung der verbleibenden Zeit
- **Metadaten-Unterstützung**: Zusätzliche Informationen können mit jedem Datum gespeichert werden

### Utility-Funktionen

- `publishDate(interval, options)`: Veröffentlicht ein neues Datum
- `getActivePublishedDates(interval?)`: Ruft aktive (nicht abgelaufene) Daten ab
- `isDateActive(publishedDate)`: Prüft, ob ein Datum noch aktiv ist
- `formatTimeRemaining(publishedDate)`: Formatiert die verbleibende Zeit
- `cleanupExpiredDates()`: Bereinigt abgelaufene Daten

## Verwendung

### Grundlegende Verwendung

```typescript
import { publishDate, getActivePublishedDates } from '@/lib/date-publisher';

// Datum für 24 Stunden veröffentlichen
const publishedDate = publishDate('1d', {
  metadata: {
    source: 'resume-generator',
    documentId: 123
  }
});

// Aktive Daten abrufen
const activeDates = getActivePublishedDates();
```

### React Hook

```typescript
import { useDatePublisher } from '@/hooks/use-date-publisher';

function MyComponent() {
  const { publishedDates, publishNewDate } = useDatePublisher({
    source: 'my-component',
    userId: 456
  });

  const handlePublish = async () => {
    const date = await publishNewDate('7d');
    console.log('Published:', date);
  };

  return (
    <div>
      <button onClick={handlePublish}>Für 1 Woche veröffentlichen</button>
      <p>Aktive Veröffentlichungen: {publishedDates.length}</p>
    </div>
  );
}
```

### React Component

```typescript
import { DatePublisher } from '@/components/date-publisher';

function MyPage() {
  return (
    <DatePublisher
      metadata={{
        source: 'my-page',
        userId: 789
      }}
      onDatePublished={(publishedDate) => {
        console.log('Date published:', publishedDate);
      }}
    />
  );
}
```

## Integration in den Resume Generator

Der Date Publisher ist in den Resume Generator integriert und ermöglicht es Benutzern, ihren Lebenslauf für verschiedene Zeiträume zu veröffentlichen:

1. **Nach dem Generieren des Lebenslaufs** können Benutzer ihn für verschiedene Zeiträume veröffentlichen
2. **Mehrere Veröffentlichungen** sind möglich (z.B. 24h für schnelle Bewerbungen, 1 Monat für längerfristige Projekte)
3. **Automatische Verwaltung** der Veröffentlichungszeiten
4. **Metadaten** werden mit jedem veröffentlichten Datum gespeichert

## Datenbankintegration

### Speicherung der numerischen Werte

Die veröffentlichten Daten werden sowohl lokal als auch in der Datenbank gespeichert:

- **Lokaler Speicher**: Für sofortige UI-Updates und Offline-Funktionalität
- **Datenbank**: Für persistente Speicherung und Backend-Integration

### Datenbankfelder

```sql
-- Beispiel für die Datenbankstruktur
CREATE TABLE document_publish_dates (
  id SERIAL PRIMARY KEY,
  document_id INTEGER NOT NULL,
  date_published INTEGER NOT NULL, -- 1, 3, 7 oder 30
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API-Endpunkte

- **POST** `/api:SiRHLF4Y/documents/publish-date` - Datum veröffentlichen
- **GET** `/api:SiRHLF4Y/documents/{id}/publish-date` - Veröffentlichtes Datum abrufen

### Beispiel-API-Aufruf

```typescript
// Datum für 3 Tage veröffentlichen
await savePublishedDate(documentId, 3, {
  source: 'resume-generator',
  userName: 'Max Mustermann'
});

// Veröffentlichtes Datum abrufen
const publishedDate = await getPublishedDate(documentId);
console.log('Published for:', publishedDate.date_published, 'days');
```

## Technische Details

### Speicherung

- **Lokaler Speicher**: Verwendet `localStorage` für die Datenspeicherung
- **Automatische Bereinigung**: Abgelaufene Daten werden automatisch entfernt
- **Browser-spezifisch**: Daten sind nur im aktuellen Browser verfügbar

### Performance

- **Echtzeit-Updates**: Aktualisierung alle 60 Sekunden
- **Effiziente Filterung**: Schnelle Abfrage nach Intervallen
- **Minimaler Speicherverbrauch**: Nur aktive Daten werden gespeichert

### Sicherheit

- **Lokale Daten**: Keine Übertragung an externe Server
- **Benutzerkontrolle**: Benutzer haben volle Kontrolle über ihre Daten
- **Automatische Bereinigung**: Keine Ansammlung veralteter Daten

## Demo

Eine Demo-Seite ist verfügbar unter `/date-publisher-demo` und zeigt alle Funktionen des Date Publishers.

## Anwendungsfälle

### Resume Generator
- **24 Stunden**: Schnelle Bewerbungen für kurzfristige Stellen
- **3 Tage**: Wochenend-Projekte oder kurze Bewerbungsfristen
- **1 Woche**: Wöchentliche Reviews oder kurze Projekte
- **1 Monat**: Längerfristige Projekte oder dauerhafte Freigaben

### Allgemeine Verwendung
- **Projektmanagement**: Zeitlich begrenzte Projektfreigaben
- **Dokumentenverwaltung**: Temporäre Dokumentenzugriffe
- **Feedback-Systeme**: Zeitlich begrenzte Feedback-Runden
- **Kollaboration**: Temporäre Zusammenarbeitszeiträume

## Zukünftige Erweiterungen

- **Server-Synchronisation**: Synchronisation zwischen verschiedenen Geräten
- **Benachrichtigungen**: E-Mail-Benachrichtigungen vor Ablauf
- **Erweiterte Metadaten**: Mehr Flexibilität bei der Datenspeicherung
- **API-Integration**: REST-API für externe Systeme
- **Analytics**: Statistiken und Nutzungsanalysen

## Fehlerbehebung

### Häufige Probleme

1. **Daten werden nicht gespeichert**: Prüfen Sie, ob localStorage verfügbar ist
2. **Zeit wird nicht aktualisiert**: Stellen Sie sicher, dass die Komponente gemountet ist
3. **Abgelaufene Daten werden nicht gelöscht**: Führen Sie `cleanupExpiredDates()` manuell aus

### Debugging

```typescript
// Alle gespeicherten Daten anzeigen
console.log('All dates:', getPublishedDates());

// Abgelaufene Daten bereinigen
cleanupExpiredDates();

// Speicherstatus prüfen
console.log('localStorage:', localStorage.getItem('publishedDates'));
```

## Lizenz

Dieser Code ist Teil des SaaS Starter Projekts und unterliegt den gleichen Lizenzbedingungen.
