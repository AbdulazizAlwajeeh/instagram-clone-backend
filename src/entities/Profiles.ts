import { Column, Entity, Index, OneToMany } from "typeorm";
import { Blocks } from "./Blocks";
import { Chats } from "./Chats";
import { Comments } from "./Comments";
import { Follows } from "./Follows";
import { Likes } from "./Likes";
import { Messages } from "./Messages";
import { PostReports } from "./PostReports";
import { Posts } from "./Posts";

@Index("profiles_pkey", ["id"], { unique: true })
@Index("profiles_username_key", ["username"], { unique: true })
@Entity("profiles", { schema: "public" })
export class Profiles {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("text", { name: "username", unique: true })
  username: string;

  @Column("text", { name: "full_name", nullable: true })
  fullName: string | null;

  @Column("text", { name: "avatar_url", nullable: true })
  avatarUrl: string | null;

  @Column("text", { name: "bio", nullable: true })
  bio: string | null;

  @Column("bigint", { name: "posts_count", default: () => "0" })
  postsCount: string;

  @Column("bigint", { name: "followers_count", default: () => "0" })
  followersCount: string;

  @Column("bigint", { name: "following_count", default: () => "0" })
  followingCount: string;

  @OneToMany(() => Blocks, (blocks) => blocks.blocked)
  blocks: Blocks[];

  @OneToMany(() => Blocks, (blocks) => blocks.blocker)
  blocks2: Blocks[];

  @OneToMany(() => Chats, (chats) => chats.lastSender)
  chats: Chats[];

  @OneToMany(() => Chats, (chats) => chats.userOne2)
  chats2: Chats[];

  @OneToMany(() => Chats, (chats) => chats.userTwo2)
  chats3: Chats[];

  @OneToMany(() => Comments, (comments) => comments.user)
  comments: Comments[];

  @OneToMany(() => Follows, (follows) => follows.follower)
  follows: Follows[];

  @OneToMany(() => Follows, (follows) => follows.following)
  follows2: Follows[];

  @OneToMany(() => Likes, (likes) => likes.user)
  likes: Likes[];

  @OneToMany(() => Messages, (messages) => messages.receiver)
  messages: Messages[];

  @OneToMany(() => Messages, (messages) => messages.sender)
  messages2: Messages[];

  @OneToMany(() => PostReports, (postReports) => postReports.reporter)
  postReports: PostReports[];

  @OneToMany(() => Posts, (posts) => posts.user)
  posts: Posts[];
}
