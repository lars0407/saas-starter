'use client';

import { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase, 
  Star,
  Building2,
  Globe,
  Calendar,
  Target,
  Settings,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

export default function SearchProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [searchProfile, setSearchProfile] = useState({
    dreamJobTitle: 'Senior Software Engineer',
    jobSearchActivity: 'Aktiv',
    workLocation: 'Hybrid',
    workTimePreference: 'Vollzeit',
    salaryExpectation: '65000',
    preferredIndustries: ['Software', 'Fintech', 'E-Commerce'],
    experienceLevel: 'Senior',
    remoteWorkPreference: true,
    relocationWillingness: false,
    travelPercentage: '10%',
    contractType: 'Festanstellung',
    startDate: 'Sofort',
    languages: ['Deutsch', 'Englisch'],
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker'],
    certifications: ['AWS Certified Developer', 'Scrum Master'],
    education: 'Bachelor Informatik',
    yearsOfExperience: '5-7 Jahre'
  });

  const handleSave = () => {
    // Hier würde die API-Integration erfolgen
    console.log('Saving search profile:', searchProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Suchprofil</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Jobsuche-Einstellungen und Präferenzen
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Abbrechen
              </Button>
              <Button onClick={handleSave} className="bg-[#0F973D] hover:bg-[#0F973D]/90">
                <Save className="h-4 w-4 mr-2" />
                Speichern
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-[#0F973D] hover:bg-[#0F973D]/90">
              <Settings className="h-4 w-4 mr-2" />
              Bearbeiten
            </Button>
          )}
        </div>
      </div>

             <div className="space-y-6">
         {/* Dream Job Section */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Star className="h-5 w-5 text-[#0F973D]" />
               Traumjob
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="dreamJobTitle">Gewünschte Jobposition</Label>
               {isEditing ? (
                 <Input
                   id="dreamJobTitle"
                   value={searchProfile.dreamJobTitle}
                   onChange={(e) => setSearchProfile(prev => ({ ...prev, dreamJobTitle: e.target.value }))}
                   placeholder="z.B. Senior Software Engineer"
                 />
               ) : (
                 <div className="p-3 bg-muted rounded-md">
                   {searchProfile.dreamJobTitle}
                 </div>
               )}
             </div>
           </CardContent>
         </Card>

         {/* Job Search Activity */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Search className="h-5 w-5 text-[#0F973D]" />
               Jobsuche-Aktivität
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="space-y-2">
               <Label>Suchintensität</Label>
               {isEditing ? (
                 <Select value={searchProfile.jobSearchActivity} onValueChange={(value) => setSearchProfile(prev => ({ ...prev, jobSearchActivity: value }))}>
                   <SelectTrigger>
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="Sehr aktiv">Sehr aktiv (5+ Bewerbungen/Woche)</SelectItem>
                     <SelectItem value="Aktiv">Aktiv (2-4 Bewerbungen/Woche)</SelectItem>
                     <SelectItem value="Moderat">Moderat (1-2 Bewerbungen/Woche)</SelectItem>
                     <SelectItem value="Passiv">Passiv (Gelegentlich)</SelectItem>
                   </SelectContent>
                 </Select>
               ) : (
                 <div className="p-3 bg-muted rounded-md">
                   {searchProfile.jobSearchActivity}
                 </div>
               )}
             </div>
           </CardContent>
         </Card>

         {/* Work Preferences */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Briefcase className="h-5 w-5 text-[#0F973D]" />
               Arbeitspräferenzen
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Arbeitszeit</Label>
                 {isEditing ? (
                   <Select value={searchProfile.workTimePreference} onValueChange={(value) => setSearchProfile(prev => ({ ...prev, workTimePreference: value }))}>
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="Vollzeit">Vollzeit</SelectItem>
                       <SelectItem value="Teilzeit">Teilzeit</SelectItem>
                       <SelectItem value="Flexibel">Flexibel</SelectItem>
                     </SelectContent>
                   </Select>
                 ) : (
                   <div className="p-3 bg-muted rounded-md">
                     {searchProfile.workTimePreference}
                   </div>
                 )}
               </div>

               <div className="space-y-2">
                 <Label>Vertragsart</Label>
                 {isEditing ? (
                   <Select value={searchProfile.contractType} onValueChange={(value) => setSearchProfile(prev => ({ ...prev, contractType: value }))}>
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="Festanstellung">Festanstellung</SelectItem>
                       <SelectItem value="Befristet">Befristet</SelectItem>
                       <SelectItem value="Freelance">Freelance</SelectItem>
                       <SelectItem value="Praktikum">Praktikum</SelectItem>
                     </SelectContent>
                   </Select>
                 ) : (
                   <div className="p-3 bg-muted rounded-md">
                     {searchProfile.contractType}
                   </div>
                 )}
               </div>
             </div>

             <div className="space-y-2">
               <Label>Remote-Arbeit</Label>
               <div className="flex items-center space-x-2">
                 <Switch
                   checked={searchProfile.remoteWorkPreference}
                   onCheckedChange={(checked) => setSearchProfile(prev => ({ ...prev, remoteWorkPreference: checked }))}
                   disabled={!isEditing}
                 />
                 <span className="text-sm text-muted-foreground">
                   {searchProfile.remoteWorkPreference ? 'Bevorzugt' : 'Nicht bevorzugt'}
                 </span>
               </div>
             </div>
           </CardContent>
         </Card>

         {/* Location Preferences */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <MapPin className="h-5 w-5 text-[#0F973D]" />
               Standort-Präferenzen
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="space-y-2">
               <Label>Arbeitsort</Label>
               {isEditing ? (
                 <Select value={searchProfile.workLocation} onValueChange={(value) => setSearchProfile(prev => ({ ...prev, workLocation: value }))}>
                   <SelectTrigger>
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="Vor Ort">Vor Ort</SelectItem>
                     <SelectItem value="Remote">Remote</SelectItem>
                     <SelectItem value="Hybrid">Hybrid</SelectItem>
                   </SelectContent>
                 </Select>
               ) : (
                 <div className="p-3 bg-muted rounded-md">
                   {searchProfile.workLocation}
                 </div>
               )}
             </div>

             <div className="space-y-2">
               <Label>Umzugswilligkeit</Label>
               <div className="flex items-center space-x-2">
                 <Switch
                   checked={searchProfile.relocationWillingness}
                   onCheckedChange={(checked) => setSearchProfile(prev => ({ ...prev, relocationWillingness: checked }))}
                   disabled={!isEditing}
                 />
                 <span className="text-sm text-muted-foreground">
                   {searchProfile.relocationWillingness ? 'Bereit zum Umzug' : 'Kein Umzug gewünscht'}
                 </span>
               </div>
             </div>

             <div className="space-y-2">
               <Label>Reisebereitschaft</Label>
               {isEditing ? (
                 <Select value={searchProfile.travelPercentage} onValueChange={(value) => setSearchProfile(prev => ({ ...prev, travelPercentage: value }))}>
                   <SelectTrigger>
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="0%">0% (Keine Reisen)</SelectItem>
                     <SelectItem value="10%">10% (Gelegentlich)</SelectItem>
                     <SelectItem value="25%">25% (Regelmäßig)</SelectItem>
                     <SelectItem value="50%">50% (Häufig)</SelectItem>
                     <SelectItem value="75%">75% (Sehr häufig)</SelectItem>
                   </SelectContent>
                 </Select>
               ) : (
                 <div className="p-3 bg-muted rounded-md">
                   {searchProfile.travelPercentage}
                 </div>
               )}
             </div>
           </CardContent>
         </Card>

         {/* Salary Expectations */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <DollarSign className="h-5 w-5 text-[#0F973D]" />
               Gehaltserwartungen
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="salaryExpectation">Jahresgehalt (€)</Label>
               {isEditing ? (
                 <Input
                   id="salaryExpectation"
                   type="number"
                   value={searchProfile.salaryExpectation}
                   onChange={(e) => setSearchProfile(prev => ({ ...prev, salaryExpectation: e.target.value }))}
                   placeholder="65000"
                 />
               ) : (
                 <div className="p-3 bg-muted rounded-md">
                   {searchProfile.salaryExpectation} €
                 </div>
               )}
             </div>
           </CardContent>
         </Card>

         {/* Experience & Skills */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Target className="h-5 w-5 text-[#0F973D]" />
               Erfahrung & Fähigkeiten
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Erfahrungslevel</Label>
                 {isEditing ? (
                   <Select value={searchProfile.experienceLevel} onValueChange={(value) => setSearchProfile(prev => ({ ...prev, experienceLevel: value }))}>
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="Junior">Junior (0-2 Jahre)</SelectItem>
                       <SelectItem value="Mid-Level">Mid-Level (3-5 Jahre)</SelectItem>
                       <SelectItem value="Senior">Senior (5+ Jahre)</SelectItem>
                       <SelectItem value="Lead">Lead (7+ Jahre)</SelectItem>
                     </SelectContent>
                   </Select>
                 ) : (
                   <div className="p-3 bg-muted rounded-md">
                     {searchProfile.experienceLevel}
                   </div>
                 )}
               </div>

               <div className="space-y-2">
                 <Label>Startdatum</Label>
                 {isEditing ? (
                   <Select value={searchProfile.startDate} onValueChange={(value) => setSearchProfile(prev => ({ ...prev, startDate: value }))}>
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="Sofort">Sofort</SelectItem>
                       <SelectItem value="In 1 Monat">In 1 Monat</SelectItem>
                       <SelectItem value="In 3 Monaten">In 3 Monaten</SelectItem>
                       <SelectItem value="Flexibel">Flexibel</SelectItem>
                     </SelectContent>
                   </Select>
                 ) : (
                   <div className="p-3 bg-muted rounded-md">
                     {searchProfile.startDate}
                   </div>
                 )}
               </div>
             </div>

             <div className="space-y-2">
               <Label>Fähigkeiten</Label>
               <div className="flex flex-wrap gap-2">
                 {searchProfile.skills.map((skill, index) => (
                   <Badge key={index} variant="secondary">
                     {skill}
                   </Badge>
                 ))}
               </div>
             </div>
           </CardContent>
         </Card>
       </div>

      
    </div>
  );
} 