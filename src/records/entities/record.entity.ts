import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  one: string;

  @Column({ nullable: true })
  two: string;

  @Column({ nullable: true })
  three: string;

  @Column({ nullable: true })
  four: string;

  @Column({ nullable: true })
  five: string;

  @Column({ nullable: true })
  six: string;

  @Column({ nullable: true })
  seven: string;

  @Column({ nullable: true })
  eight: string;

  @Column({ nullable: true })
  nine: string;

  @Column({ nullable: true })
  ten: string;

  @Column({ nullable: true })
  eleven: string;

  @Column({ nullable: true })
  twelve: string;
}
