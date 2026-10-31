import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Chats } from "./Chats";
import { Profiles } from "./Profiles";

@Index("messages_pkey", ["id"], { unique: true })
@Entity("messages", { schema: "public" })
export class Messages {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("text", { name: "content" })
  content: string;

  @Column("boolean", { name: "is_read", default: () => "false" })
  isRead: boolean;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "timezone('utc', now())",
  })
  createdAt: Date;

  @ManyToOne(() => Chats, (chats) => chats.messages, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "conversation_id", referencedColumnName: "id" }])
  conversation: Chats;

  @ManyToOne(() => Profiles, (profiles) => profiles.messages, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "receiver_id", referencedColumnName: "id" }])
  receiver: Profiles;

  @ManyToOne(() => Profiles, (profiles) => profiles.messages2, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "sender_id", referencedColumnName: "id" }])
  sender: Profiles;
}
