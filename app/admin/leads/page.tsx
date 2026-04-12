"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Handshake, 
  Search, 
  Filter, 
  ChevronRight, 
  Mail, 
  Building2, 
  Clock, 
  Tag, 
  Globe,
  Loader2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  type: string;
  message: string;
  source: string;
  status: string;
  created_at: string;
}

export default function AdminLeadsPage() {
  const { user, role, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    if (!authLoading && role !== "admin") router.push("/");
  }, [user, role, authLoading, router]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      if (res.ok) setLeads(data.data || []);
      else toast.error("Error al cargar leads");
    } catch (error) {
      toast.error("Error de conexión");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "admin") fetchLeads();
  }, [role]);

  const updateLeadStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        toast.success(`Estado actualizado a ${newStatus}`);
        fetchLeads(); // Recargar datos
        if (selectedLead?.id === id) {
          setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
        }
      } else {
        toast.error("Error al actualizar estado");
      }
    } catch (error) {
      toast.error("Error de red");
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="border-amber-500/50 text-amber-500 bg-amber-500/10">Pendiente</Badge>;
      case 'contacted': return <Badge variant="outline" className="border-blue-500/50 text-blue-500 bg-blue-500/10">Contactado</Badge>;
      case 'partnered': return <Badge variant="outline" className="border-green-500/50 text-green-500 bg-green-500/10">Socio</Badge>;
      case 'rejected': return <Badge variant="outline" className="border-red-500/50 text-red-500 bg-red-500/10">Rechazado</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <Loader2 className="h-10 w-10 text-neon-blue animate-spin mb-4" />
        <p className="text-zinc-500 font-orbitron text-xs tracking-[0.3em] uppercase animate-pulse">
          Escaneando Frecuencias de Alianzas...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 font-sans selection:bg-neon-blue/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-2 text-neon-blue">
               <ShieldCheck className="h-4 w-4" />
               <span className="text-[10px] uppercase font-bold tracking-[0.3em] font-orbitron">Búnker Terminal // Admin Ops</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic font-orbitron flex items-center gap-4">
               VIGILANCIA DE <span className="text-neon-blue">ALIANZAS</span>
               <Handshake className="h-10 w-10 text-neon-blue" />
            </h1>
            <p className="text-zinc-500 mt-2 max-w-lg">
              Monitoreo y gestión de requisiciones industriales para Neural Connect y colaboraciones B2B.
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input 
                  placeholder="Buscar socio..."
                  className="bg-zinc-900 border-white/5 pl-10 h-11 focus:ring-neon-blue/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] bg-zinc-900 border-white/5 h-11">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="contacted">Contactados</SelectItem>
                  <SelectItem value="partnered">Socios</SelectItem>
                  <SelectItem value="rejected">Rechazados</SelectItem>
                </SelectContent>
             </Select>
          </div>
        </div>

        {/* Leads Grid/Table */}
        <div className="space-y-4">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-[10px] uppercase font-bold text-zinc-500 tracking-widest bg-zinc-900/50 rounded-lg">
             <div className="col-span-3">Socio / Identidad</div>
             <div className="col-span-3">Compañía / Proyecto</div>
             <div className="col-span-2">Categoría</div>
             <div className="col-span-2">Estado</div>
             <div className="col-span-2 text-right">Fecha</div>
          </div>

          <div className="space-y-3">
             {filteredLeads.length === 0 ? (
               <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                  <HelpCircle className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500 font-medium">No se encontraron requisiciones activas.</p>
               </div>
             ) : (
               filteredLeads.map((lead) => (
                 <div 
                   key={lead.id}
                   onClick={() => setSelectedLead(lead)}
                   className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 bg-zinc-900/30 border border-white/5 rounded-2xl hover:bg-zinc-900/50 hover:border-neon-blue/20 transition-all cursor-pointer group items-center"
                 >
                    <div className="col-span-3 flex flex-col">
                       <span className="font-bold text-white group-hover:text-neon-blue transition-colors">{lead.name}</span>
                       <span className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {lead.email}
                       </span>
                    </div>
                    <div className="col-span-3">
                       <span className="text-sm font-medium flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-zinc-500" /> {lead.company}
                       </span>
                    </div>
                    <div className="col-span-2">
                       <Badge variant="secondary" className="bg-white/5 text-[10px] uppercase tracking-tighter">
                          {lead.type}
                       </Badge>
                    </div>
                    <div className="col-span-2">
                       {getStatusBadge(lead.status)}
                    </div>
                    <div className="col-span-2 text-right flex flex-col items-end">
                       <span className="text-xs text-zinc-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {new Date(lead.created_at).toLocaleDateString()}
                       </span>
                       <ChevronRight className="h-4 w-4 text-zinc-700 group-hover:translate-x-1 transition-transform mt-1" />
                    </div>
                 </div>
               ))
             )}
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
         <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-2xl sm:rounded-[2rem] overflow-hidden">
            {selectedLead && (
              <>
                <DialogHeader className="p-4 border-b border-white/5 bg-gradient-to-r from-neon-blue/10 to-transparent">
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                         <DialogTitle className="text-2xl font-black italic font-orbitron">DETALLE DE REQUISICIÓN</DialogTitle>
                         <DialogDescription className="text-zinc-500 font-mono text-[10px] uppercase">
                            ID: {selectedLead.id}
                         </DialogDescription>
                      </div>
                      <Badge className="bg-neon-blue text-black font-bold uppercase tracking-widest text-[10px]">
                         SOURCE: {selectedLead.source}
                      </Badge>
                   </div>
                </DialogHeader>

                <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                         <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-[0.2em] flex items-center gap-2">
                            <Tag className="h-3 w-3" /> Nombre Completo
                         </label>
                         <p className="text-lg font-bold">{selectedLead.name}</p>
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-[0.2em] flex items-center gap-2">
                            <Mail className="h-3 w-3" /> Canal de Contacto
                         </label>
                         <p className="text-lg font-bold text-neon-blue underline cursor-pointer">{selectedLead.email}</p>
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-[0.2em] flex items-center gap-2">
                            <Building2 className="h-3 w-3" /> Compañía / Org
                         </label>
                         <p className="text-lg font-bold">{selectedLead.company}</p>
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-[0.2em] flex items-center gap-2">
                            <Globe className="h-3 w-3" /> Categoría de Alianza
                         </label>
                         <p className="text-lg font-bold uppercase">{selectedLead.type}</p>
                      </div>
                   </div>

                   <div className="space-y-2 pt-4 border-t border-white/5">
                      <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-[0.2em]">Cuerpo de la Propuesta / Mensaje</label>
                      <div className="bg-zinc-900 border border-white/5 p-6 rounded-2xl text-zinc-300 font-sans leading-relaxed whitespace-pre-wrap italic">
                         &quot;{selectedLead.message || 'Sin mensaje adicional.'}&quot;
                      </div>
                   </div>

                   <div className="space-y-4 pt-4 border-t border-white/5">
                      <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-[0.2em]">Control de Estado de Alianza</label>
                      <div className="flex flex-wrap gap-2">
                         {[
                           { label: 'Pendiente', val: 'pending', color: 'bg-amber-500' },
                           { label: 'Contactado', val: 'contacted', color: 'bg-blue-500' },
                           { label: 'Aceptar Socio', val: 'partnered', color: 'bg-green-500' },
                           { label: 'Rechazar', val: 'rejected', color: 'bg-red-500' },
                         ].map((btn) => (
                           <Button 
                             key={btn.val}
                             disabled={selectedLead.status === btn.val}
                             variant={selectedLead.status === btn.val ? "secondary" : "outline"}
                             className={`h-10 px-4 font-bold uppercase text-[10px] tracking-widest ${selectedLead.status === btn.val ? 'opacity-100' : 'bg-transparent border-white/10 hover:bg-white/5'}`}
                             onClick={() => updateLeadStatus(selectedLead.id, btn.val)}
                           >
                              {selectedLead.status === btn.val && <CheckCircle2 className="h-3 w-3 mr-2" />}
                              {btn.label}
                           </Button>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="p-4 bg-zinc-900 flex justify-between items-center text-[10px] text-zinc-500 font-mono uppercase">
                   <span className="flex items-center gap-2">
                      <Clock className="h-3 w-3" /> Registrado: {new Date(selectedLead.created_at).toLocaleString()}
                   </span>
                   <Button variant="ghost" size="sm" className="text-xs text-neon-blue h-6" onClick={() => setSelectedLead(null)}>
                      CERRAR TERMINAL
                   </Button>
                </div>
              </>
            )}
         </DialogContent>
      </Dialog>
    </div>
  );
}
