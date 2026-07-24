// Supabase Edge Function (Deno). Deploy with:
//   supabase functions deploy generate-catalog --no-verify-jwt
// Public, unauthenticated GET endpoint — generates the downloadable PDF
// catalog live, on every request, directly from the products table. There
// is no static file to go stale: whatever is active in Supabase right now
// (price, specs, bulk tiers) is what's in the PDF. Link to this function's
// URL anywhere a "Download Catalog" link is needed (see Footer in App.tsx).
//
// Deliberately NOT gated behind an email/lead form — the primary audience
// is government/institutional buyers who want a quick reference to attach
// to a file, and that audience is better served by zero friction than by
// a lead-capture form (see conversation history for the reasoning).
//
// Requires secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'npm:pdf-lib@1.17.1';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const NAVY = rgb(0x0f / 255, 0x17 / 255, 0x2a / 255);
const NAVY_LIGHT = rgb(0x33 / 255, 0x41 / 255, 0x55 / 255);
const ACCENT = rgb(0xb4 / 255, 0x53 / 255, 0x09 / 255);
const GRAY = rgb(0x64 / 255, 0x74 / 255, 0x8b / 255);
const LIGHT_GRAY = rgb(0xe2 / 255, 0xe8 / 255, 0xf0 / 255);
const WHITE = rgb(1, 1, 1);

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 56;
const CONTENT_W = PAGE_W - MARGIN * 2;

interface ProductSpec {
  spec_name: string;
  spec_value: string;
  sort_order: number;
}
interface PriceTier {
  min_quantity: number;
  unit_price: string;
}
interface CatalogProduct {
  name: string;
  sku: string;
  base_price: string;
  short_description: string | null;
  category: { name: string; sort_order: number } | null;
  product_specs: ProductSpec[];
  product_price_tiers: PriceTier[];
}

