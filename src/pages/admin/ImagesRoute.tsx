import ImagesPanel from "./panels/ImagesPanel";
import { useAdminContext } from "../../context/AdminContext";
export default function ImagesRoute() {
  const { siteContent, updateContent } = useAdminContext();
  return <ImagesPanel images={siteContent.images} onChange={(v) => updateContent("images", v)} />;
}
