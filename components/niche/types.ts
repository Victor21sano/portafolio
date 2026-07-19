import type { BarberInfo, Business, Service, Slot } from "@/lib/types";
import type { NicheDesign } from "@/lib/niche-design";

export type NicheLayoutProps = {
  business: Business;
  services: Service[];
  selectedService: Service | null;
  selectedDate: string;
  slots: Slot[];
  design: NicheDesign;
  appointmentName: string;
  /** Barberos/staff reales (branding_json.barberos). Si existen, elegir es obligatorio. */
  barbers?: BarberInfo[];
  /** staff_id elegido (validado contra barbers). */
  selectedBarber?: string;
};
