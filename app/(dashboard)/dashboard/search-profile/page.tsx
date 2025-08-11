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
    jobFunctions: ['Mechanical Engineer'] as string[],
    excludedTitles: [] as string[],
    jobType: {
      fullTime: true,
      contract: false,
      partTime: false,
      internship: false
    },
    workModel: {
      onsite: true,
      remote: true,
      hybrid: true
    },
    location: 'Within US',
    radius: '25mi',
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
    minSalary: 0
  });

  const handleSave = () => {
    console.log('Saving search profile:', searchProfile);
    // Show success message or handle API response
  };

  const addJobFunction = (jobFunction: string) => {
    if (jobFunction && !searchProfile.jobFunctions.includes(jobFunction)) {
      setSearchProfile(prev => ({ 
        ...prev, 
        jobFunctions: [...prev.jobFunctions, jobFunction] 
      }));
    }
  };

  const removeJobFunction = (jobFunctionToRemove: string) => {
    setSearchProfile(prev => ({
      ...prev,
      jobFunctions: prev.jobFunctions.filter(jobFunction => jobFunction !== jobFunctionToRemove)
    }));
  };

  const addExcludedTitle = (title: string) => {
    if (title && !searchProfile.excludedTitles.includes(title)) {
      setSearchProfile(prev => ({ 
        ...prev, 
        excludedTitles: [...prev.excludedTitles, title] 
      }));
    }
  };

  const removeExcludedTitle = (titleToRemove: string) => {
    setSearchProfile(prev => ({
      ...prev,
      excludedTitles: prev.excludedTitles.filter(title => title !== titleToRemove)
    }));
  };

  const clearAll = (section: string) => {
    switch (section) {
      case 'jobFunctions':
        setSearchProfile(prev => ({ ...prev, jobFunctions: [] }));
        break;
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
            disabled={searchProfile.jobFunctions.length === 0}
            className={`${
              searchProfile.jobFunctions.length === 0 
                ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' 
                : 'bg-[#0F973D] hover:bg-[#0F973D]/90'
            }`}
          >
            <Save className="h-4 w-4 mr-2" />
            {searchProfile.jobFunctions.length === 0 ? 'Job Function erforderlich' : 'Speichern'}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Job Function */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-[#0F973D]" />
              Job Function
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Wählen Sie aus der Dropdown-Liste für beste Ergebnisse
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="jobFunction" className="flex items-center gap-1">
                  Job Function <span className="text-red-500">*</span>
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearAll('jobFunctions')}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                >
                  Alle löschen
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="jobFunction"
                  placeholder="Job Function hinzufügen..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addJobFunction((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  className="focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = document.querySelector('input[id="jobFunction"]') as HTMLInputElement;
                    if (input && input.value) {
                      addJobFunction(input.value);
                      input.value = '';
                    }
                  }}
                  className="hover:bg-[#0F973D] hover:text-white hover:border-[#0F973D] focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Hinzufügen
                </Button>
              </div>
              {searchProfile.jobFunctions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {searchProfile.jobFunctions.map((jobFunction, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
                      {jobFunction}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeJobFunction(jobFunction)}
                        className="h-4 w-4 p-0 hover:bg-green-200"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
              {searchProfile.jobFunctions.length === 0 && (
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-amber-600" />
                    <p className="text-sm text-amber-800">
                      ⚠️ Mindestens eine Job Function muss ausgewählt sein, um das Suchprofil zu speichern.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Excluded Title */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-500" />
              Ausgeschlossene Titel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Ausgeschlossene Titel</Label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Titel hinzufügen..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addExcludedTitle((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  className="focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Titel hinzufügen..."]') as HTMLInputElement;
                    if (input && input.value) {
                      addExcludedTitle(input.value);
                      input.value = '';
                    }
                  }}
                  className="hover:bg-[#0F973D] hover:text-white hover:border-[#0F973D] focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Hinzufügen
                </Button>
              </div>
              {searchProfile.excludedTitles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {searchProfile.excludedTitles.map((title, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {title}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExcludedTitle(title)}
                        className="h-4 w-4 p-0 hover:bg-red-100"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
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
              <Label className="flex items-center gap-1">
                Job Type <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={searchProfile.jobType.fullTime}
                    onCheckedChange={(checked: boolean) => 
                      setSearchProfile(prev => ({ 
                        ...prev, 
                        jobType: { ...prev.jobType, fullTime: checked } 
                      }))
                    }
                    className="data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D] focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                  />
                  <Label htmlFor="fullTime">Vollzeit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={searchProfile.jobType.contract}
                    onCheckedChange={(checked: boolean) => 
                      setSearchProfile(prev => ({ 
                        ...prev, 
                        jobType: { ...prev.jobType, contract: checked } 
                      }))
                    }
                    className="data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D] focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                  />
                  <Label htmlFor="contract">Vertrag</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={searchProfile.jobType.partTime}
                    onCheckedChange={(checked: boolean) => 
                      setSearchProfile(prev => ({ 
                        ...prev, 
                        jobType: { ...prev.jobType, partTime: checked } 
                      }))
                    }
                    className="data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D] focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                  />
                  <Label htmlFor="partTime">Teilzeit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={searchProfile.jobType.internship}
                    onCheckedChange={(checked: boolean) => 
                      setSearchProfile(prev => ({ 
                        ...prev, 
                        jobType: { ...prev.jobType, internship: checked } 
                      }))
                    }
                    className="data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D] focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                  />
                  <Label htmlFor="internship">Praktikum</Label>
                </div>
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
              <Label className="flex items-center gap-1">
                Arbeitsmodell <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={searchProfile.workModel.onsite}
                    onCheckedChange={(checked: boolean) => 
                      setSearchProfile(prev => ({ 
                        ...prev, 
                        workModel: { ...prev.workModel, onsite: checked } 
                      }))
                    }
                    className="data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D] focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                  />
                  <Label htmlFor="onsite">Vor Ort</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={searchProfile.workModel.remote}
                    onCheckedChange={(checked: boolean) => 
                      setSearchProfile(prev => ({ 
                        ...prev, 
                        workModel: { ...prev.workModel, remote: checked } 
                      }))
                    }
                    className="data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D] focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                  />
                  <Label htmlFor="remote">Remote</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={searchProfile.workModel.hybrid}
                    onCheckedChange={(checked: boolean) => 
                      setSearchProfile(prev => ({ 
                        ...prev, 
                        workModel: { ...prev.workModel, hybrid: checked } 
                      }))
                    }
                    className="data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D] focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                  />
                  <Label htmlFor="hybrid">Hybrid</Label>
                </div>
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
                  <SelectTrigger className="w-24 focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]">
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
              <Button variant="outline" size="sm" className="mt-2 hover:bg-[#0F973D] hover:text-white hover:border-[#0F973D] focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2">
                <Plus className="h-4 w-4 mr-1" />
                Hinzufügen
              </Button>
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
                  Erfahrungslevel <span className="text-red-500">*</span>
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

        {/* Required Experience */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#0F973D]" />
              Benötigte Erfahrung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Benötigte Erfahrung {searchProfile.requiredExperience[0]}-{searchProfile.requiredExperience[1]} Jahre</Label>
              <div className="px-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#0F973D] h-2 rounded-full" 
                    style={{ 
                      width: `${(searchProfile.requiredExperience[1] / 20) * 100}%`,
                      marginLeft: `${(searchProfile.requiredExperience[0] / 20) * 100}%`
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2">
                  <Input
                    type="number"
                    value={searchProfile.requiredExperience[0]}
                    onChange={(e) => setSearchProfile(prev => ({ 
                      ...prev, 
                      requiredExperience: [parseInt(e.target.value) || 0, prev.requiredExperience[1]] 
                    }))}
                    className="w-20 text-center focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
                    min={0}
                    max={searchProfile.requiredExperience[1]}
                  />
                  <Input
                    type="number"
                    value={searchProfile.requiredExperience[1]}
                    onChange={(e) => setSearchProfile(prev => ({ 
                      ...prev, 
                      requiredExperience: [prev.requiredExperience[0], parseInt(e.target.value) || 0] 
                    }))}
                    className="w-20 text-center focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
                    min={searchProfile.requiredExperience[0]}
                    max={20}
                  />
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>0 Jahre</span>
                <span>20 Jahre</span>
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
              <div className="flex items-center justify-between">
                <Label>Veröffentlichungsdatum</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearAll('datePosted')}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                >
                  Alle löschen
                </Button>
              </div>
              <RadioGroup value={searchProfile.datePosted} onValueChange={(value) => setSearchProfile(prev => ({ ...prev, datePosted: value }))}>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="past24h" id="past24h" className="focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2 data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D]" />
                    <Label htmlFor="past24h">Letzte 24 Stunden</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="past3days" id="past3days" className="focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2 data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D]" />
                    <Label htmlFor="past3days">Letzte 3 Tage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pastWeek" id="pastWeek" className="focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2 data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D]" />
                    <Label htmlFor="pastWeek">Letzte Woche</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pastMonth" id="pastMonth" className="focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2 data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D]" />
                    <Label htmlFor="pastMonth">Letzter Monat</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Compensation & Sponsorship */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#0F973D]" />
              Vergütung & Sponsoring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Mindest-Jahresgehalt</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearAll('minSalary')}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                >
                  Alle löschen
                </Button>
              </div>
              <Input
                type="number"
                value={searchProfile.minSalary}
                onChange={(e) => setSearchProfile(prev => ({ ...prev, minSalary: parseInt(e.target.value) || 0 }))}
                placeholder="Mindest-Jahresgehalt €0k/Jahr"
                className="focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 