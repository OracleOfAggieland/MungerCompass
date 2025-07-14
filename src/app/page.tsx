"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AppHeader } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { mungerStyleAnalysis, type MungerStyleAnalysisOutput } from '@/ai/flows/munger-style-analysis';
import { findCheaperAlternatives, type FindCheaperAlternativesOutput } from '@/ai/flows/price-comparison';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Camera, Upload, ThumbsUp, ThumbsDown, Lightbulb, TrendingDown, DollarSign, Wallet, Link as LinkIcon, AlertTriangle, ExternalLink } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const purchaseSchema = z.object({
  itemName: z.string().min(1, 'Item name is required.'),
  cost: z.coerce.number().min(0.01, 'Cost must be greater than $0.'),
  purpose: z.string().optional(),
  frequency: z.enum(['Daily', 'Weekly', 'Monthly', 'Rarely', 'One-time', '']).optional(),
  image: z.string().optional(),
});
type PurchaseFormValues = z.infer<typeof purchaseSchema>;

export default function PurchaseAdvisorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MungerStyleAnalysisOutput | null>(null);
  const [alternativesResult, setAlternativesResult] = useState<FindCheaperAlternativesOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: { itemName: '', cost: 0, purpose: '', frequency: '' },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for Gemini
        toast({ variant: "destructive", title: "Image too large", description: "Please upload an image smaller than 4MB." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue('image', result);
      };
      reader.onerror = () => {
        toast({ variant: "destructive", title: "Error", description: "Failed to read the image file." });
      };
      reader.readAsDataURL(file);
    }
  };

  const resetState = () => {
    setIsLoading(false);
    setAnalysisResult(null);
    setAlternativesResult(null);
    setError(null);
  }

  const handleGetAdvice = async (data: PurchaseFormValues) => {
    resetState();
    setIsLoading(true);
    try {
      const sanitizedData = {
        ...data,
        frequency: data.frequency || undefined,
      };
      const result = await mungerStyleAnalysis({ ...sanitizedData, imageUrl: data.image });
      setAnalysisResult(result);
    } catch (e) {
      setError("An error occurred while getting advice. Please try again.");
      toast({ variant: "destructive", title: "Analysis Failed", description: "Could not get a recommendation." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindAlternatives = async () => {
    resetState();
    const { itemName, image } = form.getValues();
    if (!itemName || !image) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please provide an item name and image to find alternatives." });
      return;
    }
    setIsLoading(true);
    try {
      const result = await findCheaperAlternatives({ itemName, itemImageUrl: image });
      setAlternativesResult(result);
    } catch (e) {
      setError("An error occurred while finding alternatives. Please try again.");
      toast({ variant: "destructive", title: "Search Failed", description: "Could not find cheaper alternatives." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <div className="text-left">
              <h1 className="text-4xl font-bold font-headline tracking-tight">Should You Buy It?</h1>
              <p className="text-muted-foreground mt-2">Get Charlie Munger's rational advice on your purchasing decisions.</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleGetAdvice)} className="space-y-6">
                    <FormField control={form.control} name="itemName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Name</FormLabel>
                        <FormControl><Input placeholder="e.g., Standing Desk, Luxury Watch" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="cost" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input type="number" placeholder="1200" className="pl-8" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="purpose" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purpose (Optional)</FormLabel>
                        <FormControl><Input placeholder="e.g., Improve productivity, status symbol" {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="frequency" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency of Use (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Daily">Daily</SelectItem>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Rarely">Rarely</SelectItem>
                            <SelectItem value="One-time">One-time</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <div>
                      <FormLabel>Image of Item (Optional)</FormLabel>
                      <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                          <Camera className="mr-2 h-4 w-4" /> Capture Image
                        </Button>
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="mr-2 h-4 w-4" /> Upload Image
                        </Button>
                      </div>
                      {imagePreview && (
                        <div className="mt-4 border rounded-lg p-2 bg-muted/50 w-full aspect-video relative">
                          <Image src={imagePreview} alt="Item preview" fill className="rounded-md object-contain" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button type="button" variant="secondary" onClick={handleFindAlternatives} className="w-full" disabled={isLoading}>Find Cheaper Alternatives</Button>
                      <Button type="submit" className="w-full" disabled={isLoading}>Should I Buy It?</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            {isLoading && <AnalysisSkeleton />}
            {!isLoading && error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {!isLoading && !error && analysisResult && <AnalysisDisplay analysis={analysisResult} />}
            {!isLoading && !error && alternativesResult && <AlternativesDisplay alternatives={alternativesResult} />}
            {!isLoading && !error && !analysisResult && !alternativesResult && <Placeholder />}
          </div>
        </div>
      </main>
    </div>
  );
}

const Placeholder = () => (
  <div className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30 p-12 text-center">
    <Wallet className="h-16 w-16 text-muted-foreground/50 mb-4" />
    <h3 className="text-xl font-semibold font-headline">Awaiting Your Query</h3>
    <p className="mt-2 text-muted-foreground">
      "The big money is not in the buying or the selling, but in the waiting."
    </p>
    <p className="mt-1 text-sm text-muted-foreground/80">- Charlie Munger</p>
  </div>
);

const AnalysisSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-8 w-3/4" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-4 w-full" />
      </div>
    </CardContent>
  </Card>
);

const AnalysisDisplay = ({ analysis }: { analysis: MungerStyleAnalysisOutput }) => {
  const isBuy = analysis.recommendation.toLowerCase().includes('buy');
  return (
    <Card className="w-full animate-in fade-in-50">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isBuy ? 'text-foreground' : 'text-destructive'}`}>
          {isBuy ? <ThumbsUp /> : <ThumbsDown />}
          Munger's Verdict: {analysis.recommendation}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <InfoSection icon={Lightbulb} title="Reasoning">{analysis.reasoning}</InfoSection>
        <InfoSection icon={TrendingDown} title="Opportunity Cost">{analysis.opportunityCost}</InfoSection>
        <InfoSection icon={Wallet} title="Financial Impact">{analysis.financialImpact}</InfoSection>
        <InfoSection icon={AlertTriangle} title="Key Insights & Behavioral Traps">{analysis.keyInsights}</InfoSection>
        {analysis.alternatives && <InfoSection icon={DollarSign} title="Alternatives">{analysis.alternatives}</InfoSection>}
      </CardContent>
    </Card>
  );
};

const AlternativesDisplay = ({ alternatives }: { alternatives: FindCheaperAlternativesOutput }) => (
  <Card className="w-full animate-in fade-in-50">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <TrendingDown />
        Cheaper Alternatives Found
      </CardTitle>
      <CardDescription>
        Here are some other options to consider.
      </CardDescription>
    </CardHeader>
    <CardContent>
      {alternatives.alternatives.length > 0 ? (
        <ul className="space-y-4">
          {alternatives.alternatives.map((alt, index) => (
            <li key={index} className="flex items-center justify-between p-3 rounded-md border bg-muted/50">
              <div>
                <p className="font-semibold">{alt.name}</p>
                <p className="text-lg font-bold text-accent">${alt.price.toFixed(2)}</p>
              </div>
              <Button asChild variant="ghost" size="sm">
                <a href={alt.url} target="_blank" rel="noopener noreferrer">
                  View <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">No cheaper alternatives could be found at this time.</p>
      )}
    </CardContent>
  </Card>
);

const InfoSection = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
  <div className="flex items-start gap-4">
    <div className="bg-accent/10 text-accent p-2 rounded-full mt-1">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h3 className="font-semibold font-headline">{title}</h3>
      <p className="text-muted-foreground">{children}</p>
    </div>
  </div>
);
