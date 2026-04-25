import { getSiteData } from '@/lib/db';
import { DEFAULT_CONTENT, DEFAULT_PHOTOS, DEFAULT_NEWS, DEFAULT_CAREERS, DEFAULT_SETTINGS, type SiteData } from '@/lib/defaults';
import MainSite from './components/MainSite';

export const dynamic = 'force-dynamic';

const fallback: SiteData = {
  content:  DEFAULT_CONTENT,
  photos:   DEFAULT_PHOTOS,
  news:     DEFAULT_NEWS.map((n, i)  => ({ ...n, id: i + 1 })),
  careers:  DEFAULT_CAREERS.map((c, i) => ({ ...c, id: i + 1 })),
  settings: DEFAULT_SETTINGS,
};

export default async function Page() {
  let data: SiteData = fallback;
  try {
    data = await getSiteData();
  } catch (e) {
    console.error('[TopCrop] getSiteData failed:', e);
  }
  return <MainSite initialData={data} />;
}
