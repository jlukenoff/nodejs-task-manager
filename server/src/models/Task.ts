import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  complete: boolean;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  timestamp: Date;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @Column()
  position: number;
}
