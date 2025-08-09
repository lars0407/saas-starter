import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  message: string;
  context?: {
    currentPage?: string;
    userData?: any;
    pageData?: any;
  };
  history?: ChatMessage[];
}

// System prompt für den Job-Jäger AI
const SYSTEM_PROMPT = `Du bist der Job-Jäger AI Assistent, ein freundlicher und hilfreicher KI-Assistent für die Jobsuche und Karriereentwicklung. 

Deine Hauptaufgaben sind:
- Hilfe bei der Jobsuche und Bewerbung
- Unterstützung bei Lebenslauf und Anschreiben
- Karriereberatung und -planung
- Antworten auf Fragen rund um Bewerbungsprozesse

Wichtige Regeln:
- Antworte immer auf Deutsch
- Sei freundlich, professionell und ermutigend
- Gib praktische und umsetzbare Ratschläge
- Verwende eine warme, aber professionelle Tonart
- Wenn du auf eine spezifische Seite oder Funktion verweist, erkläre diese kurz

Kontext über die Anwendung:
- Dies ist eine Job-Such-Plattform mit KI-gestützten Tools
- Benutzer können Lebensläufe und Anschreiben erstellen
- Es gibt Job-Such-Funktionen und Bewerbungsverfolgung
- Die Plattform unterstützt verschiedene Karriereziele

Antworte immer hilfreich und konstruktiv.`;

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { message, context, history } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Hier würdest du normalerweise eine echte KI-API aufrufen
    // Für jetzt erstellen wir eine einfache Antwort basierend auf dem Kontext
    
    let reply = generateContextualResponse(message, context, history);

    // Simuliere eine kleine Verzögerung für realistischeres Verhalten
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('AI Assistant API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateContextualResponse(
  message: string,
  context?: any,
  history?: ChatMessage[]
): string {
  const lowerMessage = message.toLowerCase();

  // Kontext-spezifische Antworten basierend auf der aktuellen Seite
  if (context?.currentPage) {
    switch (context.currentPage) {
      case '/dashboard/job-search':
        if (lowerMessage.includes('job') || lowerMessage.includes('stelle')) {
          return "Ich sehe, dass du auf der Job-Such-Seite bist! Ich kann dir dabei helfen, bessere Suchbegriffe zu finden, deine Bewerbungsunterlagen zu optimieren oder dir Tipps für die Jobsuche geben. Was genau möchtest du verbessern?";
        }
        break;
      
      case '/dashboard/resume-generate':
        if (lowerMessage.includes('lebenslauf') || lowerMessage.includes('cv')) {
          return "Perfekt! Du bist gerade dabei, deinen Lebenslauf zu erstellen. Ich kann dir dabei helfen, die richtigen Formulierungen zu finden, deine Erfahrungen besser zu präsentieren oder Tipps für ein ansprechendes Design geben. Was ist dein aktueller Fokus?";
        }
        break;
      
      case '/dashboard/coverletter-generate':
        if (lowerMessage.includes('anschreiben') || lowerMessage.includes('motivation')) {
          return "Ah, du arbeitest an deinem Anschreiben! Das ist ein wichtiger Teil der Bewerbung. Ich kann dir helfen, überzeugende Argumente zu finden, die richtige Struktur zu wählen oder deine Motivation authentisch zu formulieren. Woran arbeitest du gerade?";
        }
        break;
    }
  }

  // Allgemeine Antworten basierend auf Schlüsselwörtern
  if (lowerMessage.includes('hallo') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hallo! 👋 Schön, dass du da bist! Ich bin dein Job-Jäger AI Assistent und helfe dir gerne bei allen Fragen rund um Jobsuche, Bewerbung und Karriereentwicklung. Wie kann ich dir heute helfen?";
  }

  if (lowerMessage.includes('lebenslauf') || lowerMessage.includes('cv') || lowerMessage.includes('resume')) {
    return "Ein guter Lebenslauf ist das A und O einer erfolgreichen Bewerbung! 🎯 Hier sind meine Top-Tipps:\n\n• Verwende klare, aktionsorientierte Verben\n• Quantifiziere deine Erfolge mit Zahlen\n• Passe den Lebenslauf an die Stellenausschreibung an\n• Halte ihn auf maximal 2 Seiten\n• Verwende ein sauberes, professionelles Design\n\nMöchtest du, dass ich dir bei einem bestimmten Bereich helfe?";
  }

  if (lowerMessage.includes('anschreiben') || lowerMessage.includes('motivation') || lowerMessage.includes('cover letter')) {
    return "Das Anschreiben ist deine Chance, dich persönlich vorzustellen! 💼 Wichtige Punkte:\n\n• Erkläre, warum du für diese spezifische Stelle perfekt bist\n• Zeige deine Begeisterung für das Unternehmen\n• Erzähle eine relevante Geschichte aus deiner Erfahrung\n• Halte es auf maximal eine Seite\n• Persönliche Anrede verwenden\n\nSoll ich dir bei der Struktur oder Formulierung helfen?";
  }

  if (lowerMessage.includes('bewerbung') || lowerMessage.includes('application')) {
    return "Eine erfolgreiche Bewerbung besteht aus mehreren Teilen! 📋 Hier ist mein Überblick:\n\n• Ansprechender Lebenslauf\n• Persönliches Anschreiben\n• Portfolio/Arbeitsproben (falls relevant)\n• Vorbereitung auf das Vorstellungsgespräch\n\nWelchen Bereich möchtest du verbessern? Ich kann dir bei jedem Schritt helfen!";
  }

  if (lowerMessage.includes('vorstellungsgespräch') || lowerMessage.includes('interview')) {
    return "Vorstellungsgespräche können nervenaufreibend sein! 😊 Meine Tipps:\n\n• Recherchiere das Unternehmen gründlich\n• Bereite Antworten auf häufige Fragen vor\n• Übe deine Selbstpräsentation\n• Stelle selbst kluge Fragen\n• Sei authentisch und selbstbewusst\n\nMöchtest du, dass ich dir bei der Vorbereitung helfe?";
  }

  if (lowerMessage.includes('job') || lowerMessage.includes('stelle') || lowerMessage.includes('position')) {
    return "Die Jobsuche kann herausfordernd sein! 🔍 Hier sind meine Empfehlungen:\n\n• Definiere deine Prioritäten klar\n• Nutze verschiedene Jobbörsen\n• Vernetze dich auf LinkedIn\n• Lass dir Job-Alerts einrichten\n• Bewirb dich auch bei interessanten Unternehmen ohne offene Stellen\n\nWie kann ich dir bei deiner Jobsuche helfen?";
  }

  if (lowerMessage.includes('danke') || lowerMessage.includes('thanks')) {
    return "Gerne! 😊 Ich freue mich, wenn ich dir helfen konnte. Falls du weitere Fragen hast oder Unterstützung brauchst, bin ich immer für dich da. Viel Erfolg bei deiner Jobsuche!";
  }

  // Standard-Antwort für unbekannte Fragen
  return "Das ist eine interessante Frage! 🤔 Als Job-Jäger AI kann ich dir bei vielen Themen helfen:\n\n• Lebenslauf und Anschreiben optimieren\n• Bewerbungsstrategien entwickeln\n• Vorstellungsgespräche vorbereiten\n• Karriereplanung\n• Jobsuche-Tipps\n\nWas davon interessiert dich am meisten? Oder hast du eine andere Frage?";
} 