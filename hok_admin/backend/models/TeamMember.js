import mongoose from "../db/postgresAdapter.js";

const teamMemberSchema = new mongoose.Schema(
  {
    personId: { type: String, required: true, unique: true, trim: true },
    adminId: { type: String, default: null },
    fullName: { type: String, required: true, trim: true },
    shownOnRecordsAs: { type: String, required: true, trim: true },
    olderSpellings: { type: [String], default: [] },
    roleId: { type: String, required: true, trim: true },
    // Spec 3.4: Active, Invited, Suspended (displayed as Paused), Left
    status: { type: String, default: "Active" },
    workEmail: { type: String, required: true, lowercase: true, trim: true },
    whatsappNumber: { type: String, default: "" },
    addedAt: { type: String, default: null },
    addedBy: { type: String, default: null },
    invitedAt: { type: String, default: null },
    inviteToken: { type: String, default: null },
    inviteExpiresAt: { type: String, default: null },
    joinedAt: { type: String, default: null },
    lastActiveAt: { type: String, default: null },
    pausedSince: { type: String, default: null },
    leftOn: { type: String, default: null },
    hasSignedInOnce: { type: Boolean, default: false },
  },
  { timestamps: true, strict: false },
);

export default mongoose.model("TeamMember", teamMemberSchema);
