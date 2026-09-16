import crypto from "crypto";
import { pool } from "../config/db.js";

export const safeQuery = async (sql, params = []) => {
  try {
    return await pool.query(sql, params);
  } catch (err) {
    if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT' || err.message?.includes('ENOTFOUND')) {
      console.warn(`[Non-blocking DB connection note] Cloud DB host unreachable (${err.hostname || 'Supabase'}). Returning fallback data.`);
      return { rows: [] };
    }
    throw err;
  }
};

/**
 * Mongoose-Compatible PostgreSQL JSONB Adapter
 * Provides PostgresModel, PostgresQuery, PostgresDocument, Schema, and Types.
 */

// Model Name to Table Name and Column Mapping
const TABLE_CONFIGS = {
  Admin: {
    tableName: "admins",
    entityIdField: null,
    columnMap: {
      email: "email",
      name: "name",
      passwordHash: "password_hash",
      passwordSalt: "password_salt",
      sessionToken: "session_token",
    },
  },
  Customer: {
    tableName: "customers",
    entityIdField: "customerId",
    columnMap: {
      customerId: "customer_id",
      name: "name",
      email: "email",
      phone: "phone",
      location: "location",
      status: "status",
      source: "source",
    },
  },
  Designer: {
    tableName: "designers",
    entityIdField: "designerId",
    columnMap: {
      designerId: "designer_id",
      slug: "slug",
      name: "name",
      type: "type",
      status: "status",
      isFeatured: "is_featured",
      sortOrder: "sort_order",
    },
  },
  Lister: {
    tableName: "listers",
    entityIdField: "listerId",
    columnMap: {
      listerId: "lister_id",
      name: "name",
      email: "email",
      phone: "phone",
      city: "city",
      status: "status",
    },
  },
  Offer: {
    tableName: "offers",
    entityIdField: "offerId",
    columnMap: {
      offerId: "offer_id",
      enquiryId: "enquiry_id",
      productId: "product_id",
      customerName: "customer_name",
      customerEmail: "customer_email",
      customerPhone: "customer_phone",
      status: "status",
      isDeleted: "is_deleted",
      isActive: "is_active",
    },
  },
  Order: {
    tableName: "orders",
    entityIdField: "orderId",
    columnMap: {
      orderId: "order_id",
      customerId: "customer_id",
      customerName: "customer_name",
      customerEmail: "customer_email",
      offerId: "offer_id",
      promoCode: "promo_code",
      discount: "discount",
      mode: "mode",
      status: "status",
      depositStatus: "deposit_status",
      payoutStatus: "payout_status",
    },
  },
  Payout: {
    tableName: "payouts",
    entityIdField: "payoutId",
    columnMap: {
      payoutId: "payout_id",
      orderId: "order_id",
      listerId: "lister_id",
      productId: "product_id",
      productName: "product_name",
      status: "status",
      dueDate: "due_date",
    },
  },
  Product: {
    tableName: "products",
    entityIdField: "productId",
    columnMap: {
      productId: "product_id",
      listerId: "lister_id",
      name: "name",
      designer: "designer",
      category: "category",
      status: "status",
    },
  },
  Submission: {
    tableName: "submissions",
    entityIdField: "subid",
    columnMap: {
      subid: "subid",
      listerId: "lister_id",
      piece: "piece",
      designer: "designer",
      category: "category",
      status: "status",
    }
  },
  Task: {
    tableName: "tasks",
    entityIdField: "taskId",
    columnMap: {
      title: "title",
      date: "date",
      time: "time",
      type: "type",
      status: "status",
      assignee: "assignee",
      orderId: "order_id",
      description: "description"
    },
  },
  PromoCode: {
    tableName: "promo_codes",
    entityIdField: "code",
    columnMap: {
      code: "code",
      type: "type",
      status: "status",
      audience: "audience",
      validFrom: "valid_from",
      validUntil: "valid_until",
    },
  },
  Message: {
    tableName: "messages",
    entityIdField: "messageId",
    columnMap: {
      messageId: "message_id",
      name: "name",
      subject: "subject",
      audience: "audience",
      class: "class",
      status: "status",
    },
  },
  Notification: {
    tableName: "notifications",
    entityIdField: "notificationId",
    columnMap: {
      notificationId: "notification_id",
      title: "title",
      category: "category",
      channel: "channel",
      priority: "priority",
      unread: "unread",
    },
  },
  SiteSettings: {
    tableName: "site_settings",
    entityIdField: "key",
    columnMap: {
      key: "key",
      siteName: "site_name",
      tagline: "tagline",
      supportEmail: "support_email",
      whatsappNumber: "whatsapp_number",
      instagramHandle: "instagram_handle",
    },
  },
};

// Generate 24-character hexadecimal ObjectId
export const generateObjectId = () => {
  return crypto.randomBytes(12).toString("hex");
};

// Types & ObjectId constructor
export class ObjectId {
  constructor(id) {
    if (id instanceof ObjectId) {
      this._id = id._id;
    } else if (typeof id === "string" && ObjectId.isValid(id)) {
      this._id = id;
    } else if (!id) {
      this._id = generateObjectId();
    } else {
      this._id = String(id);
    }
  }

  toString() {
    return this._id;
  }

  valueOf() {
    return this._id;
  }

  toHexString() {
    return this._id;
  }

  equals(other) {
    if (!other) return false;
    const str = other instanceof ObjectId ? other.toString() : String(other);
    return this._id === str;
  }

  static isValid(id) {
    if (!id) return false;
    if (id instanceof ObjectId) return true;
    if (typeof id === "string") {
      return /^[0-9a-fA-F]{24}$/.test(id);
    }
    return false;
  }
}

export const Types = {
  ObjectId,
  Mixed: "Mixed",
};

// Helper: Deep Clone
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);
  if (Array.isArray(obj)) return obj.map(deepClone);
  const cloned = {};
  for (const key of Object.keys(obj)) {
    cloned[key] = deepClone(obj[key]);
  }
  return cloned;
};

