import AwardsPanel from "./panels/AwardsPanel";
import { useAdminContext } from "../../context/AdminContext";
export default function AwardsRoute() {
  const { siteContent, updateContent } = useAdminContext();
  return (
    <AwardsPanel
      awards={siteContent.awards}
      onChange={(v) => updateContent("awards", v)}
      pastWinners={siteContent.pastWinners || []}
      onChangePastWinners={(v) => updateContent("pastWinners", v)}
    />
  );
}
