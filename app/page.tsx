import { getSiteData } from '@/lib/db';
import MainSite from './components/MainSite';

export const revalidate = 0;

export default async function Page() {
  const data = await getSiteData();
  return <MainSite initialData={data} />;
}