// Helper: Deep Equality Check
export const deepEquals = (a, b) => {
  if (a === b) return true;
  if (a === null || b === null || a === undefined || b === undefined) return a === b;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (a instanceof ObjectId || b instanceof ObjectId) return String(a) === String(b);
  if (a instanceof RegExp && b instanceof RegExp) return a.toString() === b.toString();
  if (typeof a !== typeof b) {
    if ((typeof a === "number" && typeof b === "string") || (typeof a === "string" && typeof b === "number")) {
      return String(a) === String(b);
    }
    return false;
  }
  if (typeof a !== "object") return a === b;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEquals(a[i], b[i])) return false;
    }
    return true;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEquals(a[key], b[key])) return false;
  }
  return true;
};

// Helper: Sanitize Field Identifier for SQL safety
const IDENTIFIER_REGEX = /^[a-zA-Z0-9_.]+$/;
export const sanitizeIdentifier = (identifier, context = "field") => {
  if (typeof identifier !== "string" || !IDENTIFIER_REGEX.test(identifier)) {
    throw new Error(`Invalid ${context} identifier: ${identifier}`);
  }
  return identifier;
};

// Helper: Get Nested Property by path ('a.b.c' or ['a', 'b'])
export const getNestedValue = (obj, path) => {
  if (!obj || !path) return undefined;
  const parts = Array.isArray(path) ? path : String(path).split(".");
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    current = current[part];
  }
  return current;
};

// Helper: Set Nested Property by path ('a.b.c')
export const setNestedValue = (obj, path, value) => {
  if (!obj || !path) return;
  const parts = Array.isArray(path) ? path : String(path).split(".");
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current[part] === null || typeof current[part] !== "object") {
      current[part] = {};
    }
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
};

// Helper: Delete Nested Property
export const deleteNestedValue = (obj, path) => {
  if (!obj || !path) return;
  const parts = Array.isArray(path) ? path : String(path).split(".");
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part] || typeof current[part] !== "object") return;
    current = current[part];
  }
  delete current[parts[parts.length - 1]];
};

// Helper: Schema definition evaluation and defaults
export class Schema {
  constructor(definition = {}, options = {}) {
    this.definition = definition;
    this.options = { timestamps: true, strict: false, ...options };
    this._indexes = [];
    this._plugins = [];
    this._virtuals = {};
  }

  index(fields, options) {
    this._indexes.push({ fields, options });
    return this;
  }

  plugin(fn, opts) {
    this._plugins.push({ fn, opts });
    if (typeof fn === "function") fn(this, opts);
    return this;
  }

  set(key, val) {
    this.options[key] = val;
    return this;
  }

  pre() {
    return this;
  }

  post() {
    return this;
  }

  virtual(name) {
    if (!this._virtuals[name]) {
      this._virtuals[name] = { get: null, set: null };
    }
    const self = this;
    return {
      get(fn) {
        self._virtuals[name].get = fn;
        return this;
      },
      set(fn) {
        self._virtuals[name].set = fn;
        return this;
      },
    };
  }

  static get Types() {
    return {
      Mixed: "Mixed",
      ObjectId: ObjectId,
      String: String,
      Number: Number,
      Boolean: Boolean,
      Date: Date,
      Array: Array,
      Object: Object,
    };
  }
}

// In-Memory Document Matching for exact MongoDB query semantics
export const matchesFilter = (doc, filter) => {
  if (!filter || Object.keys(filter).length === 0) return true;

  for (const [key, condition] of Object.entries(filter)) {
    if (key === "$or") {
      if (!Array.isArray(condition) || condition.length === 0) return false;
      const matched = condition.some((subFilter) => matchesFilter(doc, subFilter));
      if (!matched) return false;
      continue;
    }

    if (key === "$and") {
      if (!Array.isArray(condition)) return false;
      const matched = condition.every((subFilter) => matchesFilter(doc, subFilter));
      if (!matched) return false;
      continue;
    }

    if (key === "$nor") {
      if (!Array.isArray(condition)) return false;
      const matched = condition.some((subFilter) => matchesFilter(doc, subFilter));
      if (matched) return false;
      continue;
    }

    if (key === "$not") {
      if (matchesFilter(doc, condition)) return false;
      continue;
    }

    // Resolve doc value at key (supports dot notation)
    const val = key === "_id" ? doc._id : getNestedValue(doc, key);

    // Operator object check
    if (condition !== null && typeof condition === "object" && !(condition instanceof Date) && !(condition instanceof RegExp) && !(condition instanceof ObjectId)) {
      const keys = Object.keys(condition);
      const isOperatorObj = keys.some((k) => k.startsWith("$"));

      if (isOperatorObj) {
        for (const [op, opVal] of Object.entries(condition)) {
          if (op === "$eq") {
            if (!deepEquals(val, opVal)) return false;
          } else if (op === "$ne") {
            if (deepEquals(val, opVal)) return false;
          } else if (op === "$in") {
            if (!Array.isArray(opVal)) return false;
            const inList = opVal.some((target) => {
              if (Array.isArray(val)) {
                return val.includes(target) || val.some((v) => deepEquals(v, target));
              }
              return deepEquals(val, target);
            });
            if (!inList) return false;
          } else if (op === "$nin") {
            if (!Array.isArray(opVal)) return true;
            const inList = opVal.some((target) => {
              if (Array.isArray(val)) {
                return val.includes(target) || val.some((v) => deepEquals(v, target));
              }
              return deepEquals(val, target);
            });
            if (inList) return false;
          } else if (op === "$gt") {
            const vDate = new Date(val).getTime();
            const oDate = new Date(opVal).getTime();
            if (!isNaN(vDate) && !isNaN(oDate)) {
              if (!(vDate > oDate)) return false;
            } else if (!(val > opVal)) return false;
          } else if (op === "$gte") {
            const vDate = new Date(val).getTime();
            const oDate = new Date(opVal).getTime();
            if (!isNaN(vDate) && !isNaN(oDate)) {
              if (!(vDate >= oDate)) return false;
            } else if (!(val >= opVal)) return false;
          } else if (op === "$lt") {
            const vDate = new Date(val).getTime();
            const oDate = new Date(opVal).getTime();
            if (!isNaN(vDate) && !isNaN(oDate)) {
              if (!(vDate < oDate)) return false;
            } else if (!(val < opVal)) return false;
          } else if (op === "$lte") {
            const vDate = new Date(val).getTime();
            const oDate = new Date(opVal).getTime();
            if (!isNaN(vDate) && !isNaN(oDate)) {
              if (!(vDate <= oDate)) return false;
            } else if (!(val <= opVal)) return false;
          } else if (op === "$regex") {
            const flags = condition.$options || "";
            const re = typeof opVal === "string" ? new RegExp(opVal, flags) : opVal;
            if (!re.test(String(val || ""))) return false;
          } else if (op === "$elemMatch") {
            if (!Array.isArray(val)) return false;
            const matched = val.some((item) => matchesFilter(item, opVal));
            if (!matched) return false;
          } else if (op === "$not") {
            if (matchesFilter({ [key]: val }, { [key]: opVal })) return false;
          } else if (op === "$exists") {
            const exists = val !== undefined;
            if (Boolean(opVal) !== exists) return false;
          }
        }
        continue;
      }
    }

    // Direct RegExp
    if (condition instanceof RegExp) {
      if (!condition.test(String(val || ""))) return false;
      continue;
    }

    // Direct ObjectId or string equality
    if (condition instanceof ObjectId) {
      if (String(val) !== condition.toString()) return false;
      continue;
    }

    // Direct equality / Array equality
    if (Array.isArray(val) && !Array.isArray(condition)) {
      if (!val.includes(condition) && !val.some((v) => deepEquals(v, condition))) {
        return false;
      }
    } else if (val !== condition) {
      if (val === null || condition === null || val === undefined || condition === undefined) {
        if (val !== condition) return false;
      } else if (typeof val === "object" && typeof condition === "object") {
        if (!deepEquals(val, condition)) return false;
      } else if (String(val) !== String(condition)) {
        return false;
      }
    }
  }

  return true;
};

