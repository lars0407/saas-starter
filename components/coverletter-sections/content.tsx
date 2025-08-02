'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';

interface ContentData {
  customContent: string;
}

interface ContentProps {
  data: ContentData;
  onChange: (data: ContentData) => void;
  isEditing: boolean;
}

export function Content({ data, onChange, isEditing }: ContentProps) {
  const [formData, setFormData] = useState<ContentData>(data);
  const [wordCount, setWordCount] = useState(0);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleInputChange = (field: keyof ContentData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  const updateWordCount = (content: string) => {
    // Remove HTML tags and count words
    const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = textContent.split(' ').filter(word => word.length > 0);
    setWordCount(words.length);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Inhalt - Anschreiben
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Erstelle oder bearbeite den Inhalt deines Anschreibens
        </p>
      </CardHeader>
             <CardContent className="space-y-4">
         {/* Simple TinyMCE Editor */}
           <div className="space-y-2">
             <Label className="text-sm font-medium">
               Anschreiben Editor ✨
             </Label>
             
             <div className="relative">
               <Editor
                 tinymceScriptSrc='/tinymce/tinymce.min.js'
                 licenseKey='gpl'
                 onInit={(_evt, editor) => {
                   editorRef.current = editor;
                   // Set content after initialization to avoid cursor position issues
                   setTimeout(() => {
                     if (formData.customContent) {
                       editor.setContent(formData.customContent);
                     }
                     updateWordCount(editor.getContent());
                   }, 50);
                 }}
                 onEditorChange={(content) => {
                   handleInputChange('customContent', content);
                   updateWordCount(content);
                 }}
                 initialValue=""
                 disabled={!isEditing}
                 init={{
                   height: 300,
                   menubar: false,
                   statusbar: false,
                   resize: false,
                   plugins: [],
                   toolbar: false,
                   content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; line-height:1.6; }',
                   branding: false,
                   promotion: false,
                   setup: function(editor) {
                     // Hide menubar completely and style the editor
                     editor.on('init', function() {
                       // Try multiple selectors to find the menubar
                       const selectors = ['.tox-menubar', '.tox .tox-menubar', '[role="menubar"]'];
                       selectors.forEach(selector => {
                         const menubar = editor.getContainer().querySelector(selector) as HTMLElement;
                         if (menubar) {
                           menubar.style.display = 'none';
                           menubar.style.visibility = 'hidden';
                           menubar.style.height = '0';
                           menubar.style.overflow = 'hidden';
                         }
                       });
                       
                       // Also try to hide any menubar in the document
                       document.querySelectorAll('.tox-menubar, [role="menubar"]').forEach((el: any) => {
                         if (el.closest('.tox-tinymce')) {
                           el.style.display = 'none';
                           el.style.visibility = 'hidden';
                           el.style.height = '0';
                           el.style.overflow = 'hidden';
                         }
                       });

                       // Style the editor container and all border elements
                       const editorContainer = editor.getContainer();
                       if (editorContainer) {
                         // Style the main container
                         editorContainer.style.borderColor = '#d1d5db';
                         editorContainer.style.borderRadius = '0.5rem';
                         editorContainer.style.transition = 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out';
                         
                         // Style ALL possible border elements within the editor
                         const allElements = editorContainer.querySelectorAll('*');
                         allElements.forEach((el: any) => {
                           if (el.style && (el.style.border || el.style.borderColor)) {
                             el.style.borderColor = '#d1d5db';
                             el.style.borderRadius = '0.5rem';
                             el.style.transition = 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out';
                           }
                         });
                         
                         // Also force override any existing border styles
                         const style = document.createElement('style');
                         style.textContent = `
                           .tox-tinymce, .tox-tinymce * {
                             border-color: #d1d5db !important;
                           }
                           
                           /* Target the specific div-relative container */
                           .div-relative {
                             border-color: #d1d5db !important;
                             outline-color: #d1d5db !important;
                           }
                           
                           .div-relative:after, .div-relative:before {
                             border-color: #d1d5db !important;
                           }
                         `;
                         editorContainer.appendChild(style);
                       }

                       // Add focus/blur event listeners
                       editor.on('focus', function() {
                         if (editorContainer) {
                           // Style main container
                           editorContainer.style.borderColor = '#22c55e';
                           editorContainer.style.boxShadow = '0 0 0 2px rgba(34, 197, 94, 0.2)';
                           
                           // Style ALL possible border elements within the editor
                           const allElements = editorContainer.querySelectorAll('*');
                           allElements.forEach((el: any) => {
                             if (el.style && (el.style.border || el.style.borderColor)) {
                               el.style.borderColor = '#22c55e';
                               el.style.boxShadow = '0 0 0 2px rgba(34, 197, 94, 0.2)';
                             }
                           });
                           
                           // Update the injected style
                           const existingStyle = editorContainer.querySelector('style');
                           if (existingStyle) {
                             existingStyle.textContent = `
                               .tox-tinymce, .tox-tinymce * {
                                 border-color: #22c55e !important;
                               }
                               
                               /* Target the specific div-relative container */
                               .div-relative {
                                 border-color: #22c55e !important;
                                 outline-color: #22c55e !important;
                               }
                               
                               .div-relative:after, .div-relative:before {
                                 border-color: #22c55e !important;
                               }
                             `;
                           }
                         }
                       });

                       editor.on('blur', function() {
                         if (editorContainer) {
                           // Style main container
                           editorContainer.style.borderColor = '#d1d5db';
                           editorContainer.style.boxShadow = 'none';
                           
                           // Style ALL possible border elements within the editor
                           const allElements = editorContainer.querySelectorAll('*');
                           allElements.forEach((el: any) => {
                             if (el.style && (el.style.border || el.style.borderColor)) {
                               el.style.borderColor = '#d1d5db';
                               el.style.boxShadow = 'none';
                             }
                           });
                           
                           // Update the injected style
                           const existingStyle = editorContainer.querySelector('style');
                           if (existingStyle) {
                             existingStyle.textContent = `
                               .tox-tinymce, .tox-tinymce * {
                                 border-color: #d1d5db !important;
                               }
                               
                               /* Target the specific div-relative container */
                               .div-relative {
                                 border-color: #d1d5db !important;
                                 outline-color: #d1d5db !important;
                               }
                               
                               .div-relative:after, .div-relative:before {
                                 border-color: #d1d5db !important;
                               }
                             `;
                           }
                         }
                       });
                     });
                   },
                   forced_root_block: 'p',
                   force_br_newlines: false,
                   force_p_newlines: true,
                   remove_linebreaks: false,
                   convert_newlines_to_brs: false,
                   remove_redundant_brs: false,
                   entity_encoding: 'raw',
                   element_format: 'html',
                   verify_html: false,
                   cleanup: false,
                   cleanup_on_startup: false,
                   valid_elements: 'p,br',
                   valid_children: '+body[p]',
                   extended_valid_elements: 'p,br',
                   invalid_elements: 'h1,h2,h3,h4,h5,h6,div,span,blockquote,pre,code,table,tr,td,th,tbody,thead,tfoot,img,hr,iframe,object,embed,script,style,form,input,textarea,button,select,option,label,fieldset,legend'
                 }}
               />
               
               {/* Word count display */}
               <div className="absolute bottom-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                 {wordCount} Wörter
               </div>
             </div>
             
             <div className="flex items-center justify-between text-xs text-muted-foreground">
               <p>
                 Einfacher Text-Editor für Ihr Anschreiben
               </p>
               <p>
                 {formData.customContent.replace(/<[^>]*>/g, '').length} Zeichen
               </p>
             </div>
           </div>
       </CardContent>
    </Card>
  );
} 