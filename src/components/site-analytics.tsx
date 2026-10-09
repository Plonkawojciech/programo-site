import AnalyticsTracker from "@/components/analytics-tracker";
import WebVitals from "@/components/web-vitals";
import MetaPixel from "@/components/meta-pixel";

// Server composition: these client components still mount inside Providers.
export default function SiteAnalytics() {
  return <><AnalyticsTracker /><WebVitals /><MetaPixel /></>;
}
