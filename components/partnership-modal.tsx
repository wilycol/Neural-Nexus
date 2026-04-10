"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Building2, Mail, Send, Sparkles } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";

interface PartnershipModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PartnershipModal({ isOpen, onOpenChange }: PartnershipModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      type: formData.get("type"),
      message: formData.get("message"),
      source: "marquee_partner_button"
    };

    try {
      // Usamos el cliente de Supabase para guardar el lead de partnership
      const supabase = getSupabaseBrowserClient();
      
      // Intentamos guardar en una tabla de leads o enviar un email interno
      // Por ahora simulamos el éxito y registramos en la consola para industrializar luego
      console.log("Partnership Lead Captured:", data);
      
      // Simulación de delay de red industrial
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Propuesta enviada. Nuestro departamento comercial contactará contigo.");
      onOpenChange(false);
    } catch (error) {
      console.error("Error sending partnership lead:", error);
      toast.error("Error al enviar la propuesta. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-neon-blue/20">
              <Building2 className="h-5 w-5 text-neon-blue" />
            </div>
            <div className="text-[10px] font-orbitron font-bold tracking-[0.2em] text-neon-blue uppercase">
              Alianzas Industriales
            </div>
          </div>
          <DialogTitle className="text-xl font-orbitron tracking-tight">
            ÚNETE AL ECOSISTEMA NEURAL NEXUS
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-sm">
            Posiciona tu tecnología de IA ante nuestra audiencia de élite y acelera tu crecimiento industrial.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-zinc-500">Nombre del contacto</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="Tu nombre" 
              required 
              className="bg-white/5 border-white/10 focus:border-neon-blue/50" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email Corporativo</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="tu@empresa.com" 
              required 
              className="bg-white/5 border-white/10 focus:border-neon-blue/50" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-xs font-bold uppercase tracking-wider text-zinc-500">Compañía / Proyecto IA</Label>
            <Input 
              id="company" 
              name="company" 
              placeholder="Nombre de tu IA o Empresa" 
              required 
              className="bg-white/5 border-white/10 focus:border-neon-blue/50" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-xs font-bold uppercase tracking-wider text-zinc-500">Tipo de Colaboración</Label>
            <Select name="type" required>
              <SelectTrigger className="bg-white/5 border-white/10 focus:border-neon-blue/50">
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-white/10 text-white">
                <SelectItem value="slot">Slot en la Marquesina de Socios</SelectItem>
                <SelectItem value="integration">Integración Tecnológica</SelectItem>
                <SelectItem value="featured">Contenido Patrocinado</SelectItem>
                <SelectItem value="api">Neural Connect (Acceso API SaaS)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-zinc-500">Cuéntanos sobre tu propuesta</Label>
            <Textarea 
              id="message" 
              name="message" 
              placeholder="¿Cómo podemos potenciar tu tecnología?" 
              className="bg-white/5 border-white/10 focus:border-neon-blue/50 min-h-[100px]" 
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-neon-blue hover:bg-neon-blue/80 text-black font-bold font-orbitron tracking-widest uppercase py-6 transition-all group"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-spin" />
                ENVIANDO...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                ENVIAR PROPUESTA INDUSTRIAL
                <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
