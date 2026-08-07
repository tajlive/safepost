# GitHub Secrets — Safepost

Disse secretsene må legges inn i GitHub repository settings:
**Settings → Secrets and variables → Actions → New repository secret**

## Påkrevde secrets

| Secret | Beskrivelse | Hentes fra |
|--------|-------------|------------|
| `CLOUDFLARE_API_TOKEN` | API-token med Workers Edit-tillatelse | [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens) → "Edit Cloudflare Workers"-malen |
| `CLOUDFLARE_ACCOUNT_ID` | Din Cloudflare Account ID | [dash.cloudflare.com](https://dash.cloudflare.com) → høyre sidefelt på Workers-siden |

## Valgfrie secrets (fremtidig bruk)

| Secret | Beskrivelse |
|--------|-------------|
| `RESEND_API_KEY` | E-postlevering via Resend.com |
| `ENCRYPTION_KEY` | 32-byte nøkkel for AES-256 kryptering av post-innhold |
| `WEBHOOK_SECRET` | Validering av innkommende webhooks |

## Slik oppretter du Cloudflare API Token

1. Gå til https://dash.cloudflare.com/profile/api-tokens
2. Klikk **Create Token**
3. Bruk malen **"Edit Cloudflare Workers"**
4. Under **Account Resources** → velg din konto
5. Under **Zone Resources** → velg "All zones" (eller spesifikk zone)
6. Klikk **Continue to summary** → **Create Token**
7. Kopier token og legg inn som `CLOUDFLARE_API_TOKEN` i GitHub

## Account ID

1. Gå til https://dash.cloudflare.com
2. Velg **Workers & Pages** i venstremenyen
3. Account ID vises i høyre sidefelt
4. Kopier og legg inn som `CLOUDFLARE_ACCOUNT_ID` i GitHub
