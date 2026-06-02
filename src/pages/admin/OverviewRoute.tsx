import OverviewPanel from "./panels/OverviewPanel";
import { useAdminContext } from "../../context/AdminContext";
export default function OverviewRoute() {
  const { siteContent, updateContent } = useAdminContext();
  return <OverviewPanel siteContent={siteContent} updateContent={updateContent} />;
}
