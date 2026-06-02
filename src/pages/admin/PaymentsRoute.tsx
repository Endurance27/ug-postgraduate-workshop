import PaymentTrackingPanel from "./panels/PaymentTrackingPanel";
import { useAdminContext } from "../../context/AdminContext";
export default function PaymentsRoute() {
  const { siteContent, updateContent } = useAdminContext();
  return (
    <PaymentTrackingPanel
      payments={siteContent.payments || []}
      fee={siteContent.event?.fee || 100}
      onChange={(v) => updateContent("payments", v)}
    />
  );
}
