import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('weather')
@Index(['city', 'country'], { unique: true })
export class Weather {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  country: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  weather_main: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  weather_description: string;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: false })
  longitude: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: false })
  latitude: number;

  @Column({ type: 'float', nullable: false })
  temperature: number;

  @Column({ type: 'float', nullable: false })
  thermal_sensation: number;

  @Column({ type: 'int' })
  humidity: number;

  @Column({ type: 'timestamp' })
  measured_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
