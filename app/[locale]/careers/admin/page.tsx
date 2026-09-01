"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, FileText, RefreshCw, ShieldCheck, User, Search } from "lucide-react";

interface ApplicationRecord {
  id: string;
  created_at: string;
  applicant_name: string;
  email: string;
  phone: string;
  linkedin: string;
  salary: string;
  cover_letter: string;
  cv_file: string;
  cv_size: string;
  status: string;
}

export default function CareersAdminPage({ params }: { params: { locale: string } }) {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/careers/applications");
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications || []);
      }
    } catch (e) {
      console.error("Error cargando postulaciones:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filtered = applications.filter((app) =>
    `${app.applicant_name} ${app.email} ${app.id}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <Link
              href={`/${params.locale || "es"}/careers`}
              className="inline-flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors mb-2 font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al Portal de Empleos
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-cyan-400" /> Gestor de Candidatos & Postulaciones ATS
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Panel Administrativo de Recursos Humanos — Federación Neural Nexus
            </p>
          </div>

          <button
            onClick={fetchApplications}
            className="px-4 py-2 bg-slate-900 border border-slate-700 hover:border-cyan-500 rounded-xl text-xs font-mono flex items-center gap-2 text-cyan-400 hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refrescar Candidatos
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
          <Search className="w-4 h-4 text-slate-500 ml-2" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo o ID de expediente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
          />
        </div>

        {/* Applications List Table */}
        <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
              Expedientes de Postulación Registrados ({filtered.length})
            </span>
            <span className="text-xs font-mono text-slate-500">Formato ATS Certificado</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs font-mono">Cargando expediente de candidatos...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-mono space-y-2">
              <User className="w-8 h-8 text-slate-600 mx-auto" />
              <p>No se encontraron postulaciones registradas en el sistema.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4 font-semibold">Candidato</th>
                    <th className="p-4 font-semibold">Contacto & Tarifa</th>
                    <th className="p-4 font-semibold">Fecha & ID</th>
                    <th className="p-4 font-semibold">Estado ATS</th>
                    <th className="p-4 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filtered.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{app.applicant_name}</div>
                        {app.linkedin && (
                          <a
                            href={app.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-cyan-400 hover:underline block truncate max-w-[200px]"
                          >
                            {app.linkedin}
                          </a>
                        )}
                      </td>

                      <td className="p-4 space-y-1">
                        <div className="text-slate-300">{app.email}</div>
                        <div className="text-slate-400">{app.phone || "Sin teléfono"}</div>
                        {app.salary && <div className="text-cyan-400 font-bold">{app.salary}</div>}
                      </td>

                      <td className="p-4 space-y-1">
                        <div className="text-slate-300">{app.created_at ? new Date(app.created_at).toLocaleString() : "Reciente"}</div>
                        <div className="text-slate-500 text-[10px]">{app.id}</div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                          {app.status || "RECEIVED_ATS_PASSED"}
                        </span>
                      </td>

                      <td className="p-4 text-right space-y-2">
                        {app.cv_file ? (
                          <a
                            href={`/api/careers/download-cv?file=${encodeURIComponent(app.cv_file)}`}
                            download
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white text-[11px] font-bold transition-all shadow-md"
                          >
                            <Download className="w-3.5 h-3.5" /> Descargar CV PDF
                          </a>
                        ) : (
                          <span className="text-slate-600 text-[10px]">Sin PDF</span>
                        )}

                        {app.cover_letter && (
                          <button
                            onClick={() => setSelectedLetter(app.cover_letter)}
                            className="block ml-auto text-[11px] text-slate-400 hover:text-cyan-300 underline font-mono cursor-pointer"
                          >
                            Ver Carta de Motivación
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal for Cover Letter View */}
        {selectedLetter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" /> Carta de Motivación / Pitch Técnico
                </h3>
                <button onClick={() => setSelectedLetter(null)} className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer">
                  [Cerrar Esc]
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                {selectedLetter}
              </div>

              <button
                onClick={() => setSelectedLetter(null)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-mono font-bold cursor-pointer transition-colors"
              >
                Cerrar Vista
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
