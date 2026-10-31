import { Column, Entity, Index } from "typeorm";

@Index("user_device_tokens_device_token_key", ["deviceToken"], { unique: true })
@Index("user_device_tokens_pkey", ["id"], { unique: true })
@Index("user_device_tokens_user_id_idx", ["userId"], {})
@Entity("user_device_tokens", { schema: "public" })
export class UserDeviceTokens {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("uuid", { name: "user_id" })
  userId: string;

  @Column("text", { name: "device_token", unique: true })
  deviceToken: string;

  @Column("text", { name: "platform" })
  platform: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "timezone('utc', now())",
  })
  createdAt: Date;

  @Column("timestamp with time zone", {
    name: "updated_at",
    default: () => "timezone('utc', now())",
  })
  updatedAt: Date;
}
