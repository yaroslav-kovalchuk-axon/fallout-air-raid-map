import PipBoyFrame from "@/components/layout/PipBoyFrame";
import UkraineMap from "@/components/map/UkraineMap";
import { getAlertedRegionIds } from "@/data/mockAlerts";

export default function MapPage() {
  const alertedRegions = getAlertedRegionIds();

  return (
    <PipBoyFrame activeTab="map">
      <UkraineMap alertedRegions={alertedRegions} />
    </PipBoyFrame>
  );
}
