import SponsorsAdminPanel from "./panels/SponsorsAdminPanel";
import { useAdminContext } from "../../context/AdminContext";
export default function SponsorsRoute() {
  const { siteContent, updateContent } = useAdminContext();
  return (
    <SponsorsAdminPanel
      sponsors={siteContent.sponsors || []}
      onChangeSponsors={(v) => updateContent("sponsors", v)}
      footer={siteContent.footer}
      onChange={(v) => updateContent("footer", v)}
    />
  );
}
