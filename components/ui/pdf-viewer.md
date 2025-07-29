# PDF Viewer Component

A customizable PDF viewer component that displays PDF documents with configurable navigation controls and styling options.

## Features

- Display PDF documents from any URL
- Navigate to specific pages
- Toggle toolbar and navigation panel visibility
- Customize border appearance
- Configurable fallback messages for error states
- Exposes loading state and error information
- Works reliably in popups and dynamic contexts

## Usage

```tsx
import { PDFViewer } from "@/components/ui/pdf-viewer"

function MyComponent() {
  return (
    <PDFViewer
      pdfUrl="https://example.com/document.pdf"
      showToolbar={true}
      showNavigation={true}
      showBorder={true}
      onLoaded={(payload) => console.log("PDF loaded:", payload.url)}
      onError={(payload) => console.log("PDF error:", payload.url)}
      onPageChanged={(payload) => console.log("Page changed:", payload.page)}
    />
  )
}
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `pdfUrl` | `string` | - | The URL of the PDF file to display |
| `initialPage` | `number` | `1` | The page number to display when the PDF is first loaded |
| `showToolbar` | `boolean` | `true` | Controls whether the PDF viewer toolbar is displayed |
| `showNavigation` | `boolean` | `true` | Controls whether the PDF navigation panel is displayed |
| `showBorder` | `boolean` | `true` | Controls whether a border is displayed around the PDF viewer |
| `borderWidth` | `string` | `"1px"` | The width of the border |
| `borderColor` | `string` | `"#dddddd"` | The color of the border |
| `borderRadius` | `string` | `"4px"` | The radius of the corners |
| `fallbackMessage` | `string` | `"PDF konnte nicht geladen werden"` | The message to display when the PDF cannot be loaded |
| `downloadMessage` | `string` | `"PDF herunterladen"` | The text for the download link when the PDF cannot be displayed |
| `placeholderMessage` | `string` | `"Keine PDF URL angegeben"` | The message to display when no PDF URL is provided |
| `className` | `string` | - | Additional CSS classes |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `onLoaded` | `{ url: string }` | Triggered when the PDF is successfully loaded |
| `onError` | `{ url: string }` | Triggered when the PDF fails to load |
| `onPageChanged` | `{ page: number }` | Triggered when the page is changed |

## Exposed Actions

| Action | Args | Description |
|--------|------|-------------|
| `goToPage` | `pageNumber: number` | Navigate to a specific page in the PDF |

## Exposed Variables

| Variable | Type | Description |
|----------|------|-------------|
| `isLoaded` | `boolean` | Whether the PDF has been successfully loaded |
| `hasError` | `boolean` | Whether there was an error loading the PDF |
| `currentPage` | `number` | The current page being displayed |

## Examples

### Basic Usage
```tsx
<PDFViewer pdfUrl="https://example.com/document.pdf" />
```

### Custom Styling
```tsx
<PDFViewer
  pdfUrl="https://example.com/document.pdf"
  showBorder={true}
  borderWidth="2px"
  borderColor="#0F973D"
  borderRadius="8px"
  className="h-[600px]"
/>
```

### Without Toolbar
```tsx
<PDFViewer
  pdfUrl="https://example.com/document.pdf"
  showToolbar={false}
  showNavigation={false}
/>
```

### With Event Handlers
```tsx
<PDFViewer
  pdfUrl="https://example.com/document.pdf"
  onLoaded={(payload) => {
    console.log("PDF loaded successfully:", payload.url)
    // Update UI state
  }}
  onError={(payload) => {
    console.error("Failed to load PDF:", payload.url)
    // Show error message
  }}
  onPageChanged={(payload) => {
    console.log("User navigated to page:", payload.page)
    // Update page indicator
  }}
/>
```

## Demo

Visit `/pdf-viewer-demo` to see the component in action with interactive configuration options.

## Notes

- PDF display capabilities depend on the browser's built-in PDF viewer
- For best compatibility, ensure PDFs are properly formatted and accessible via HTTPS
- Some PDF viewer features may vary across different browsers
- Large PDF files may take longer to load
- The component works reliably in popups and dynamic contexts
- URL parameters are handled safely to prevent editor bugs 