import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Profiles } from "./Profiles";

@Index("idx_blocks_blocked_id", ["blockedId"], {})
@Index("unique_block_pair", ["blockedId", "blockerId"], { unique: true })
@Index("idx_blocks_blocker_id", ["blockerId"], {})
@Index("blocks_pkey", ["id"], { unique: true })
@Entity("blocks", { schema: "public" })
export class Blocks {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("uuid", { name: "blocker_id", unique: true })
  blockerId: string;

  @Column("uuid", { name: "blocked_id", unique: true })
  blockedId: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "timezone('utc', now())",
  })
  createdAt: Date;

  @ManyToOne(() => Profiles, (profiles) => profiles.blocks, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "blocked_id", referencedColumnName: "id" }])
  blocked: Profiles;

  @ManyToOne(() => Profiles, (profiles) => profiles.blocks2, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "blocker_id", referencedColumnName: "id" }])
  blocker: Profiles;
}
