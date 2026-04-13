import { createServerClient } from './supabase-server';

export interface AuditResult {
  bucket: string;
  totalFiles: number;
  totalReferences: number;
  brokenLinks: { id: string; title: string; url: string; table: string }[];
  orphanFiles: string[];
  protectedFiles: string[];
  timestamp: string;
}

/**
 * Beatriz Elite Integrity Service 🛡️
 * Cerebro industrial para el mantenimiento de activos del portal.
 */
export async function performSystemAudit(): Promise<AuditResult[]> {
  const supabase = createServerClient();
  const results: AuditResult[] = [];

  // --- CONFIGURACIÓN DE ACTIVOS CRÍTICOS (PROTEGIDOS) ---
  const { data: pitchFiles } = await supabase.from('pitch_videos').select('url');
  const protectedVideoPatterns = (pitchFiles || []).map(p => p.url.split('/').pop()).filter(Boolean);

  const buckets = [
    { name: 'videos', tables: [
      { name: 'news', columns: ['video_url'] },
      { name: 'blog_posts', columns: ['video_url'] },
      { name: 'pitch_videos', columns: ['url'] }
    ]},
    { name: 'images', tables: [
      { name: 'news', columns: ['image_url', 'cover_url'] },
      { name: 'blog_posts', columns: ['image_url'] },
      { name: 'users', columns: ['avatar_url'] },
      { name: 'news_sources', columns: ['icon_url'] }
    ]}
  ];

  for (const bucket of buckets) {
    const audit: AuditResult = {
      bucket: bucket.name,
      totalFiles: 0,
      totalReferences: 0,
      brokenLinks: [],
      orphanFiles: [],
      protectedFiles: bucket.name === 'videos' ? (protectedVideoPatterns as string[]) : [],
      timestamp: new Date().toISOString()
    };

    // 1. Listar archivos reales en el STORAGE
    const { data: storageObjects, error: storageError } = await supabase
      .storage
      .from(bucket.name)
      .list('', { limit: 1000 });

    if (storageError) {
      console.error(`❌ Error auditando bucket ${bucket.name}:`, storageError);
      continue;
    }

    const storageFileNames = storageObjects?.map(o => o.name) || [];
    audit.totalFiles = storageFileNames.length;

    // 2. Rastrear referencias en TODAS las tablas configuradas
    const referencedFiles = new Set<string>();

    for (const tableConfig of bucket.tables) {
      for (const col of tableConfig.columns) {
        const { data: rows } = await supabase
          .from(tableConfig.name)
          // @ts-ignore - Dynamic columns require any casting to satisfy strict select types
          .select(`id, title, ${col}` as string)
          // @ts-ignore - Dynamic columns require any casting
          .not(col as string, 'is', null);

        if (rows) {
          (rows as unknown[]).forEach((item: unknown) => {
            const row = item as { id: string; title?: string; [key: string]: string | undefined };
            const url = row[col];
            if (url && typeof url === 'string') {
              const fileName = url.split('/').pop();
              if (fileName) {
                audit.totalReferences++;
                referencedFiles.add(fileName);

                // Detectar links rotos (está en DB pero NO en Storage)
                if (!storageFileNames.includes(fileName)) {
                  audit.brokenLinks.push({
                    id: row.id,
                    title: row.title || 'Unknown Asset',
                    url: url,
                    table: tableConfig.name
                  });
                }
              }
            }
          });
        }
      }
    }

    // 3. Detectar HUÉRFANOS (está en Storage pero NO en ninguna DB y NO está protegido)
    storageFileNames.forEach(fileName => {
      const isReferenced = referencedFiles.has(fileName);
      const isProtected = audit.protectedFiles.includes(fileName);

      if (!isReferenced && !isProtected) {
        audit.orphanFiles.push(fileName);
      }
    });

    results.push(audit);
  }

  return results;
}
