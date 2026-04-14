'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { Loader2, ArrowRight } from 'lucide-react';

const formSchema = z.object({
  businessName: z.string().min(2, { message: "Mínimo 2 caracteres" }),
  niche: z.string().min(2, { message: "Selecciona un nicho industrial" }),
  tone: z.string().min(2, { message: "Selecciona el tono de Beatriz" }),
});

interface BusinessFormProps {
  onSuccess: () => void;
}

export function BusinessForm({ onSuccess }: BusinessFormProps) {
  const t = useTranslations('NeuralSites.onboarding');
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      niche: "",
      tone: "professional",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('client_sites')
        .update({
          business_name: values.businessName,
          niche: values.niche,
          tone: values.tone,
          status: 'building'
        })
        .eq('user_id', user.id)
        .eq('status', 'pending_onboarding');

      if (error) throw error;

      toast.success("¡Insumos recibidos! Beatriz ha comenzado la construcción.");
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error("Error al enviar insumos. Verifica tu suscripción.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary font-orbitron text-xs uppercase tracking-widest">Nombre del Negocio</FormLabel>
              <FormControl>
                <Input placeholder="Ej: TechNexus Pro" {...field} className="bg-background/20 border-primary/20 h-12 rounded-xl" />
              </FormControl>
              <FormDescription className="text-[10px] opacity-60">Como aparecerá en el encabezado de tu sitio.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="niche"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary font-orbitron text-xs uppercase tracking-widest">Nicho Industrial</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background/20 border-primary/20 h-12 rounded-xl">
                      <SelectValue placeholder="Selecciona Nicho" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="tech">Tecnología & Software</SelectItem>
                    <SelectItem value="health">Salud & Bienestar</SelectItem>
                    <SelectItem value="finance">Finanzas & Crypto</SelectItem>
                    <SelectItem value="ecommerce">Ecommerce Global</SelectItem>
                    <SelectItem value="education">Educación Online</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary font-orbitron text-xs uppercase tracking-widest">Tono de Beatriz</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background/20 border-primary/20 h-12 rounded-xl">
                      <SelectValue placeholder="Selecciona Tono" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="professional">Profesional & Serio</SelectItem>
                    <SelectItem value="casual">Casual & Amigable</SelectItem>
                    <SelectItem value="bold">Audaz & Disruptivo</SelectItem>
                    <SelectItem value="elegant">Elegante & Exclusivo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(0,163,255,0.3)] hover:scale-[1.02] transition-all" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              Procesando Insumos...
            </>
          ) : (
            <>
              Activar Construcción <ArrowRight className="ml-3 h-5 w-5" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
