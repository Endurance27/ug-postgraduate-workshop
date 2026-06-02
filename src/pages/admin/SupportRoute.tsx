import SupportAdminPanel from "./panels/SupportAdminPanel";
import { useAdminContext } from "../../context/AdminContext";
export default function SupportRoute() {
  const { siteContent, updateContent } = useAdminContext();
  return (
    <SupportAdminPanel
      contact={siteContent.contact}
      onChange={(v) => updateContent("contact", v)}
      faqs={siteContent.faqs || []}
      onChangeFaqs={(v) => updateContent("faqs", v)}
    />
  );
}
