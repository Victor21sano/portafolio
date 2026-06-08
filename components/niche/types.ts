import type { Business, Service, Slot } from "@/lib/types";
import type { NicheDesign } from "@/lib/niche-design";

export type NicheLayoutProps = {
  business: Business;
  services: Service[];
  selectedService: Service | null;
  selectedDate: string;
  slots: Slot[];
  design: NicheDesign;
  appointmentName: string;
};
