import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Profiles } from "../../profile/entities/profile.entity";
import { Messages } from "./message.entity";

@Index("chats_pkey", ["id"], { unique: true })
@Index("unique_user_pair", ["userOne", "userTwo"], { unique: true })
@Entity("chats", { schema: "public" })
export class Chats {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("uuid", { name: "user_one", unique: true })
  userOne: string;

  @Column("uuid", { name: "user_two", unique: true })
  userTwo: string;

  @Column("text", { name: "last_message", nullable: true })
  lastMessage: string | null;

  @Column("timestamp with time zone", {
    name: "last_message_time",
    default: () => "timezone('utc', now())",
  })
  lastMessageTime: Date;

  @ManyToOne(() => Profiles, (profiles) => profiles.chats)
  @JoinColumn([{ name: "last_sender_id", referencedColumnName: "id" }])
  lastSender: Profiles;

  @ManyToOne(() => Profiles, (profiles) => profiles.chats2, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "user_one", referencedColumnName: "id" }])
  profileOne: Profiles;

  @ManyToOne(() => Profiles, (profiles) => profiles.chats3, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "user_two", referencedColumnName: "id" }])
  profileTwo: Profiles;

  @OneToMany(() => Messages, (messages) => messages.conversation)
  messages: Messages[];
}