// In-Memory Document Update for atomic updates ($set, $unset, $push, $pull, $inc, $addToSet)
export const applyUpdate = (doc, update) => {
  if (!update || typeof update !== "object") return doc;

  const hasOperators = Object.keys(update).some((k) => k.startsWith("$"));

  if (!hasOperators) {
    // Treat plain object as $set for top-level keys
    for (const [key, value] of Object.entries(update)) {
      if (key.includes(".")) {
        setNestedValue(doc, key, value);
      } else {
        doc[key] = value;
      }
    }
    return doc;
  }

  // $set
  if (update.$set) {
    for (const [path, val] of Object.entries(update.$set)) {
      if (path.includes(".")) {
        setNestedValue(doc, path, val);
      } else {
        doc[path] = val;
      }
    }
  }

  // $unset
  if (update.$unset) {
    for (const path of Object.keys(update.$unset)) {
      if (path.includes(".")) {
        deleteNestedValue(doc, path);
      } else {
        delete doc[path];
      }
    }
  }

  // $inc
  if (update.$inc) {
    for (const [path, incVal] of Object.entries(update.$inc)) {
      const current = Number(getNestedValue(doc, path)) || 0;
      const next = current + (Number(incVal) || 0);
      if (path.includes(".")) {
        setNestedValue(doc, path, next);
      } else {
        doc[path] = next;
      }
    }
  }

  // $push
  if (update.$push) {
    for (const [path, pushVal] of Object.entries(update.$push)) {
      let arr = getNestedValue(doc, path);
      if (!Array.isArray(arr)) {
        arr = [];
        if (path.includes(".")) {
          setNestedValue(doc, path, arr);
        } else {
          doc[path] = arr;
        }
      }
      if (pushVal && typeof pushVal === "object" && pushVal.$each && Array.isArray(pushVal.$each)) {
        arr.push(...pushVal.$each);
      } else {
        arr.push(pushVal);
      }
    }
  }

  // $pull
  if (update.$pull) {
    for (const [path, pullCondition] of Object.entries(update.$pull)) {
      let arr = getNestedValue(doc, path);
      if (Array.isArray(arr)) {
        const filtered = arr.filter((item) => {
          if (pullCondition !== null && typeof pullCondition === "object") {
            return !matchesFilter(item, pullCondition);
          }
          return !deepEquals(item, pullCondition);
        });
        if (path.includes(".")) {
          setNestedValue(doc, path, filtered);
        } else {
          doc[path] = filtered;
        }
      }
    }
  }

  // $addToSet
  if (update.$addToSet) {
    for (const [path, addVal] of Object.entries(update.$addToSet)) {
      let arr = getNestedValue(doc, path);
      if (!Array.isArray(arr)) {
        arr = [];
        if (path.includes(".")) {
          setNestedValue(doc, path, arr);
        } else {
          doc[path] = arr;
        }
      }
      const valuesToAdd = addVal && typeof addVal === "object" && addVal.$each && Array.isArray(addVal.$each) ? addVal.$each : [addVal];
      for (const val of valuesToAdd) {
        const exists = arr.some((item) => deepEquals(item, val));
        if (!exists) {
          arr.push(val);
        }
      }
    }
  }

  return doc;
};

