import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Posts } from "./post.entity";
import { Profiles } from "../../profile/entities/profile.entity";

@Index("comments_pkey", ["id"], { unique: true })
@Entity("comments", { schema: "public" })
export class Comments {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("text", { name: "message" })
  message: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "timezone('utc', now())",
  })
  createdAt: Date;

  @ManyToOne(() => Posts, (posts) => posts.comments, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "post_id", referencedColumnName: "id" }])
  post: Posts;

  @ManyToOne(() => Profiles, (profiles) => profiles.comments, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Profiles;
}
