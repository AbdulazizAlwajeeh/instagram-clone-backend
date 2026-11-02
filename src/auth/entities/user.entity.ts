import { Column, Entity, Index } from "typeorm";

@Index("users_email_key", ["email"], { unique: true })
@Index("idx_users_email", ["email"], {})
@Index("users_pkey", ["id"], { unique: true })
@Entity("users", { schema: "auth" })
export class Users {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("character varying", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("character varying", { name: "encrypted_password", length: 255 })
  encryptedPassword: string;
}
