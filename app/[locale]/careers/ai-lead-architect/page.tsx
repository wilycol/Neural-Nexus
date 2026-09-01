"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, FileText, Send, AlertCircle } from "lucide-react";

interface ApplicationData {
  id: string;
  applicant_name: string;
  email: string;
  phone: string;
  cv_file: string;
  cv_size: string;
  status: string;
}

export default function AILeadArchitectJobPage({ params }: { params: { locale: string } }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    linkedin: "",
    salary: "",
    cover_letter: "",
    consent: false
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<ApplicationData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 4.5 * 1024 * 1024) {
        setErrorMsg("⚠️ El archivo PDF supera el límite de 4.5 MB. Por favor adjunta un archivo PDF menor a 4.5 MB.");
        setFile(null);
        e.target.value = "";
        return;
      }
      setErrorMsg("");
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    if (file && file.size > 4.5 * 1024 * 1024) {
      setErrorMsg("⚠️ El archivo PDF es demasiado grande para el servidor (máximo 4.5 MB). Por favor comíprimelo antes de enviar.");
      setSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("first_name", formData.first_name);
      data.append("last_name", formData.last_name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("linkedin", formData.linkedin);
      data.append("salary", formData.salary);
      data.append("cover_letter", formData.cover_letter);
      if (file) {
        data.append("cv_file", file);
      }

      const res = await fetch("/api/careers/apply", {
        method: "POST",
        body: data
      });

      if (!res.ok) {
        if (res.status === 413) {
          setErrorMsg("⚠️ El archivo adjunto supera el límite de tamaño permitido por Vercel (4.5 MB). Comprime el PDF e intentalo de nuevo.");
          setSubmitting(false);
          return;
        }
        const errorJson = await res.json().catch(() => ({}));
        setErrorMsg(errorJson.error || `Error en el servidor (${res.status}).`);
        setSubmitting(false);
        return;
      }

      const result = await res.json();
      if (result.success) {
        setSubmittedData(result.application);
      } else {
        setErrorMsg(result.error || "Error al procesar la candidatura.");
      }
    } catch {
      setErrorMsg("Error de conexión al enviar la postulación.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Back */}
        <Link
          href={`/${params.locale || "es"}/careers`}
          className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Centro de Reclutamiento
        </Link>

        {/* Job Header Card */}
        <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-mono font-semibold border border-cyan-500/30">
              Vacante Oficial #NN-ARCH-2026
            </span>
            <span className="text-xs text-slate-400 font-mono">Match de Puntuación Fénix: 94.5%</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Principal AI Systems Architect & Lead Autonomous Agent Engineer
          </h1>

          <div className="flex flex-wrap gap-4 text-xs text-slate-300 font-mono border-y border-slate-800 py-3">
            <div><strong className="text-slate-400">Ubicación:</strong> Remoto / Bogotá, Colombia</div>
            <div><strong className="text-slate-400">Modalidad:</strong> Tiempo Completo / Contrato Directo</div>
            <div><strong className="text-slate-400">Rango Salarial:</strong> $90,000 - $140,000 USD / Año ($35 - $60 USD / hora)</div>
          </div>

          <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
            <h3 className="text-base font-bold text-white">Descripción de la Misión</h3>
            <p>
              Neural Nexus busca a un Arquitecto de Sistemas de Inteligencia Artificial de Elite para liderar la expansión de nuestra infraestructura de agentes autónomos distribuidos, portales web inteligentes (Neural Sites) y motores de automatización sigilosa.
            </p>
            <h3 className="text-base font-bold text-white pt-2">Requisitos Clave del Perfil:</h3>
            <ul className="list-disc list-inside space-y-1 text-xs font-mono text-slate-300">
              <li>Demostrada experiencia en diseño y despliegue de sistemas multi-agente asíncronos (TypeScript, Python, Node.js).</li>
              <li>Dominio de integración con LLMs multimodo (Groq, Zhipu, OpenAI, Wan 2.2, Gemini API).</li>
              <li>Experiencia en automatización sigilosa de navegadores (PyAutoGUI, Selenium Anti-Detection, Bezier Curves, Humanoid Motion).</li>
              <li>Capacidad de auditoría técnica, control de calidad (QA) y resiliencia de APIs sin degradación.</li>
            </ul>
          </div>
        </div>

        {/* Confirmation Banner if Submitted */}
        {submittedData ? (
          <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-2xl p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-white">¡Postulación Recibida Exitosamente en Neural Nexus!</h3>
                <p className="text-xs text-emerald-300 font-mono">ID de Expediente ATS: {submittedData.id}</p>
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-2 text-slate-300">
              <div><strong>Candidato Certificado:</strong> {submittedData.applicant_name}</div>
              <div><strong>Correo de Contacto:</strong> {submittedData.email}</div>
              <div><strong>Teléfono:</strong> {submittedData.phone}</div>
              <div><strong>Archivo CV Recibido:</strong> <span className="text-cyan-400 font-bold">{submittedData.cv_file}</span> ({submittedData.cv_size})</div>
              <div><strong>Estado ATS:</strong> <span className="text-emerald-400">{submittedData.status}</span></div>
            </div>

            <p className="text-xs text-slate-300">
              La postulación ha sido procesada por la Serie X Elite de Beatriz AI. El equipo técnico se pondrá en contacto a la brevedad.
            </p>
          </div>
        ) : (
          /* ATS Application Form Container */
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl" id="application_form">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" /> Formulario de Postulación Oficial ATS
              </h2>
              <p className="text-xs text-slate-400">Completa tus datos profesionales y adjunta tu archivo CV en formato PDF.</p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/80 border border-red-500/50 text-red-300 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 application-form" action="/api/careers/apply" method="POST" encType="multipart/form-data">
              {/* Names row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 font-mono" htmlFor="first_name">
                    Primer Nombre (Vorname) *
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    required
                    placeholder="Ej. Wily"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 font-mono" htmlFor="last_name">
                    Apellidos (Nachname) *
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    required
                    placeholder="Ej. Cordero"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 font-mono" htmlFor="email">
                    Correo Electrónico (E-Mail) *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="ejemplo@neuralnexus.ai"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 font-mono" htmlFor="phone">
                    Número Telefónico (Telefon)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+57 301 136 2432"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>
              </div>

              {/* LinkedIn & Salary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 font-mono" htmlFor="linkedin">
                    Perfil Profesional / GitHub / Portfolio
                  </label>
                  <input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    placeholder="https://github.com/wilycol"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 font-mono" htmlFor="salary">
                    Expectativa Salarial / Tarifa Horaria (Gehalt)
                  </label>
                  <input
                    type="text"
                    id="salary"
                    name="salary"
                    placeholder="Ej. $50 USD/hr o $110,000 USD/año"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>
              </div>

              {/* Cover letter / Pitch */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 font-mono" htmlFor="cover_letter">
                  Carta de Motivación / Presentación Técnica (Cover Letter)
                </label>
                <textarea
                  id="cover_letter"
                  name="cover_letter"
                  rows={4}
                  placeholder="Describe brevemente tus fortalezas en diseño de sistemas de IA, agentes autónomos y arquitectura..."
                  value={formData.cover_letter}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              {/* CV File Upload Box */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 font-mono" htmlFor="cv_file">
                  Adjuntar Hoja de Vida / Curriculum Vitae (PDF) *
                </label>
                <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 text-center bg-slate-950/50 transition-colors">
                  <input
                    type="file"
                    id="cv_file"
                    name="cv_file"
                    accept=".pdf,.doc,.docx"
                    required
                    onChange={handleFileChange}
                    className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-950 file:text-cyan-300 hover:file:bg-cyan-900 cursor-pointer"
                  />
                  {file && (
                    <p className="mt-2 text-xs font-mono text-cyan-400 font-bold">
                      📄 Archivo Adjunto: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>
              </div>

              {/* Checkbox consent */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  required
                  checked={formData.consent}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-cyan-500"
                />
                <label htmlFor="consent" className="text-xs text-slate-400 leading-relaxed cursor-pointer">
                  Acepto los términos de privacidad de Neural Nexus Talent Hub y autorizo el tratamiento de mis datos para el proceso de selección de esta posición.
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  "Procesando Postulación..."
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Enviar Postulación a Neural Nexus
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