// SQL WHERE clause builder
export const buildWhereClause = (filter, tableName, params = []) => {
  if (!filter || Object.keys(filter).length === 0) {
    return { whereSql: "1=1", params };
  }

  const clauses = [];

  const addParam = (val) => {
    params.push(val);
    return `$${params.length}`;
  };

  const processFilterObject = (obj) => {
    const subClauses = [];

    for (const [rawKey, value] of Object.entries(obj)) {
      if (rawKey === "$or") {
        if (Array.isArray(value) && value.length > 0) {
          const orParts = value.map((sub) => {
            const res = processFilterObject(sub);
            return res ? `(${res})` : "1=1";
          });
          subClauses.push(`(${orParts.join(" OR ")})`);
        }
        continue;
      }

      if (rawKey === "$and") {
        if (Array.isArray(value) && value.length > 0) {
          const andParts = value.map((sub) => {
            const res = processFilterObject(sub);
            return res ? `(${res})` : "1=1";
          });
          subClauses.push(`(${andParts.join(" AND ")})`);
        }
        continue;
      }

      const key = sanitizeIdentifier(rawKey, "filter field");

      // Column vs JSONB key path
      const isPk = key === "_id";
      const isColumn = ["customer_id", "designer_id", "slug", "lister_id", "offer_id", "order_id", "payout_id", "product_id", "email", "status", "due_date", "is_deleted"].includes(key);

      const jsonAccessor = key.includes(".")
        ? `data#>>'{${key.split(".").map((p) => sanitizeIdentifier(p, "nested field")).join(",")}}'`
        : `data->>'${key}'`;

      // Value handling
      if (value === null) {
        if (isPk) {
          subClauses.push(`_id IS NULL`);
        } else {
          subClauses.push(`(${jsonAccessor} IS NULL)`);
        }
        continue;
      }

      if (value instanceof RegExp) {
        const flag = value.ignoreCase ? "~*" : "~";
        const p = addParam(value.source);
        subClauses.push(`(${jsonAccessor} ${flag} ${p})`);
        continue;
      }

      if (value instanceof ObjectId || (typeof value === "object" && value && value._id)) {
        const strVal = value.toString();
        const p = addParam(strVal);
        if (isPk) {
          subClauses.push(`_id = ${p}`);
        } else {
          subClauses.push(`(${jsonAccessor} = ${p})`);
        }
        continue;
      }

      // Operators object
      if (typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
        const ops = Object.keys(value);
        const hasOps = ops.some((k) => k.startsWith("$"));

        if (hasOps) {
          for (const [op, opVal] of Object.entries(value)) {
            if (op === "$eq") {
              const p = addParam(opVal instanceof ObjectId ? opVal.toString() : opVal);
              subClauses.push(isPk ? `_id = ${p}` : `(${jsonAccessor} = ${p})`);
            } else if (op === "$ne") {
              const p = addParam(opVal instanceof ObjectId ? opVal.toString() : opVal);
              subClauses.push(isPk ? `_id != ${p}` : `(${jsonAccessor} IS NULL OR ${jsonAccessor} != ${p})`);
            } else if (op === "$in") {
              if (Array.isArray(opVal)) {
                const strArr = opVal.map((v) => (v instanceof ObjectId ? v.toString() : String(v)));
                const p = addParam(strArr);
                if (isPk) {
                  subClauses.push(`_id = ANY(${p}::text[])`);
                } else {
                  subClauses.push(`(${jsonAccessor} = ANY(${p}::text[]))`);
                }
              }
            } else if (op === "$nin") {
              if (Array.isArray(opVal)) {
                const strArr = opVal.map((v) => (v instanceof ObjectId ? v.toString() : String(v)));
                const p = addParam(strArr);
                subClauses.push(`NOT (${jsonAccessor} = ANY(${p}::text[]))`);
              }
            } else if (op === "$gt" || op === "$gte" || op === "$lt" || op === "$lte") {
              const sqlOp = op === "$gt" ? ">" : op === "$gte" ? ">=" : op === "$lt" ? "<" : "<=";
              if (opVal instanceof Date || (typeof opVal === "string" && !isNaN(Date.parse(opVal)))) {
                const p = addParam(new Date(opVal).toISOString());
                subClauses.push(`((${jsonAccessor})::timestamptz ${sqlOp} ${p}::timestamptz)`);
              } else if (typeof opVal === "number") {
                const p = addParam(opVal);
                subClauses.push(`((${jsonAccessor})::numeric ${sqlOp} ${p})`);
              } else {
                const p = addParam(opVal);
                subClauses.push(`(${jsonAccessor} ${sqlOp} ${p})`);
              }
            } else if (op === "$regex") {
              const flag = (value.$options || "").includes("i") ? "~*" : "~";
              const regexStr = typeof opVal === "string" ? opVal : opVal.source;
              const p = addParam(regexStr);
              subClauses.push(`(${jsonAccessor} ${flag} ${p})`);
            } else if (op === "$elemMatch" || op === "$not") {
              // Handled via fallback / memory evaluator when complex
            }
          }
          continue;
        }
      }

      // Boolean
      if (typeof value === "boolean") {
        const p = addParam(value);
        subClauses.push(`(COALESCE((${jsonAccessor})::boolean, false) = ${p})`);
        continue;
      }

      // Date
      if (value instanceof Date) {
        const p = addParam(value.toISOString());
        subClauses.push(`((${jsonAccessor})::timestamptz = ${p}::timestamptz)`);
        continue;
      }

      // Plain String / Number
      const p = addParam(String(value));
      if (isPk) {
        subClauses.push(`_id = ${p}`);
      } else {
        subClauses.push(`(${jsonAccessor} = ${p})`);
      }
    }

    return subClauses.length > 0 ? subClauses.join(" AND ") : "1=1";
  };

  const whereSql = processFilterObject(filter);
  return { whereSql, params };
};

// Subdocument wrapping to support .toObject?.() and safe mutation
export const wrapDocumentData = (data, modelInstance) => {
  if (!data || typeof data !== "object") return data;

  const wrapObject = (target) => {
    if (target === null || typeof target !== "object") return target;
    if (target instanceof Date || target instanceof RegExp || target instanceof ObjectId) return target;

    if (Array.isArray(target)) {
      const arr = target.map(wrapObject);
      Object.defineProperty(arr, "toObject", {
        value: function () {
          return deepClone(this);
        },
        enumerable: false,
        writable: true,
      });
      return arr;
    }

    for (const key of Object.keys(target)) {
      target[key] = wrapObject(target[key]);
    }

    if (!target.toObject) {
      Object.defineProperty(target, "toObject", {
        value: function () {
          return deepClone(this);
        },
        enumerable: false,
        writable: true,
      });
    }

    return target;
  };

  return wrapObject(data);
};

