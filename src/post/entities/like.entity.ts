import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Posts } from "./post.entity";
import { Profiles } from "../../profile/entities/profile.entity";

@Index("likes_pkey", ["id"], { unique: true })
@Index("likes_post_id_user_id_key", ["postId", "userId"], { unique: true })
@Entity("likes", { schema: "public" })
export class Likes {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("uuid", { name: "post_id", unique: true })
  postId: string;

  @Column("uuid", { name: "user_id", unique: true })
  userId: string;

  @ManyToOne(() => Posts, (posts) => posts.likes, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "post_id", referencedColumnName: "id" }])
  post: Posts;

  @ManyToOne(() => Profiles, (profiles) => profiles.likes, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Profiles;
}
