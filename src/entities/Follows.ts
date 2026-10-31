import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Profiles } from "./Profiles";

@Index("follows_pkey", ["followerId", "followingId"], { unique: true })
@Entity("follows", { schema: "public" })
export class Follows {
  @Column("uuid", { primary: true, name: "follower_id" })
  followerId: string;

  @Column("uuid", { primary: true, name: "following_id" })
  followingId: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "timezone('utc', now())",
  })
  createdAt: Date;

  @ManyToOne(() => Profiles, (profiles) => profiles.follows, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "follower_id", referencedColumnName: "id" }])
  follower: Profiles;

  @ManyToOne(() => Profiles, (profiles) => profiles.follows2, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "following_id", referencedColumnName: "id" }])
  following: Profiles;
}
