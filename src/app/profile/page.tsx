"use client";

import { AppHeader } from '@/components/header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Banknote, Calendar, Landmark, CandlestickChart, CreditCard, PiggyBank, Target, Scale, ClipboardList, GanttChart } from "lucide-react";

const profileSections = [
  { id: "income", title: "Income", icon: Banknote, fields: ["Total Monthly Earnings", "Pay Frequency (e.g., Bi-weekly)", "Other Monthly Income"] },
  { id: "expenses", title: "Monthly Expenses", icon: ClipboardList, fields: ["Housing", "Transportation", "Food & Groceries", "Utilities", "Other"] },
  { id: "debt", title: "Debt Obligations", icon: CreditCard, fields: ["Total Credit Card Debt", "Total Loan Debt (Student, Auto)", "Monthly Debt Payments"] },
  { id: "credit", title: "Credit Profile", icon: GanttChart, fields: ["Credit Score", "Credit Utilization (%)", "Payment History (e.g., Excellent)"] },
  { id: "savings", title: "Savings", icon: PiggyBank, fields: ["Emergency Fund Size", "Total Liquid Savings", "Monthly Savings Rate"] },
  { id: "investments", title: "Investment Portfolio", icon: CandlestickChart, fields: ["Total Investments Value", "Primary Investment Timeline (e.g., 10+ years)", "Asset Allocation (e.g., 80% Stocks)"] },
  { id: "goals", title: "Financial Goals", icon: Target, fields: ["Short-term Goal (e.g., Vacation)", "Long-term Goal (e.g., Retirement)"] },
  { id: "timing", title: "Purchase Timing", icon: Calendar, fields: ["Current Financial Situation (e.g., Stable)", "Upcoming Large Expenses"] },
  { id: "risk", title: "Risk Tolerance & Preferences", icon: Scale, fields: ["Investment Risk Tolerance (e.g., Medium)", "General Spending Habit (e.g., Frugal)"] },
];

export default function ProfilePage() {
  const { toast } = useToast();

  const handleCalculate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toast({
      title: "Feature in Development",
      description: "Financial health calculation is coming soon!",
    });
  };

  const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    form.reset();
    toast({
      title: "Form Reset",
      description: "Your financial profile has been cleared.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto max-w-4xl py-12 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold font-headline tracking-tight">Your Financial Snapshot</h1>
          <p className="text-muted-foreground mt-2">Complete your financial profile to get more accurate purchase advice.</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={(e) => e.preventDefault()} onReset={handleReset} className="space-y-8">
              <Accordion type="multiple" className="w-full">
                {profileSections.map((section) => (
                  <AccordionItem value={section.id} key={section.id}>
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <section.icon className="h-5 w-5 text-accent" />
                        {section.title}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4">
                        {section.fields.map((field) => (
                          <div key={field} className="space-y-2">
                            <Label htmlFor={`${section.id}-${field.replace(/\s+/g, '-')}`}>{field}</Label>
                            <Input id={`${section.id}-${field.replace(/\s+/g, '-')}`} placeholder="Enter value" />
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <div className="flex justify-end gap-4 pt-4">
                <Button type="reset" variant="secondary">Reset Form</Button>
                <Button onClick={handleCalculate}>Calculate Financial Health</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
