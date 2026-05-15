import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Currency {
    USD,
    EUR,
    GBP,
    JPY,
    CNY,
    INR,
    AUD,
    CAD,
    CHF,
    NZD
}

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "varchar", length: 255 })
    name: string

    @Column({ type: "varchar", length: 255, unique: true })
    email: string

    @Column({ type: "varchar", length: 255, name: "password_hash" })
    passwordHash: string

    @Column({ type: "enum", enum: Currency, default: Currency.USD, name: "default_currency" })
    defaultCurrency: Currency
}
