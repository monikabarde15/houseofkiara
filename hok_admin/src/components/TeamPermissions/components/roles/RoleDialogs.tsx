import React, { useEffect, useRef, useState } from "react";
import { RoleRecord } from "../../types";
import { TpDialog } from "../SharedPrimitives";
import { validateRoleNameUnique } from "./RolesUtils";

export const RenameDescribeRoleDialog: React.FC<{
  open: boolean;
  role: RoleRecord | null;
  draftRoles: RoleRecord[];
  onConfirm: (name: string, description: string) => void;
  onClose: () => void;
}> = ({ open, role, draftRoles, onConfirm, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !role) return;
    setName(role.name);
    setDescription(role.description || "");
    setError(null);
  }, [open, role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    const err = validateRoleNameUnique(name, draftRoles, role.roleId);
    if (err) {
      setError(err);
      return;
    }
    onConfirm(name.trim(), description.trim());
    onClose();
  };

  return (
    <TpDialog open={open} onClose={onClose} title="Rename or describe">
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <div>
          <label className="block text-[12.5px] font-medium text-[#1A1612] mb-1.5">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            className={`tp-input ${error ? "has-error" : ""}`}
          />
          {error && <p className="tp-field-error">{error}</p>}
        </div>

        <div>
          <label className="block text-[12.5px] font-medium text-[#1A1612] mb-1.5">
            What this person does
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="tp-textarea"
          />
          <p className="tp-field-hint">
            Shown when you invite someone and choose this role.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-1">
          <button type="button" onClick={onClose} className="tp-btn-outline">
            Cancel
          </button>
          <button type="submit" className="tp-btn-gold">
            Done
          </button>
        </div>
      </form>
    </TpDialog>
  );
};

export const NewRoleDialog: React.FC<{
  open: boolean;
  draftRoles: RoleRecord[];
  onConfirm: (
    name: string,
    copyFromRoleId: string | null,
    description: string,
  ) => Promise<void> | void;
  onClose: () => void;
}> = ({ open, draftRoles, onConfirm, onClose }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startFrom, setStartFrom] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const copyableRoles = draftRoles.filter(
    (r) => !r.archived && !r.isFixed && r.roleId !== "founder",
  );

  useEffect(() => {
    if (!open) return;
    setName("");
    setDescription("");
    setStartFrom("");
    setError(null);
    setSaving(false);
    const t = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => window.clearTimeout(t);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const err = validateRoleNameUnique(name, draftRoles);
    if (err) {
      setError(err);
      return;
    }
    setSaving(true);
    try {
      await onConfirm(name.trim(), startFrom || null, description.trim());
      onClose();
    } catch (submitErr: any) {
      setError(submitErr?.message || "Could not add role. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <TpDialog open={open} onClose={onClose} title="New role">
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <div>
          <label className="block text-[12.5px] font-medium text-[#1A1612] mb-1.5">
            Name
          </label>
          <input
            ref={inputRef}
            type="text"
            placeholder="For example, Social Media Executive"
            value={name}
            disabled={saving}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            className={`tp-input ${error ? "has-error" : ""}`}
          />
          {error && <p className="tp-field-error">{error}</p>}
        </div>

        <div>
          <label className="block text-[12.5px] font-medium text-[#1A1612] mb-1.5">
            Start from
          </label>
          <select
            value={startFrom}
            disabled={saving}
            onChange={(e) => setStartFrom(e.target.value)}
            className="tp-select"
          >
            <option value="">Nothing open yet</option>
            {copyableRoles.map((r) => (
              <option key={r.roleId} value={r.roleId}>
                A copy of {r.name}
              </option>
            ))}
          </select>
          <p className="tp-field-hint">
            You can change every cell afterwards.
          </p>
        </div>

        <div>
          <label className="block text-[12.5px] font-medium text-[#1A1612] mb-1.5">
            What this person does (optional)
          </label>
          <textarea
            rows={2}
            placeholder="Shown when you invite someone and choose this role"
            value={description}
            disabled={saving}
            onChange={(e) => setDescription(e.target.value)}
            className="tp-textarea"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="tp-btn-outline"
          >
            Cancel
          </button>
          <button type="submit" disabled={saving} className="tp-btn-gold">
            {saving ? "Adding..." : "Add role"}
          </button>
        </div>
      </form>
    </TpDialog>
  );
};

export const ArchivedRolesDialog: React.FC<{
  open: boolean;
  archivedRoles: RoleRecord[];
  onBringBack: (roleId: string) => void;
  onClose: () => void;
}> = ({ open, archivedRoles, onBringBack, onClose }) => {
  return (
    <TpDialog open={open} onClose={onClose} title="Archived roles">
      <p className="tp-dialog-body mb-4">
        Nobody holds these and nobody can be given them. Bring one back to use
        it again.
      </p>

      <div className="divide-y divide-[#EFE7DA] border-t border-b border-[#EFE7DA]">
        {archivedRoles.map((r) => (
          <div
            key={r.roleId}
            className="flex items-start justify-between gap-4 py-3.5"
          >
            <div className="min-w-0">
              <div className="text-[13.5px] font-semibold text-[#1A1612]">
                {r.name}
              </div>
              {r.description && (
                <p className="text-[12.5px] text-[#5C5248] mt-0.5">
                  {r.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                onBringBack(r.roleId);
                onClose();
              }}
              className="tp-btn-outline shrink-0"
            >
              Bring back
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-5">
        <button type="button" onClick={onClose} className="tp-btn-gold">
          Close
        </button>
      </div>
    </TpDialog>
  );
};
