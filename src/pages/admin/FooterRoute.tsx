import FooterPanel from "./panels/FooterPanel";
import { useAdminContext } from "../../context/AdminContext";
export default function FooterRoute() {
  const { siteContent, updateContent } = useAdminContext();
  return <FooterPanel footer={siteContent.footer} onChange={(v) => updateContent("footer", v)} />;
}
