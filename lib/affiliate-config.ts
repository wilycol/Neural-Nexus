export interface AffiliateRule {
  keywords: string[];
  ctaLabel: string;
  url: string;
  icon?: string;
}

export const affiliateRules: AffiliateRule[] = [
  {
    keywords: ['nvidia', 'gpu', 'rtx', 'gráfica', 'h100', 'b200'],
    ctaLabel: 'Ver más',
    url: 'https://amzn.to/3TSfM6H', // Placeholder: Wily debe poner su link de Amazon personalizado
  },
  {
    keywords: ['magic hour', 'video ia', 'generar video', 'reels ia'],
    ctaLabel: 'Ver más',
    url: 'https://magichour.ai/?ref=neuralnexus', // Placeholder: Wily debe poner su link de Magic Hour
  },
  {
    keywords: ['flux', 'imagen ia', 'diseño ia', 'generación de imagen'],
    ctaLabel: 'Ver más',
    url: 'https://blackforestlabs.ai/', 
  },
  {
    keywords: ['openai', 'chatgpt', 'gpt-4', 'sora'],
    ctaLabel: 'Ver más',
    url: 'https://openai.com/',
  },
  {
    keywords: ['groq', 'lpu', 'velocidad', 'inferencia'],
    ctaLabel: 'Ver más',
    url: 'https://groq.com/',
  }
];

export function findAffiliateMatch(content: string, tags: string[] = []): AffiliateRule | null {
  const lowerContent = content.toLowerCase();
  const lowerTags = tags.map(t => t.toLowerCase());

  for (const rule of affiliateRules) {
    const hasKeywordMatch = rule.keywords.some(keyword => 
      lowerContent.includes(keyword.toLowerCase()) || 
      lowerTags.some(tag => tag.includes(keyword.toLowerCase()))
    );

    if (hasKeywordMatch) return rule;
  }

  return null;
}
