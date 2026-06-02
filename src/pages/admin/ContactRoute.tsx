import ContactPanel from "./panels/ContactPanel";
import { useAdminContext } from "../../context/AdminContext";
export default function ContactRoute() {
  const { siteContent, updateContent } = useAdminContext();
  return <ContactPanel contact={siteContent.contact} onChange={(v) => updateContent("contact", v)} />;
}
