# GeoJeronimo PWA

## Instalação no celular

1. Sirva o build de produção (`npm run build` + `npm run preview`) ou publique o conteúdo de `dist/`.
2. Acesse via **HTTPS** (obrigatório para PWA).
3. Android Chrome: menu → **Instalar app** ou use o banner **Instalar GeoJeronimo**.
4. iOS Safari: **Compartilhar** → **Adicionar à Tela de Início**.

## Desenvolvimento

```bash
npm run dev
```

O service worker fica ativo em dev (`devOptions.enabled`) para testar cache e offline.

## Offline parcial

| Recurso | Comportamento |
|---------|----------------|
| App (JS/CSS/HTML) | Precache |
| GeoJSON (`/ruas`, `/limites`, `/inundacao` sob demanda) | Cache ao usar |
| Tiles OSM / Esri | Cache limitado |
| Supabase / DCRS | Sempre rede |

## Sincronização futura

Fila em `src/pwa/offlineSync.js` (`queueOfflineMutation`) — pronta para integrar com Supabase quando offline.

## Ícone e splash

- Ícone: `public/pwa/icon.svg`
- Splash: `background_color` / `theme_color` `#090e18` no manifest (tela ao abrir)

Para PNG maskable em lojas antigas, gere `pwa-192.png` e `pwa-512.png` e adicione em `vite.config.js` → `manifest.icons`.
