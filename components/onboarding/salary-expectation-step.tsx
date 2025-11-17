import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Euro, TrendingUp } from "lucide-react"

interface SalaryExpectationStepProps {
  onComplete: (salary: string) => void
  isLoading?: boolean
}

export function SalaryExpectationStep({ onComplete, isLoading = false }: SalaryExpectationStepProps) {
  const [salaryType, setSalaryType] = useState<string>("")
  const [salaryAmount, setSalaryAmount] = useState<string>("")

  const handleContinue = () => {
    console.log('SalaryExpectationStep: handleContinue called with:', salaryType, salaryAmount)
    const salary = salaryType && salaryAmount ? `${salaryType}: ${salaryAmount}` : 'flexible: negotiable'
    onComplete(salary)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Was ist dein Gehaltswunsch?
        </h2>
        <p className="text-gray-600">
          Gib uns deine Gehaltsvorstellung an, damit wir dir passende Jobs zeigen können.
        </p>
      </div>

      <div className="space-y-4">
        {/* Salary Type Selection */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Gehaltsart
          </Label>
          <div className="grid gap-3">
            <Card 
              className={`cursor-pointer transition-all hover:shadow-md ${
                salaryType === 'yearly' ? 'ring-2 ring-[#0F973D] bg-green-50' : ''
              }`}
              onClick={() => setSalaryType('yearly')}
            >
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Jahresgehalt (Brutto)</span>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className={`cursor-pointer transition-all hover:shadow-md ${
                salaryType === 'monthly' ? 'ring-2 ring-[#0F973D] bg-blue-50' : ''
              }`}
              onClick={() => setSalaryType('monthly')}
            >
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <Euro className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Monatsgehalt (Brutto)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Salary Amount Input */}
        {salaryType && (
          <div>
            <Label htmlFor="salaryAmount" className="text-sm font-medium text-gray-700">
              {salaryType === 'yearly' ? 'Jahresgehalt' : 'Monatsgehalt'} in €
            </Label>
                         <Input
               id="salaryAmount"
               type="number"
               placeholder={salaryType === 'yearly' ? 'z.B. 45000' : 'z.B. 3500'}
               value={salaryAmount}
               onChange={(e) => setSalaryAmount(e.target.value)}
               className="mt-1 focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
             />
          </div>
        )}
        
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-1">💡 Pro-Tipp:</p>
          <p>Sei realistisch! Ein zu hohes Gehalt kann Jobs ausschließen, ein zu niedriges kann dich unter Wert verkaufen. Recherchiere vorher, was in deiner Branche üblich ist!</p>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button 
          onClick={handleContinue}
          disabled={isLoading}
          className="bg-[#0F973D] hover:bg-[#0D7A32] text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Wird gespeichert..." : "Weiter"}
        </Button>
      </div>
    </div>
  )
} 