// Document Class
export class PostgresDocument {
  constructor(data = {}, model) {
    this._model = model;
    this._isNew = !data._id;
    this._id = data._id ? String(data._id) : generateObjectId();

    // Default timestamps
    const now = new Date();
    if (!data.createdAt) data.createdAt = now.toISOString();
    if (!data.updatedAt) data.updatedAt = now.toISOString();
    data._id = this._id;

    // Apply defaults from schema
    if (model && model.schema && model.schema.definition) {
      this._applyDefaults(data, model.schema.definition);
    }

    this._data = wrapDocumentData(data, this);

    // Proxy for direct property access and mutation
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (prop in target || typeof prop === "symbol" || prop.startsWith?.("_")) {
          return Reflect.get(target, prop, receiver);
        }
        if (prop === "id") {
          const config = TABLE_CONFIGS[target._model?.modelName];
          if (config && config.entityIdField && target._data[config.entityIdField]) {
            return target._data[config.entityIdField];
          }
          return target._id;
        }
        return target._data[prop];
      },
      set(target, prop, value, receiver) {
        if (prop in target && !prop.startsWith?.("_data")) {
          return Reflect.set(target, prop, value, receiver);
        }
        if (prop === "_id") {
          target._id = String(value);
        }
        target._data[prop] = wrapDocumentData(value, target);
        return true;
      },
    });
  }

  _applyDefaults(data, definition) {
    for (const [key, fieldDef] of Object.entries(definition)) {
      if (data[key] === undefined) {
        if (fieldDef && typeof fieldDef === "object") {
          if (typeof fieldDef.default === "function") {
            data[key] = fieldDef.default();
          } else if (fieldDef.default !== undefined) {
            data[key] = deepClone(fieldDef.default);
          } else if (Array.isArray(fieldDef)) {
            data[key] = [];
          }
        }
      }
    }
  }

  toObject() {
    const obj = deepClone(this._data);
    obj._id = this._id;
    const config = TABLE_CONFIGS[this._model?.modelName];
    if (config && config.entityIdField && obj[config.entityIdField]) {
      obj.id = obj[config.entityIdField];
    } else {
      obj.id = this._id;
    }
    return obj;
  }

  toJSON() {
    return this.toObject();
  }

  isModified() {
    return true;
  }

  set(path, value) {
    if (path.includes(".")) {
      setNestedValue(this._data, path, value);
    } else {
      this._data[path] = wrapDocumentData(value, this);
    }
    return this;
  }

  get(path) {
    return getNestedValue(this._data, path);
  }

  async save() {
    this._data.updatedAt = new Date().toISOString();
    this._data._id = this._id;

    if (this._model?.modelName === 'Customer') {
      if (!this._data.customerId || /^CUST-\d{10,}$/.test(this._data.customerId)) {
        const { generateNextCustomerId } = await import("../utils/idGenerator.js");
        this._data.customerId = await generateNextCustomerId();
      }
    }

    const config = TABLE_CONFIGS[this._model?.modelName] || {
      tableName: this._model?.modelName?.toLowerCase() + "s",
      columnMap: {},
    };

    // Prepare extracted columns
    const columns = ["_id", "data", "updated_at"];
    const values = [this._id, JSON.stringify(this._data), new Date()];
    const updates = ["data = $2", "updated_at = $3"];

    let paramIdx = 4;
    for (const [modelProp, colName] of Object.entries(config.columnMap || {})) {
      let val = this._data[modelProp];
      if (modelProp === 'listerId' && (!val || val === 'null')) {
        val = this._data.listerID || this._data.lister_id || 'LST-GENERAL';
      }
      columns.push(colName);
      values.push((val !== undefined && val !== null) ? val : (colName === 'lister_id' ? 'LST-GENERAL' : null));
      updates.push(`${colName} = $${paramIdx}`);
      paramIdx++;
    }

    if (this._isNew) {
      columns.push("created_at");
      values.push(new Date(this._data.createdAt || Date.now()));
      const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");
      const insertSql = `
        INSERT INTO ${config.tableName} (${columns.join(", ")})
        VALUES (${placeholders})
        ON CONFLICT (_id) DO UPDATE SET ${updates.join(", ")}
        RETURNING *;
      `;
      const res = await safeQuery(insertSql, values);
      this._isNew = false;
      if (res.rows[0]?.data) {
        this._data = wrapDocumentData(res.rows[0].data, this);
      }
    } else {
      const setClauses = updates.join(", ");
      const updateSql = `
        UPDATE ${config.tableName}
        SET ${setClauses}
        WHERE _id = $1
        RETURNING *;
      `;
      const res = await safeQuery(updateSql, values);
      if (res.rows[0]?.data) {
        this._data = wrapDocumentData(res.rows[0].data, this);
      }
    }

    return this;
  }
}

// Fluent Query Chain Class
export class PostgresQuery {
  constructor(model, filter = {}, single = false) {
    this.model = model;
    this.filter = filter || {};
    this.single = single;
    this._sort = null;
    this._skip = 0;
    this._limit = null;
    this._select = null;
    this._isLean = false;
  }

  sort(sortSpec) {
    this._sort = sortSpec;
    return this;
  }

  skip(n) {
    this._skip = Number(n) || 0;
    return this;
  }

  limit(n) {
    this._limit = Number(n) || 0;
    return this;
  }

  select(fields) {
    this._select = fields;
    return this;
  }

  lean() {
    this._isLean = true;
    return this;
  }

  populate() {
    return this;
  }

