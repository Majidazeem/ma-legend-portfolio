import Portfolio from "@/components/Portfolio";
import { getPortfolioData } from "@/lib/data";
export const revalidate = 0;
export default async function Home() { const data = await getPortfolioData(); return <Portfolio initialData={data}/>; }
