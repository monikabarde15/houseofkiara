import React, { useState } from 'react';
import './GoogleRegion.css';
import { Field } from '../../shared/Field/Field';
import { PillToggle } from '../../shared/PillToggle/PillToggle';
import { PointerPicker } from '../../shared/PointerPicker/PointerPicker';

interface DeveloperSetupGroupProps {
  devSettings: {
    titleTemplate: string;
    separator: string;
    canonicalAddress: string;
    publishSitemap: boolean;
  };
  onChange: (updated: {
    titleTemplate: string;
    separator: string;
    canonicalAddress: string;
    publishSitemap: boolean;
  }) => void;
}

export const DeveloperSetupGroup: React.FC<DeveloperSetupGroupProps> = ({
  devSettings,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pointerTarget, setPointerTarget] = useState<HTMLElement | null>(null);

  const handlePointerSelect = (code: string) => {
    const newTemplate = devSettings.titleTemplate ? `${devSettings.titleTemplate} ${code}` : code;
    onChange({ ...devSettings, titleTemplate: newTemplate });
  };

  return (
    <div className="hok-dev-group-box">
      <div
        className="hok-dev-group-header"
        onClick={() => setIsOpen(!isOpen)}
        data-hint="Reveals or collapses the developer settings on the Google region"
      >
        <span className="hok-dev-group-title">
          Set up once — your developer handles these
        </span>
        <button type="button" className="hok-dev-group-action">
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </div>

      {isOpen && (
        <div className="hok-dev-group-body">
          {/* Boxed statement */}
          <div className="hok-dev-explanation-statement">
            Each page puts its own name first, then a separator, then the site name.{' '}
            <strong>Rent Designer Occasion Wear — House of Kaira</strong>
          </div>

          {/* Title Template */}
          <div id="google-title-template">
            <Field
              label="The template behind it"
              hints={[
                'Prints: Rent Designer Occasion Wear — House of Kaira { }',
                'Only the words in double braces are swapped out. Leave it alone unless the shape of every title needs to change.'
              ]}
              onPointerClick={(elem) => setPointerTarget(elem)}
            >
              <input
                type="text"
                className="hok-field-input"
                value={devSettings.titleTemplate}
                onChange={(e) =>
                  onChange({ ...devSettings, titleTemplate: e.target.value })
                }
              />
            </Field>
          </div>

          {/* Separator */}
          <Field
            label="Separator"
            hints="The mark between the two halves. The storefront currently mixes a dash and a dot."
          >
            <select
              className="hok-field-select"
              value={devSettings.separator}
              onChange={(e) =>
                onChange({ ...devSettings, separator: e.target.value })
              }
            >
              <option value="—">—</option>
              <option value="·">·</option>
              <option value="|">|</option>
              <option value="–">–</option>
            </select>
          </Field>

          {/* Canonical address */}
          <div id="google-canonical-address">
            <Field
              label="The site’s real address"
              hints="Set at launch. Tells Google which address is the true one when a page can be reached more than one way."
            >
              <input
                type="text"
                className="hok-field-input"
                value={devSettings.canonicalAddress}
                onChange={(e) =>
                  onChange({ ...devSettings, canonicalAddress: e.target.value })
                }
              />
            </Field>
          </div>

          {/* Publish sitemap */}
          <div id="google-sitemap">
            <PillToggle
              checked={devSettings.publishSitemap}
              onChange={(checked) =>
                onChange({ ...devSettings, publishSitemap: checked })
              }
              label="Publish sitemap.xml"
            />
          </div>
        </div>
      )}

      {/* Pointer Picker */}
      {pointerTarget && (
        <PointerPicker
          targetElement={pointerTarget}
          onSelect={handlePointerSelect}
          onClose={() => setPointerTarget(null)}
        />
      )}
    </div>
  );
};