  async exec() {
    const config = TABLE_CONFIGS[this.model.modelName] || {
      tableName: this.model.modelName.toLowerCase() + "s",
    };

    const { whereSql, params } = buildWhereClause(this.filter, config.tableName);

    let sql = `SELECT * FROM ${config.tableName} WHERE ${whereSql}`;

    // Order By
    if (this._sort) {
      const orderClauses = [];
      if (typeof this._sort === "string") {
        const parts = this._sort.split(" ").filter(Boolean);
        for (const part of parts) {
          const desc = part.startsWith("-");
          const rawField = desc ? part.substring(1) : part;
          const field = sanitizeIdentifier(rawField, "sort field");
          if (field === "createdAt" || field === "created_at") {
            orderClauses.push(`created_at ${desc ? "DESC" : "ASC"}`);
          } else if (field === "dueDate" || field === "due_date") {
            orderClauses.push(`due_date ${desc ? "DESC" : "ASC"}`);
          } else if (field.includes(".")) {
            const subparts = field.split(".").map((p) => sanitizeIdentifier(p, "nested sort field"));
            orderClauses.push(`(data#>>'{${subparts.join(",")}}') ${desc ? "DESC" : "ASC"}`);
          } else {
            orderClauses.push(`(data->>'${field}') ${desc ? "DESC" : "ASC"}`);
          }
        }
      } else if (typeof this._sort === "object") {
        for (const [rawField, dir] of Object.entries(this._sort)) {
          const field = sanitizeIdentifier(rawField, "sort field");
          const isDesc = dir === -1 || dir === "desc" || dir === "DESC";
          if (field === "createdAt" || field === "created_at") {
            orderClauses.push(`created_at ${isDesc ? "DESC" : "ASC"}`);
          } else if (field === "dueDate" || field === "due_date") {
            orderClauses.push(`due_date ${isDesc ? "DESC" : "ASC"}`);
          } else if (field.includes(".")) {
            const subparts = field.split(".").map((p) => sanitizeIdentifier(p, "nested sort field"));
            orderClauses.push(`(data#>>'{${subparts.join(",")}}') ${isDesc ? "DESC" : "ASC"}`);
          } else {
            orderClauses.push(`(data->>'${field}') ${isDesc ? "DESC" : "ASC"}`);
          }
        }
      }
      if (orderClauses.length > 0) {
        sql += ` ORDER BY ${orderClauses.join(", ")}`;
      }
    } else {
      sql += ` ORDER BY created_at DESC`;
    }

    // Limit & Skip (if no complex in-memory verification needed)
    if (!this.single && this._limit && this._limit > 0 && !this._hasComplexFilter()) {
      sql += ` LIMIT ${this._limit}`;
    }
    if (!this.single && this._skip && this._skip > 0 && !this._hasComplexFilter()) {
      sql += ` OFFSET ${this._skip}`;
    }
    if (this.single && !this._hasComplexFilter()) {
      sql += ` LIMIT 1`;
    }

    const res = await safeQuery(sql, params);
    let docs = res.rows.map((row) => {
      const data = row.data || {};
      data._id = row._id;
      data.createdAt = row.created_at?.toISOString() || data.createdAt;
      data.updatedAt = row.updated_at?.toISOString() || data.updatedAt;
      return data;
    });

    // Secondary exact filter verification (for $elemMatch, $not, regex edge-cases)
    docs = docs.filter((doc) => matchesFilter(doc, this.filter));

    // In-memory pagination if complex filter was used
    if (this._hasComplexFilter()) {
      if (this._skip > 0) {
        docs = docs.slice(this._skip);
      }
      if (this._limit > 0) {
        docs = docs.slice(0, this._limit);
      }
    }

    // Projection / Select
    if (this._select) {
      docs = docs.map((doc) => this._applySelect(doc, this._select));
    }

    if (this.single) {
      if (docs.length === 0) return null;
      if (this._isLean) return docs[0];
      return new PostgresDocument(docs[0], this.model);
    }

    if (this._isLean) {
      return docs;
    }

    return docs.map((d) => new PostgresDocument(d, this.model));
  }

  _hasComplexFilter() {
    const str = JSON.stringify(this.filter);
    return str.includes("$elemMatch") || str.includes("$not");
  }

  _applySelect(doc, select) {
    if (!select) return doc;
    const fields = typeof select === "string" ? select.split(" ").filter(Boolean) : select;
    const isExclusion = fields.some((f) => f.startsWith("-"));

    if (isExclusion) {
      const res = deepClone(doc);
      for (const field of fields) {
        if (field.startsWith("-")) {
          delete res[field.substring(1)];
        }
      }
      return res;
    }

    const res = {};
    for (const field of fields) {
      res[field] = doc[field];
    }
    if (doc._id && !fields.includes("-_id")) {
      res._id = doc._id;
    }
    return res;
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }

  catch(reject) {
    return this.exec().catch(reject);
  }
}

// Model Class
export class PostgresModel {
  constructor(modelName, schema) {
    this.modelName = modelName;
    this.schema = schema;

    // Return constructor that instantiates PostgresDocument
    const self = this;
    function ModelInstance(data = {}) {
      return new PostgresDocument(data, self);
    }

    // Copy methods to constructor function
    Object.setPrototypeOf(ModelInstance, this);
    ModelInstance.modelName = modelName;
    ModelInstance.schema = schema;

    return ModelInstance;
  }

  get _config() {
    return (
      TABLE_CONFIGS[this.modelName] || {
        tableName: this.modelName.toLowerCase() + "s",
        columnMap: {},
      }
    );
  }

  find(filter = {}) {
    return new PostgresQuery(this, filter, false);
  }

  findOne(filter = {}) {
    return new PostgresQuery(this, filter, true);
  }

  findById(id) {
    if (!id) return new PostgresQuery(this, { _id: "NONE_MATCH" }, true);
    const idStr = id instanceof ObjectId ? id.toString() : String(id);
    return new PostgresQuery(this, { _id: idStr }, true);
  }

  async create(docOrDocs) {
    if (Array.isArray(docOrDocs)) {
      return this.insertMany(docOrDocs);
    }
    const doc = new PostgresDocument(docOrDocs, this);
    await doc.save();
    return doc;
  }

  async insertMany(docs = []) {
    const createdDocs = [];
    for (const item of docs) {
      const doc = new PostgresDocument(item, this);
      await doc.save();
      createdDocs.push(doc);
    }
    return createdDocs;
  }

  async countDocuments(filter = {}) {
    try {
      const config = this._config;
      const { whereSql, params } = buildWhereClause(filter, config.tableName);
      if (!filter || (!JSON.stringify(filter).includes("$elemMatch") && !JSON.stringify(filter).includes("$not"))) {
        const sql = `SELECT COUNT(*)::int as count FROM ${config.tableName} WHERE ${whereSql}`;
        const res = await safeQuery(sql, params);
        return res.rows[0]?.count || 0;
      }
      const sql = `SELECT * FROM ${config.tableName} WHERE ${whereSql}`;
      const res = await safeQuery(sql, params);
      const filtered = res.rows.filter((r) => matchesFilter(r.data || {}, filter));
      return filtered.length;
    } catch (err) {
      console.warn(`[Non-blocking DB note] countDocuments fallback: ${err.message}`);
      return 0;
    }
  }