function currency(n: number): string {
  return `$${n.toFixed(2)}`;
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

Deno.serve(async (req) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { data, error } = await supabase
    .from('products')
    .select(
      'name, sku, base_price, short_description, category:categories(name, sort_order), product_specs(spec_name, spec_value, sort_order), product_price_tiers(min_quantity, unit_price)'
    )
    .eq('status', 'active');

  if (error) {
    return new Response(`Catalog generation failed: ${error.message}`, { status: 500 });
  }

  const products = (data ?? []) as unknown as CatalogProduct[];
  products.forEach((p) => p.product_specs.sort((a, b) => a.sort_order - b.sort_order));
  products.sort((a, b) => {
    const catDiff = (a.category?.sort_order ?? 99) - (b.category?.sort_order ?? 99);
    return catDiff !== 0 ? catDiff : a.name.localeCompare(b.name);
  });

  const pdf = await PDFDocument.create();
  pdf.setTitle('KORIX LLC Product Catalog');
  pdf.setAuthor('KORIX LLC');
  pdf.setSubject('Industrial and specialty goods catalog');

  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const helvOblique = await pdf.embedFont(StandardFonts.HelveticaOblique);

  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // ── Cover page ──────────────────────────────────────────────────────
  let page: PDFPage = pdf.addPage([PAGE_W, PAGE_H]);
  page.drawRectangle({ x: 0, y: PAGE_H - 260, width: PAGE_W, height: 260, color: NAVY });
  page.drawText('KORIX LLC', { x: MARGIN, y: PAGE_H - 130, size: 34, font: helvBold, color: WHITE });
  page.drawText('Product Catalog', {
    x: MARGIN,
    y: PAGE_H - 165,
    size: 20,
    font: helv,
    color: rgb(0xcb / 255, 0xd5 / 255, 0xe1 / 255),
  });
  page.drawText('Texas-Registered Distributor of Industrial & Specialty Goods', {
    x: MARGIN,
    y: PAGE_H - 195,
    size: 11,
    font: helvOblique,
    color: rgb(0x94 / 255, 0xa3 / 255, 0xb8 / 255),
  });

  let y = PAGE_H - 320;
  const infoLines: [string, string][] = [
    ['Generated', dateStr],
    ['Website', 'korixllc.com'],
    ['NAICS', '423840 — Industrial Supplies Merchant Wholesalers'],
    ['Government Sales', 'Registered with SAM.gov'],
    ['Shipping', 'Anywhere in the United States'],
  ];
  for (const [label, value] of infoLines) {
    page.drawText(label.toUpperCase(), { x: MARGIN, y, size: 9, font: helvBold, color: GRAY });
    page.drawText(value, { x: MARGIN + 130, y, size: 11, font: helv, color: NAVY_LIGHT });
    y -= 22;
  }

  y -= 20;
  page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 1, color: LIGHT_GRAY });
  y -= 30;

  const noteLines = wrapText(
    'Prices shown are per unit as listed; bulk pricing tiers are noted where available and are automatically applied at checkout. Shipping is calculated at checkout by order weight. Orders over 100 lbs ship via freight — contact us or use the Request a Quote / PO form for a freight quote. This catalog is generated directly from our live product data and reflects current pricing as of the date above.',
    helv,
    10,
    CONTENT_W
  );
  for (const line of noteLines) {
    page.drawText(line, { x: MARGIN, y, size: 10, font: helv, color: GRAY });
    y -= 15;
  }

  y -= 20;
  page.drawText('Government & Institutional Buyers', { x: MARGIN, y, size: 12, font: helvBold, color: NAVY });
  y -= 18;
  const govLines = wrapText(
    'For a formal quote, purchase order, or invoicing instead of card checkout, use our Request a Quote / PO form at korixllc.com/request-quote. Individual products are classified by Federal Supply Class (PSC) below for procurement reference.',
    helv,
    10,
    CONTENT_W
  );
  for (const line of govLines) {
    page.drawText(line, { x: MARGIN, y, size: 10, font: helv, color: GRAY });
    y -= 15;
  }

  page.drawText('korixllc.com  ·  Texas, USA', { x: MARGIN, y: 40, size: 9, font: helv, color: GRAY });

  // ── Product pages, grouped by category ─────────────────────────────
  const byCategory = new Map<string, CatalogProduct[]>();
  for (const p of products) {
    const key = p.category?.name ?? 'Other';
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key)!.push(p);
  }

  let pageNum = 1;
  function newPage(): number {
    page = pdf.addPage([PAGE_W, PAGE_H]);
    pageNum += 1;
    page.drawText(`KORIX LLC Product Catalog  ·  ${dateStr}`, { x: MARGIN, y: 30, size: 8, font: helv, color: GRAY });
    const label = `Page ${pageNum}`;
    page.drawText(label, {
      x: PAGE_W - MARGIN - helv.widthOfTextAtSize(label, 8),
      y: 30,
      size: 8,
      font: helv,
      color: GRAY,
    });
    return PAGE_H - MARGIN;
  }

  function ensureSpace(needed: number) {
    if (y - needed < 60) y = newPage();
  }

  for (const [categoryName, items] of byCategory) {
    y = newPage();
    page.drawRectangle({ x: 0, y: PAGE_H - 70, width: PAGE_W, height: 70, color: NAVY });
    page.drawText(categoryName, { x: MARGIN, y: PAGE_H - 46, size: 22, font: helvBold, color: WHITE });
    y = PAGE_H - 100;

    for (const item of items) {
      const priceLine = currency(Number(item.base_price));
      const nameLines = wrapText(item.name, helvBold, 12.5, CONTENT_W - 100);
      const descLines = item.short_description ? wrapText(item.short_description, helv, 9.5, CONTENT_W - 20) : [];
      const specLine = item.product_specs
        .filter((s) => s.spec_name !== 'Federal Supply Class (PSC)')
        .map((s) => `${s.spec_name}: ${s.spec_value}`)
        .join('   ·   ');
      const specLines = specLine ? wrapText(specLine, helv, 8.5, CONTENT_W - 20) : [];
      const pscSpec = item.product_specs.find((s) => s.spec_name === 'Federal Supply Class (PSC)');
      const tiers = item.product_price_tiers.slice().sort((a, b) => a.min_quantity - b.min_quantity);
      const tierLine = tiers.length
        ? 'Bulk pricing: ' + tiers.map((t) => `${t.min_quantity}+ @ ${currency(Number(t.unit_price))}`).join('   ·   ')
        : null;

      const blockHeight =
        18 +
        nameLines.length * 15 +
        descLines.length * 13 +
        specLines.length * 12 +
        (tierLine ? 13 : 0) +
        (pscSpec ? 12 : 0) +
        18;
      ensureSpace(blockHeight);

      const blockTop = y;
      for (const line of nameLines) {
        page.drawText(line, { x: MARGIN, y, size: 12.5, font: helvBold, color: NAVY });
        y -= 15;
      }
      page.drawText(priceLine, {
        x: PAGE_W - MARGIN - helvBold.widthOfTextAtSize(priceLine, 13),
        y: blockTop,
        size: 13,
        font: helvBold,
        color: ACCENT,
      });
      const skuLabel = `SKU ${item.sku}`;
      page.drawText(skuLabel, {
        x: PAGE_W - MARGIN - helv.widthOfTextAtSize(skuLabel, 8),
        y: blockTop - 15,
        size: 8,
        font: helv,
        color: GRAY,
      });

      for (const line of descLines) {
        page.drawText(line, { x: MARGIN, y, size: 9.5, font: helv, color: NAVY_LIGHT });
        y -= 13;
      }
      for (const line of specLines) {
        page.drawText(line, { x: MARGIN, y, size: 8.5, font: helvOblique, color: GRAY });
        y -= 12;
      }
      if (tierLine) {
        page.drawText(tierLine, { x: MARGIN, y, size: 8.5, font: helv, color: NAVY_LIGHT });
        y -= 13;
      }
      if (pscSpec) {
        page.drawText(`PSC ${pscSpec.spec_value}`, { x: MARGIN, y, size: 8, font: helv, color: GRAY });
        y -= 12;
      }

      y -= 6;
      page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 0.5, color: LIGHT_GRAY });
      y -= 12;
    }
  }

  const bytes = await pdf.save();

  return new Response(bytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="KORIX-LLC-Product-Catalog.pdf"',
      'Cache-Control': 'public, max-age=3600',
    },
  });
});
