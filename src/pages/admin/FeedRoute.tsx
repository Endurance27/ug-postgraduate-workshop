import FeedPanel from "./panels/FeedPanel";
import { useAdminContext } from "../../context/AdminContext";
export default function FeedRoute() {
  const { siteContent, updateContent } = useAdminContext();
  return <FeedPanel feed={siteContent.feed || []} onChange={(v) => updateContent("feed", v)} />;
}
