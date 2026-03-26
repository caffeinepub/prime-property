import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Inquiry {
    name: string;
    message: string;
    timestamp: Time;
    phone: string;
}
export type Time = bigint;
export interface Property {
    id: bigint;
    title: string;
    description: string;
    price: string;
    location: string;
    propertyType: string;
    imageUrl: string;
    createdAt: bigint;
}
export interface backendInterface {
    configure(): Promise<void>;
    getAllInquiries(): Promise<Array<Inquiry>>;
    submitInquiry(name: string, phone: string, message: string): Promise<void>;
    addProperty(title: string, description: string, price: string, location: string, propertyType: string, imageUrl: string): Promise<bigint>;
    removeProperty(id: bigint): Promise<void>;
    getAllProperties(): Promise<Array<Property>>;
    getProperty(id: bigint): Promise<[] | [Property]>;
}