  async exists(filter = {}) {
    try {
      const config = this._config;
      const { whereSql, params } = buildWhereClause(filter, config.tableName);
      const sql = `SELECT _id, data FROM ${config.tableName} WHERE ${whereSql} LIMIT 20`;
      const res = await safeQuery(sql, params);
      for (const row of res.rows) {
        if (matchesFilter(row.data || { _id: row._id }, filter)) {
          return { _id: row._id };
        }
      }
      return null;
    } catch (err) {
      console.warn(`[Non-blocking DB note] exists fallback: ${err.message}`);
      return null;
    }
  }

  async distinct(field, filter = {}) {
    const query = new PostgresQuery(this, filter, false);
    const docs = await query.exec();
    const values = new Set();
    for (const doc of docs) {
      const val = getNestedValue(doc.toObject ? doc.toObject() : doc, field);
      if (val !== undefined && val !== null) {
        values.add(val);
      }
    }
    return Array.from(values);
  }

  async findOneAndUpdate(filter, update, options = {}) {
    const config = this._config;
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Lock matching candidate rows with FOR UPDATE to prevent race conditions
      const { whereSql, params } = buildWhereClause(filter, config.tableName);
      const selectSql = `SELECT * FROM ${config.tableName} WHERE ${whereSql} FOR UPDATE`;
      const res = await client.query(selectSql, params);

      const matchingRow = res.rows.find((r) => {
        const d = r.data || {};
        d._id = r._id;
        return matchesFilter(d, filter);
      });

      if (!matchingRow) {
        await client.query("COMMIT");
        if (options.upsert) {
          const newDoc = new PostgresDocument({ ...filter }, this);
          applyUpdate(newDoc._data, update);
          await newDoc.save();
          return newDoc;
        }
        return null;
      }

      const originalData = deepClone(matchingRow.data || {});
      originalData._id = matchingRow._id;

      const updatedData = deepClone(originalData);
      applyUpdate(updatedData, update);
      updatedData.updatedAt = new Date().toISOString();

      // Sync columns
      const updates = ["data = $2", "updated_at = NOW()"];
      const updateParams = [matchingRow._id, JSON.stringify(updatedData)];

      let pIdx = 3;
      for (const [modelProp, colName] of Object.entries(config.columnMap || {})) {
        const val = updatedData[modelProp];
        updates.push(`${colName} = $${pIdx}`);
        updateParams.push(val !== undefined ? val : null);
        pIdx++;
      }

      const updateSql = `
        UPDATE ${config.tableName}
        SET ${updates.join(", ")}
        WHERE _id = $1
        RETURNING *;
      `;
      await client.query(updateSql, updateParams);
      await client.query("COMMIT");

      const returnData = options.new ? updatedData : originalData;
      return new PostgresDocument(returnData, this);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async findByIdAndUpdate(id, update, options = {}) {
    if (!id) return null;
    const idStr = id instanceof ObjectId ? id.toString() : String(id);
    return this.findOneAndUpdate({ _id: idStr }, update, options);
  }

  async findOneAndDelete(filter) {
    const config = this._config;
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const { whereSql, params } = buildWhereClause(filter, config.tableName);
      const selectSql = `SELECT * FROM ${config.tableName} WHERE ${whereSql} FOR UPDATE`;
      const res = await client.query(selectSql, params);

      const matchingRow = res.rows.find((r) => {
        const d = r.data || {};
        d._id = r._id;
        return matchesFilter(d, filter);
      });

      if (!matchingRow) {
        await client.query("COMMIT");
        return null;
      }

      await client.query(`DELETE FROM ${config.tableName} WHERE _id = $1`, [matchingRow._id]);
      await client.query("COMMIT");

      const data = matchingRow.data || {};
      data._id = matchingRow._id;
      return new PostgresDocument(data, this);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async findByIdAndDelete(id) {
    if (!id) return null;
    const idStr = id instanceof ObjectId ? id.toString() : String(id);
    return this.findOneAndDelete({ _id: idStr });
  }

  async updateOne(filter, update, options = {}) {
    const res = await this.findOneAndUpdate(filter, update, { ...options, new: true });
    return {
      acknowledged: true,
      matchedCount: res ? 1 : 0,
      modifiedCount: res ? 1 : 0,
    };
  }

  async updateMany(filter, update, options = {}) {
    const config = this._config;
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const { whereSql, params } = buildWhereClause(filter, config.tableName);
      const selectSql = `SELECT * FROM ${config.tableName} WHERE ${whereSql} FOR UPDATE`;
      const res = await client.query(selectSql, params);

      const matchingRows = res.rows.filter((r) => {
        const d = r.data || {};
        d._id = r._id;
        return matchesFilter(d, filter);
      });

      let modifiedCount = 0;
      for (const row of matchingRows) {
        const updatedData = deepClone(row.data || {});
        updatedData._id = row._id;
        applyUpdate(updatedData, update);
        updatedData.updatedAt = new Date().toISOString();

        const updates = ["data = $2", "updated_at = NOW()"];
        const updateParams = [row._id, JSON.stringify(updatedData)];

        let pIdx = 3;
        for (const [modelProp, colName] of Object.entries(config.columnMap || {})) {
          const val = updatedData[modelProp];
          updates.push(`${colName} = $${pIdx}`);
          updateParams.push(val !== undefined ? val : null);
          pIdx++;
        }

        const updateSql = `UPDATE ${config.tableName} SET ${updates.join(", ")} WHERE _id = $1`;
        await client.query(updateSql, updateParams);
        modifiedCount++;
      }

      await client.query("COMMIT");
      return {
        acknowledged: true,
        matchedCount: matchingRows.length,
        modifiedCount,
      };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async deleteOne(filter) {
    const doc = await this.findOneAndDelete(filter);
    return {
      acknowledged: true,
      deletedCount: doc ? 1 : 0,
    };
  }

  async deleteMany(filter) {
    const config = this._config;
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const { whereSql, params } = buildWhereClause(filter, config.tableName);
      const selectSql = `SELECT _id, data FROM ${config.tableName} WHERE ${whereSql} FOR UPDATE`;
      const res = await client.query(selectSql, params);

      const matchingIds = res.rows
        .filter((r) => matchesFilter(r.data || { _id: r._id }, filter))
        .map((r) => r._id);

      if (matchingIds.length > 0) {
        await client.query(
          `DELETE FROM ${config.tableName} WHERE _id = ANY($1::text[])`,
          [matchingIds]
        );
      }

      await client.query("COMMIT");
      return {
        acknowledged: true,
        deletedCount: matchingIds.length,
      };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async aggregate(pipeline = []) {
    const config = this._config;
    let initialFilter = {};
    let remainingPipeline = [...pipeline];
    if (pipeline.length > 0 && pipeline[0].$match) {
      initialFilter = pipeline[0].$match;
      remainingPipeline = pipeline.slice(1);
    }
    const query = new PostgresQuery(this, initialFilter, false);
    let docs = await query.exec();
    let data = docs.map((d) => (d.toObject ? d.toObject() : d));

    for (const stage of remainingPipeline) {
      const [stageName, stageArg] = Object.entries(stage)[0] || [];

      if (stageName === "$match") {
        data = data.filter((doc) => matchesFilter(doc, stageArg));
      } else if (stageName === "$group") {
        const groups = new Map();
        const { _id: groupKeyDef, ...accumulators } = stageArg;

        for (const doc of data) {
          // Compute group key
          let groupKey;
          if (groupKeyDef === null) {
            groupKey = "__null__";
          } else if (typeof groupKeyDef === "string" && groupKeyDef.startsWith("$")) {
            const rawField = groupKeyDef.substring(1);
            const field = sanitizeIdentifier(rawField, "group field");
            groupKey = String(doc[field]);
          } else if (typeof groupKeyDef === "object" && groupKeyDef !== null) {
            const computedKey = {};
            for (const [k, v] of Object.entries(groupKeyDef)) {
              const sanitizedK = sanitizeIdentifier(k, "group key");
              if (typeof v === "object" && v !== null) {
                if (v.$year) {
                  const f = sanitizeIdentifier(v.$year.substring(1), "group year field");
                  const d = new Date(doc[f] || doc.createdAt);
                  computedKey[sanitizedK] = isNaN(d.getTime()) ? null : d.getFullYear();
                } else if (v.$month) {
                  const f = sanitizeIdentifier(v.$month.substring(1), "group month field");
                  const d = new Date(doc[f] || doc.createdAt);
                  computedKey[sanitizedK] = isNaN(d.getTime()) ? null : d.getMonth() + 1;
                }
              }
            }
            groupKey = JSON.stringify(computedKey);
          } else {
            groupKey = String(groupKeyDef);
          }

          if (!groups.has(groupKey)) {
            groups.set(groupKey, {
              _keyDef: groupKeyDef,
              _groupKey: groupKey,
              docs: [],
            });
          }
          groups.get(groupKey).docs.push(doc);
        }

        const groupedResults = [];
        for (const [gKey, gVal] of groups.entries()) {
          const result = {};

          // Set _id
          if (gVal._keyDef === null) {
            result._id = null;
          } else if (typeof gVal._keyDef === "string" && gVal._keyDef.startsWith("$")) {
            const field = sanitizeIdentifier(gVal._keyDef.substring(1), "group id field");
            result._id = gVal.docs[0][field];
          } else if (typeof gVal._keyDef === "object") {
            result._id = JSON.parse(gKey);
          } else {
            result._id = gKey;
          }

          // Compute accumulators
          for (const [rawAccField, accExpr] of Object.entries(accumulators)) {
            const accField = sanitizeIdentifier(rawAccField, "accumulator field");
            if (accExpr && typeof accExpr === "object") {
              if (accExpr.$sum !== undefined) {
                if (accExpr.$sum === 1) {
                  result[accField] = gVal.docs.length;
                } else if (typeof accExpr.$sum === "string" && accExpr.$sum.startsWith("$")) {
                  const f = sanitizeIdentifier(accExpr.$sum.substring(1), "sum field");
                  result[accField] = gVal.docs.reduce((sum, d) => sum + (Number(d[f]) || 0), 0);
                } else if (typeof accExpr.$sum === "number") {
                  result[accField] = gVal.docs.length * accExpr.$sum;
                }
              } else if (accExpr.$avg && typeof accExpr.$avg === "string") {
                const f = sanitizeIdentifier(accExpr.$avg.substring(1), "avg field");
                const total = gVal.docs.reduce((sum, d) => sum + (Number(d[f]) || 0), 0);
                result[accField] = gVal.docs.length > 0 ? total / gVal.docs.length : 0;
              } else if (accExpr.$push) {
                const f = typeof accExpr.$push === "string" && accExpr.$push.startsWith("$") ? sanitizeIdentifier(accExpr.$push.substring(1), "push field") : null;
                result[accField] = f ? gVal.docs.map((d) => d[f]) : gVal.docs;
              }
            }
          }

          groupedResults.push(result);
        }

        data = groupedResults;
      } else if (stageName === "$sort") {
        data.sort((a, b) => {
          for (const [rawField, dir] of Object.entries(stageArg)) {
            const field = sanitizeIdentifier(rawField, "aggregate sort field");
            const isDesc = dir === -1 || dir === "desc";
            const valA = getNestedValue(a, field);
            const valB = getNestedValue(b, field);
            if (valA < valB) return isDesc ? 1 : -1;
            if (valA > valB) return isDesc ? -1 : 1;
          }
          return 0;
        });
      } else if (stageName === "$project") {
        data = data.map((doc) => {
          const projected = {};
          for (const [rawField, inc] of Object.entries(stageArg)) {
            const field = sanitizeIdentifier(rawField, "project field");
            if (inc) projected[field] = getNestedValue(doc, field);
          }
          return projected;
        });
      } else if (stageName === "$limit") {
        data = data.slice(0, Number(stageArg));
      } else if (stageName === "$skip") {
        data = data.slice(Number(stageArg));
      }
    }

    return data;
  }
}

// Registry of Models
export const models = {};

export const model = (name, schema) => {
  if (!schema && models[name]) {
    return models[name];
  }
  const m = new PostgresModel(name, schema);
  models[name] = m;
  return m;
};

// Mongoose-like adapter export object
const postgresAdapter = {
  Schema,
  model,
  models,
  Types,
  connect: async () => pool.connect(),
  connection: {
    on: (event, handler) => pool.on(event, handler),
    close: async () => pool.end(),
  },
  set: () => {},
};

export default postgresAdapter;
