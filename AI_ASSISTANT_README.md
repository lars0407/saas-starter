# Job-Jäger AI Assistant

Ein intelligenter KI-Assistent für die Jobsuche und Karriereentwicklung, der als schwebender Avatar unten rechts auf der Seite erscheint.

## 🚀 Features

### ✅ Implementiert
- **Animierter Avatar**: Job-Jäger Character mit verschiedenen Stimmungen
- **Hover-Animation**: Avatar "schwebt" nach oben beim Hover
- **Chat-Fenster**: Vollständiges Chat-Interface mit modernem Design
- **Persistente Speicherung**: Chatverlauf wird im localStorage gespeichert
- **Kontext-Aware**: Kennt die aktuelle Seite und kann kontextuelle Antworten geben
- **Responsive Design**: Funktioniert auf Desktop und Mobile
- **Loading States**: Animierte Typing-Indikatoren
- **Error Handling**: Graceful Error-Behandlung

### 🎯 Technische Features
- **CSS Animationen**: Smooth Animationen mit Tailwind CSS
- **TypeScript**: Vollständig typisiert
- **Context API**: Globale Zustandsverwaltung
- **Custom Hooks**: Wiederverwendbare Logik
- **Modulare Architektur**: Leicht erweiterbar

## 📁 Dateistruktur

```
components/
├── ai-assistant.tsx              # Hauptkomponente
├── ai-assistant-context.tsx      # Context Provider
├── ai-assistant-with-context.tsx # Context-Wrapper
└── resume-generator-with-ai.tsx  # Beispiel-Integration

hooks/
└── use-ai-assistant.ts          # Custom Hook

app/api/
└── ai-assistant/
    └── route.ts                 # API-Endpoint
```

## 🛠️ Installation & Setup

### 1. Dependencies installieren
```bash
# Keine zusätzlichen Dependencies erforderlich - verwendet Tailwind CSS Animationen
```

### 2. Integration in Layout
Der AI Assistant ist bereits in das Dashboard-Layout integriert:

```tsx
// app/(dashboard)/dashboard/layout.tsx
import { AIAssistantProvider } from "@/components/ai-assistant-context"
import AIAssistantWithContext from "@/components/ai-assistant-with-context"

export default function DashboardLayout({ children }) {
  return (
    <AIAssistantProvider>
      <SidebarProvider>
        {/* ... existing content ... */}
      </SidebarProvider>
      <AIAssistantWithContext />
    </AIAssistantProvider>
  )
}
```

## 🎨 Verwendung

### Basis-Verwendung
```tsx
import AIAssistant from '@/components/ai-assistant';

function MyPage() {
  return (
    <div>
      <h1>Meine Seite</h1>
      <AIAssistant 
        context={{
          currentPage: '/my-page',
          userData: { name: 'Max' },
          pageData: { features: ['Feature 1', 'Feature 2'] }
        }}
      />
    </div>
  );
}
```

### Mit Context Provider
```tsx
import { useAIAssistantHook } from '@/hooks/use-ai-assistant';

function MyComponent() {
  const { updatePageData, updateUserData } = useAIAssistantHook();

  useEffect(() => {
    updatePageData({
      type: 'my-feature',
      data: { /* ... */ }
    });
  }, []);

  return <div>Meine Komponente</div>;
}
```

## 🔧 Konfiguration

### Avatar-Stimmungen
Der Avatar ändert automatisch seine Stimmung basierend auf der Konversation:

- `laechelnd` - Standard, freundlich
- `denkend` - Während der Benutzer schreibt
- Weitere Stimmungen verfügbar in `/public/images/characters/`

### API-Integration
Die aktuelle Implementierung verwendet eine einfache Regel-basierte Antwort-Generierung. Für echte KI-Integration:

1. **OpenAI Integration**:
```tsx
// In app/api/ai-assistant/route.ts
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: message }
    ],
  }),
});
```

2. **Xano Integration** (falls gewünscht):
```tsx
// Nutze die bestehende Xano-Integration
import { xano } from '@/lib/xano';

const response = await xano.post('/ai/chat', {
  message,
  context,
  history
});
```

## 🎯 Erweiterungen

### Neue Stimmungen hinzufügen
1. Neues Bild in `/public/images/characters/` hinzufügen
2. Stimmung in `ai-assistant.tsx` registrieren:

```tsx
const [currentMood, setCurrentMood] = useState('laechelnd');

// Neue Stimmung hinzufügen
if (someCondition) {
  setCurrentMood('neue-stimmung');
}
```

### Neue Kontext-Typen
```tsx
// In einer Komponente
const { updatePageData } = useAIAssistantHook();

updatePageData({
  type: 'job-search',
  filters: { location: 'Berlin', role: 'Developer' },
  results: 25
});
```

### Custom API-Endpoints
```tsx
// Neue API-Route erstellen
// app/api/ai-assistant/special/route.ts
export async function POST(request: NextRequest) {
  // Spezielle Logik für bestimmte Funktionen
}
```

## 🎨 Styling

### Custom Styling
```tsx
<AIAssistant 
  className="bottom-8 right-8" // Position anpassen
/>
```

### Theme-Anpassungen
Die Komponente verwendet Tailwind CSS und kann über CSS-Variablen angepasst werden:

```css
:root {
  --ai-assistant-primary: #3b82f6;
  --ai-assistant-secondary: #8b5cf6;
}
```

## 🔍 Debugging

### Context überprüfen
```tsx
const { context } = useAIAssistantHook();
console.log('AI Assistant Context:', context);
```

### Chat-Historie löschen
```tsx
localStorage.removeItem('ai-assistant-chat');
```

## 🚀 Performance

### Optimierungen
- **Lazy Loading**: Komponente wird nur bei Bedarf geladen
- **Memoization**: Context-Updates werden optimiert
- **Debouncing**: Input-Handler sind debounced
- **Efficient Re-renders**: Nur notwendige Updates

### Monitoring
```tsx
// Performance-Monitoring hinzufügen
useEffect(() => {
  const startTime = performance.now();
  return () => {
    const endTime = performance.now();
    console.log(`AI Assistant render time: ${endTime - startTime}ms`);
  };
}, []);
```

## 🤝 Beitragen

### Entwicklung
1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Implementiere deine Änderungen
4. Teste gründlich
5. Erstelle einen Pull Request

### Code-Standards
- TypeScript für alle neuen Dateien
- ESLint-Konfiguration befolgen
- JSDoc-Kommentare für öffentliche APIs
- Unit-Tests für kritische Funktionen

## 📝 Changelog

### v1.0.0 (Aktuell)
- ✅ Basis AI Assistant mit Chat-Funktionalität
- ✅ Context-Aware Antworten
- ✅ Persistente Chat-Historie
- ✅ Animierte UI mit CSS/Tailwind
- ✅ Responsive Design
- ✅ Integration in Dashboard-Layout

### Geplant
- 🔄 Echte KI-Integration (OpenAI/GPT)
- 🔄 Voice-Input/Output
- 🔄 Mehrsprachige Unterstützung
- 🔄 Erweiterte Kontext-Analyse
- 🔄 A/B-Testing für Antworten

## 📞 Support

Bei Fragen oder Problemen:
1. Überprüfe die Dokumentation
2. Schaue in die Issues
3. Erstelle ein neues Issue mit detaillierter Beschreibung

---

**Entwickelt für Job-Jäger** 🎯 