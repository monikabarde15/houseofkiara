import {
  Search,
  MapPin,
  Truck,
  Heart,
  Camera,
  BadgeCheck,
  Wallet,
  Clock,
  RefreshCw,
  Tag,
  Sparkles,
  HelpCircle,
} from "lucide-react";

export function resolveHowItWorksIcon(icon) {
  if (!icon) return Search;
  if (typeof icon === "function" || typeof icon === "object") {
    return icon;
  }

  const name = String(icon).toLowerCase().trim();
  switch (name) {
    case "search":
      return Search;
    case "pin":
    case "mappin":
    case "location":
      return MapPin;
    case "box":
    case "truck":
    case "delivery":
    case "package":
      return Truck;
    case "heart":
    case "like":
      return Heart;
    case "camera":
    case "photo":
      return Camera;
    case "users":
    case "check":
    case "badge":
    case "badgecheck":
    case "shield":
      return BadgeCheck;
    case "card":
    case "wallet":
    case "payout":
    case "money":
      return Wallet;
    case "clock":
    case "time":
      return Clock;
    case "refresh":
    case "recycle":
      return RefreshCw;
    case "tag":
      return Tag;
    case "spark":
    case "gem":
    case "infinity":
      return Sparkles;
    default:
      return Search;
  }
}
