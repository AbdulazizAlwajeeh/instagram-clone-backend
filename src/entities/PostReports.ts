import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Posts } from "./Posts";
import { Profiles } from "./Profiles";

@Index("reports_pkey", ["id"], { unique: true })
@Index("idx_post_reports_post_id", ["postId"], {})
@Index("unique_post_report_pair", ["postId", "reporterId"], { unique: true })
@Entity("post_reports", { schema: "public" })
export class PostReports {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("uuid", { name: "reporter_id", unique: true })
  reporterId: string;

  @Column("uuid", { name: "post_id", unique: true })
  postId: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "timezone('utc', now())",
  })
  createdAt: Date;

  @ManyToOne(() => Posts, (posts) => posts.postReports, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "post_id", referencedColumnName: "id" }])
  post: Posts;

  @ManyToOne(() => Profiles, (profiles) => profiles.postReports, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "reporter_id", referencedColumnName: "id" }])
  reporter: Profiles;
}
