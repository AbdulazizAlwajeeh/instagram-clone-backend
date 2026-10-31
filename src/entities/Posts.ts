import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Comments } from "./Comments";
import { Likes } from "./Likes";
import { PostReports } from "./PostReports";
import { Profiles } from "./Profiles";

@Index("posts_pkey", ["id"], { unique: true })
@Entity("posts", { schema: "public" })
export class Posts {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("text", { name: "caption", nullable: true })
  caption: string | null;

  @Column("text", { name: "media_url" })
  mediaUrl: string;

  @Column("integer", { name: "likes_count", default: () => "0" })
  likesCount: number;

  @Column("integer", { name: "comments_count", default: () => "0" })
  commentsCount: number;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "timezone('utc', now())",
  })
  createdAt: Date;

  @Column("integer", { name: "report_count", default: () => "0" })
  reportCount: number;

  @OneToMany(() => Comments, (comments) => comments.post)
  comments: Comments[];

  @OneToMany(() => Likes, (likes) => likes.post)
  likes: Likes[];

  @OneToMany(() => PostReports, (postReports) => postReports.post)
  postReports: PostReports[];

  @ManyToOne(() => Profiles, (profiles) => profiles.posts, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Profiles;
}
