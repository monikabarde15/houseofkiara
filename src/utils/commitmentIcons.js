// src/utils/commitmentIcons.js
import {
  Recycle,
  Gem,
  Wallet,
  Infinity as InfinityIcon,
  Shield,
  Heart,
  Sparkles,
  RefreshCw,
  Award,
  Leaf,
  CheckCircle,
  Clock,
  Layers,
  HelpCircle,
} from "lucide-react";

export function resolveCommitmentIcon(icon) {
  if (!icon) return Recycle;
  if (typeof icon === "function" || (typeof icon === "object" && icon !== null && "$$typeof" in icon)) {
    return icon;
  }

  const name = String(icon).toLowerCase().trim();
  switch (name) {
    case "recycle":
      return Recycle;
    case "refresh":
    case "refreshcw":
    case "loop":
      return RefreshCw;
    case "gem":
    case "diamond":
      return Gem;
    case "wallet":
    case "card":
    case "creditcard":
    case "money":
    case "payout":
      return Wallet;
    case "infinity":
    case "infinityicon":
      return InfinityIcon;
    case "shield":
    case "integrity":
    case "safe":
    case "security":
      return Shield;
    case "heart":
    case "love":
    case "care":
      return Heart;
    case "sparkles":
    case "spark":
    case "magic":
      return Sparkles;
    case "leaf":
    case "eco":
    case "sustainability":
      return Leaf;
    case "award":
    case "badge":
    case "star":
      return Award;
    case "check":
    case "checkcircle":
      return CheckCircle;
    case "clock":
    case "time":
      return Clock;
    case "layers":
      return Layers;
    default:
      return Recycle;
  }
}
