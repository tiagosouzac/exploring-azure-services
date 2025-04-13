export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function up(pgm) {
  pgm.createType("ticket_status", ["open", "in_progress", "closed"]);

  pgm.createTable("tickets", {
    id: {
      type: "serial",
      primaryKey: true,
      notNull: true,
      unique: true,
    },
    title: {
      type: "varchar(255)",
      notNull: true,
    },
    description: {
      type: "text",
      notNull: true,
    },
    status: {
      type: "ticket_status",
      notNull: true,
      default: "open",
    },
    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
  });

  // Create a check constraint to enforce the enum-like behavior for the "status" column
  pgm.addConstraint("tickets", "status_check", {
    check: "status IN ('open', 'in_progress', 'closed')",
  });
}
