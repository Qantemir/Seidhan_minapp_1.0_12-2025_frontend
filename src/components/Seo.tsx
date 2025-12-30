import { useEffect } from 'react';
import { buildCanonicalUrl, siteConfig } from "@/lib/seo";

type SeoProps = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

export const Seo = ({
  title,
  description,
  path,
  image,
  noIndex,
  jsonLd,
}: SeoProps) => {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const metaDescription = description ?? siteConfig.description;
  const canonical = buildCanonicalUrl(path);
  const previewImage = image ?? siteConfig.ogImage;
  const keywords = siteConfig.keywords.join(", ");
  const robots = noIndex ? "noindex,nofollow" : "index,follow";

  useEffect(() => {
    // Обновляем title
    if (document.title !== fullTitle) {
      document.title = fullTitle;
    }
    
    // Обновляем или создаем canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);
    
    // Обновляем meta теги
    const updateMeta = (name: string, content: string, property: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    updateMeta('description', metaDescription, false);
    updateMeta('keywords', keywords, false);
    updateMeta('robots', robots, false);
    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', metaDescription, true);
    updateMeta('og:type', 'website', true);
    updateMeta('og:url', canonical, true);
    updateMeta('og:image', previewImage, true);
    updateMeta('og:site_name', siteConfig.name, true);
    updateMeta('og:locale', siteConfig.locale, true);
    updateMeta('twitter:card', 'summary_large_image', false);
    updateMeta('twitter:title', fullTitle, false);
    updateMeta('twitter:description', metaDescription, false);
    updateMeta('twitter:image', previewImage, false);
  }, [fullTitle, metaDescription, canonical, previewImage, keywords, robots]);

  useEffect(() => {
    if (jsonLd) {
      let script = document.getElementById('json-ld') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = 'json-ld';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }
  }, [jsonLd]);

  return null;
};
