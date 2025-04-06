export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function up(pgm) {
  pgm.createType("user_role", ["customer", "attendant"]);

  pgm.createTable("users", {
    id: {
      type: "serial",
      primaryKey: true,
      notNull: true,
      unique: true,
    },
    name: {
      type: "varchar(255)",
      notNull: true,
    },
    email: {
      type: "varchar(255)",
      notNull: true,
      unique: true,
    },
    password: {
      type: "varchar(255)",
      notNull: true,
    },
    role: {
      type: "user_role",
      notNull: true,
      default: "customer",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // Create a check constraint to enforce the enum-like behavior for the "role" column
  pgm.addConstraint("users", "role_check", {
    check: "role IN ('customer', 'attendant')",
  });
}
