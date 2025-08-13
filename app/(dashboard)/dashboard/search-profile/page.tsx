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
  Save,
  X,
  Plus,
  HelpCircle
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function SearchProfilePage() {
  const [searchProfile, setSearchProfile] = useState({
    jobTitle: '',
    jobType: {
      fullTime: true,
      partTime: false,
      temporary: false,
      contract: false,
      internship: false
    },
    employement_type: ['FULL_TIME', 'Not Applicable'] as string[],
    workModel: {
      onsite: true,
      remote: true,
      hybrid: true
    },
    remote_work: ['Kein Homeoffice', 'null', 'Vollständig remote', 'Hybrid', 'Teilweise Homeoffice'] as string[],
    location: '',
    radius: '25km',
    experienceLevel: {
      intern: false,
      entryLevel: true,
      midLevel: true,
      seniorLevel: false,
      leadStaff: false,
      directorExecutive: false
    },
    requiredExperience: [0, 11],
    datePosted: '',
    minSalary: 0,
    selectedLocation: null as { lon: number; lat: number } | null
  });

  const handleSave = () => {
    console.log('Saving search profile:', searchProfile);
    // Show success message or handle API response
  };

  // Helper function to get employement_type array based on selected job types
  const getEmployementTypeArray = (jobType: any) => {
    const employementTypes: string[] = []
    
    if (jobType.fullTime) {
      employementTypes.push('FULL_TIME', 'Not Applicable')
    }
    if (jobType.partTime) {
      employementTypes.push('PART_TIME')
    }
    if (jobType.temporary) {
      employementTypes.push('TEMPORARY')
    }
    if (jobType.contract) {
      employementTypes.push('FREELANCE')
    }
    if (jobType.internship) {
      employementTypes.push('INTERN')
    }
    
    // If no options are selected, include all types
    if (employementTypes.length === 0) {
      employementTypes.push('FULL_TIME', 'PART_TIME', 'TEMPORARY', 'FREELANCE', 'INTERN', 'Not Applicable')
    }
    
    return employementTypes
  }

  // Helper function to get remote_work array based on selected work model
  const getRemoteWorkArray = (workModel: any) => {
    const remoteWorkTypes: string[] = []
    
    if (workModel.onsite) {
      remoteWorkTypes.push('Kein Homeoffice', 'null')
    }
    if (workModel.remote) {
      remoteWorkTypes.push('Vollständig remote')
    }
    if (workModel.hybrid) {
      remoteWorkTypes.push('Hybrid', 'Teilweise Homeoffice')
    }
    
    // If no options are selected, include all types
    if (remoteWorkTypes.length === 0) {
      remoteWorkTypes.push('Kein Homeoffice', 'null', 'Vollständig remote', 'Hybrid', 'Teilweise Homeoffice')
    }
    
    return remoteWorkTypes
  }

  const clearAll = (section: string) => {
    switch (section) {
      case 'experienceLevel':
        setSearchProfile(prev => ({
          ...prev,
          experienceLevel: {
            intern: false,
            entryLevel: false,
            midLevel: false,
            seniorLevel: false,
            leadStaff: false,
            directorExecutive: false
          }
        }));
        break;
      case 'datePosted':
        setSearchProfile(prev => ({ ...prev, datePosted: '' }));
        break;
      case 'minSalary':
        setSearchProfile(prev => ({ ...prev, minSalary: 0 }));
        break;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Suchprofil</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Target className="h-6 w-6 text-[#0F973D]" />
              <span>Dein Suchprofil – Jobsuche optimieren 🎯</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Hier kannst du deine Jobsuche-Präferenzen definieren. Alles safe und vertraulich! 🔒
            </p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={!searchProfile.jobTitle}
            className={`${
              !searchProfile.jobTitle 
                ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' 
                : 'bg-[#0F973D] hover:bg-[#0F973D]/90'
            }`}
          >
            <Save className="h-4 w-4 mr-2" />
            {!searchProfile.jobTitle ? 'Job Titel erforderlich' : 'Speichern'}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Job Title */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-[#0F973D]" />
              Job Titel
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Der Job Titel, nach dem du suchst
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="flex items-center gap-1">
                Job Titel <span className="text-red-500">*</span>
              </Label>
              <Input
                id="jobTitle"
                placeholder="Job Titel eingeben..."
                value={searchProfile.jobTitle}
                onChange={(e) => setSearchProfile(prev => ({ ...prev, jobTitle: e.target.value }))}
                className="focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
              />
              {!searchProfile.jobTitle && (
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-amber-600" />
                    <p className="text-sm text-amber-800">
                      ⚠️ Ein Job Titel muss eingegeben werden, um das Suchprofil zu speichern.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Job Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-[#0F973D]" />
              Job Type
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={searchProfile.jobType.fullTime}
                  onCheckedChange={(checked: boolean) => {
                    const newJobType = { ...searchProfile.jobType, fullTime: checked }
                    const newEmployementType = getEmployementTypeArray(newJobType)
                    setSearchProfile(prev => ({
                      ...prev,
                      jobType: newJobType,
                      employement_type: newEmployementType
                    }))
                  }}
                  className="data-[state=checked]:bg-[#0F973D]"
                />
                <Label>Vollzeit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={searchProfile.jobType.partTime}
                  onCheckedChange={(checked: boolean) => {
                    const newJobType = { ...searchProfile.jobType, partTime: checked }
                    const newEmployementType = getEmployementTypeArray(newJobType)
                    setSearchProfile(prev => ({
                      ...prev,
                      jobType: newJobType,
                      employement_type: newEmployementType
                    }))
                  }}
                  className="data-[state=checked]:bg-[#0F973D]"
                />
                <Label>Teilzeit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={searchProfile.jobType.temporary}
                  onCheckedChange={(checked: boolean) => {
                    const newJobType = { ...searchProfile.jobType, temporary: checked }
                    const newEmployementType = getEmployementTypeArray(newJobType)
                    setSearchProfile(prev => ({
                      ...prev,
                      jobType: newJobType,
                      employement_type: newEmployementType
                    }))
                  }}
                  className="data-[state=checked]:bg-[#0F973D]"
                />
                <Label>Befristet</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={searchProfile.jobType.contract}
                  onCheckedChange={(checked: boolean) => {
                    const newJobType = { ...searchProfile.jobType, contract: checked }
                    const newEmployementType = getEmployementTypeArray(newJobType)
                    setSearchProfile(prev => ({
                      ...prev,
                      jobType: newJobType,
                      employement_type: newEmployementType
                    }))
                  }}
                  className="data-[state=checked]:bg-[#0F973D]"
                />
                <Label>Vertrag</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={searchProfile.jobType.internship}
                  onCheckedChange={(checked: boolean) => {
                    const newJobType = { ...searchProfile.jobType, internship: checked }
                    const newEmployementType = getEmployementTypeArray(newJobType)
                    setSearchProfile(prev => ({
                      ...prev,
                      jobType: newJobType,
                      employement_type: newEmployementType
                    }))
                  }}
                  className="data-[state=checked]:bg-[#0F973D]"
                />
                <Label>Praktikum</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Model */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#0F973D]" />
              Arbeitsmodell
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={searchProfile.workModel.onsite}
                  onCheckedChange={(checked: boolean) => {
                    const newWorkModel = { ...searchProfile.workModel, onsite: checked }
                    const newRemoteWork = getRemoteWorkArray(newWorkModel)
                    setSearchProfile(prev => ({
                      ...prev,
                      workModel: newWorkModel,
                      remote_work: newRemoteWork
                    }))
                  }}
                  className="data-[state=checked]:bg-[#0F973D]"
                />
                <Label>Vor Ort</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={searchProfile.workModel.remote}
                  onCheckedChange={(checked: boolean) => {
                    const newWorkModel = { ...searchProfile.workModel, remote: checked }
                    const newRemoteWork = getRemoteWorkArray(newWorkModel)
                    setSearchProfile(prev => ({
                      ...prev,
                      workModel: newWorkModel,
                      remote_work: newRemoteWork
                    }))
                  }}
                  className="data-[state=checked]:bg-[#0F973D]"
                />
                <Label>Remote</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={searchProfile.workModel.hybrid}
                  onCheckedChange={(checked: boolean) => {
                    const newWorkModel = { ...searchProfile.workModel, hybrid: checked }
                    const newRemoteWork = getRemoteWorkArray(newWorkModel)
                    setSearchProfile(prev => ({
                      ...prev,
                      workModel: newWorkModel,
                      remote_work: newRemoteWork
                    }))
                  }}
                  className="data-[state=checked]:bg-[#0F973D]"
                />
                <Label>Hybrid</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#0F973D]" />
              Standort
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Standort</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={searchProfile.location}
                  onChange={(e) => setSearchProfile(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Standort eingeben..."
                  className="flex-1 focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
                />
                <Select value={searchProfile.radius} onValueChange={(value) => setSearchProfile(prev => ({ ...prev, radius: value }))}>
                  <SelectTrigger className="w-24 focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5km">5km</SelectItem>
                    <SelectItem value="10km">10km</SelectItem>
                    <SelectItem value="25km">25km</SelectItem>
                    <SelectItem value="50km">50km</SelectItem>
                    <SelectItem value="100km">100km</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experience Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[#0F973D]" />
              Erfahrungslevel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1">
                  Erfahrungslevel
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearAll('experienceLevel')}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                >
                  Alle löschen
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={searchProfile.experienceLevel.intern}
                    onCheckedChange={(checked: boolean) => 
                      setSearchProfile(prev => ({ 
                        ...prev, 
                        experienceLevel: { ...prev.experienceLevel, intern: checked } 
                      }))
                    }
                    className="data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D] focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                  />
                  <Label htmlFor="intern" className="flex items-center gap-1">
                    Praktikant/Neuer Absolvent
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={searchProfile.experienceLevel.entryLevel}
                    onCheckedChange={(checked: boolean) => 
                      setSearchProfile(prev => ({ 
                        ...prev, 
                        experienceLevel: { ...prev.experienceLevel, entryLevel: checked } 
                      }))
                    }
                    className="data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D] focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                  />
                  <Label htmlFor="entryLevel" className="flex items-center gap-1">
                    Einsteiger
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={searchProfile.experienceLevel.midLevel}
                    onCheckedChange={(checked: boolean) => 
                      setSearchProfile(prev => ({ 
                        ...prev, 
                        experienceLevel: { ...prev.experienceLevel, midLevel: checked } 
                      }))
                    }
                    className="data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D] focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                  />
                  <Label htmlFor="midLevel" className="flex items-center gap-1">
                    Mittleres Level
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={searchProfile.experienceLevel.seniorLevel}
                    onCheckedChange={(checked: boolean) => 
                      setSearchProfile(prev => ({ 
                        ...prev, 
                        experienceLevel: { ...prev.experienceLevel, seniorLevel: checked } 
                      }))
                    }
                    className="data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D] focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                  />
                  <Label htmlFor="seniorLevel" className="flex items-center gap-1">
                    Senior Level
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={searchProfile.experienceLevel.leadStaff}
                    onCheckedChange={(checked: boolean) => 
                      setSearchProfile(prev => ({ 
                        ...prev, 
                        experienceLevel: { ...prev.experienceLevel, leadStaff: checked } 
                      }))
                    }
                    className="data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D] focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                  />
                  <Label htmlFor="leadStaff" className="flex items-center gap-1">
                    Lead/Staff
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={searchProfile.experienceLevel.directorExecutive}
                    onCheckedChange={(checked: boolean) => 
                      setSearchProfile(prev => ({ 
                        ...prev, 
                        experienceLevel: { ...prev.experienceLevel, directorExecutive: checked } 
                      }))
                    }
                    className="data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D] focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                  />
                  <Label htmlFor="directorExecutive" className="flex items-center gap-1">
                    Direktor/Executive
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Posted */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#0F973D]" />
              Veröffentlichungsdatum
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <RadioGroup value={searchProfile.datePosted} onValueChange={(value) => setSearchProfile(prev => ({ ...prev, datePosted: value }))}>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="past24h" id="past24h" className="focus:ring-2 focus:ring-[#0F973D] data-[state=checked]:bg-[#0F973D]" />
                    <Label htmlFor="past24h">Letzte 24 Stunden</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="past3days" id="past3days" className="focus:ring-2 focus:ring-[#0F973D] data-[state=checked]:bg-[#0F973D]" />
                    <Label htmlFor="past3days">Letzte 3 Tage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pastWeek" id="pastWeek" className="focus:ring-2 focus:ring-[#0F973D] data-[state=checked]:bg-[#0F973D]" />
                    <Label htmlFor="pastWeek">Letzte Woche</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pastMonth" id="pastMonth" className="focus:ring-2 focus:ring-[#0F973D] data-[state=checked]:bg-[#0F973D]" />
                    <Label htmlFor="pastMonth">Letzter Monat</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Salary Range */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#0F973D]" />
              Gehaltsbereich
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Mindestgehalt (€)</Label>
              <Input
                type="number"
                placeholder="0"
                value={searchProfile.minSalary}
                onChange={(e) => setSearchProfile(prev => ({ ...prev, minSalary: parseInt(e.target.value) || 0 }))}
                className="focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 