import { useState, useEffect } from "react";
import {
  getRegionalSettings,
  defaultRegionalConfig,
  formatPriceWithConfig,
  formatRegionalDate,
  getCurrencySymbol,
} from "../services/regionalApi";

export function useRegionalSettings() {
  const [regional, setRegional] = useState(defaultRegionalConfig);

  useEffect(() => {
    let isMounted = true;
    getRegionalSettings().then((cfg) => {
      if (isMounted && cfg) {
        setRegional(cfg);
      }
    });

    const handleUpdate = () => {
      getRegionalSettings(true).then((cfg) => {
        if (isMounted && cfg) {
          setRegional(cfg);
        }
      });
    };

    window.addEventListener("hok_regional_updated", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("hok_regional_updated", handleUpdate);
    };
  }, []);

  return {
    ...regional,
    currencySymbol: regional.currencySymbol || getCurrencySymbol(regional),
    formatPrice: (amount) => formatPriceWithConfig(amount, regional),
    formatDate: (date) => formatRegionalDate(date, regional),
  };
}

export default useRegionalSettings;
