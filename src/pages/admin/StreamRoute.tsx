import StreamPanel from "./panels/StreamPanel";
import { useAdminContext } from "../../context/AdminContext";
export default function StreamRoute() {
  const { siteContent, updateContent } = useAdminContext();
  return <StreamPanel stream={siteContent.stream} onChange={(v) => updateContent("stream", v)} />;
}
