import type { Principal } from "@icp-sdk/core/principal";
import type { AgentOptions } from "@icp-sdk/core/agent";

export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PharmaStore {
    lat: number;
    lng: number;
    hours: string;
    area: string;
    name: string;
    outOfStock: Array<string>;
    distance: number;
    availableMeds: Array<string>;
    address: string;
    notes: string;
    lowStockMeds: Array<string>;
    phone: string;
}
export interface backendInterface {
    addPharma(name: string, address: string, phone: string, hours: string, lat: number, lng: number, distance: number, area: string, availableMeds: Array<string>, lowStockMeds: Array<string>, outOfStock: Array<string>, notes: string): Promise<void>;
    getPharmas(): Promise<Array<PharmaStore>>;
}

export interface CreateActorOptions {
    agentOptions?: Partial<AgentOptions>;
}

export declare class ExternalBlob {
    onProgress?: (progress: number) => void;
    static fromURL(url: string): ExternalBlob;
    getBytes(): Promise<Uint8Array>;
    getURL(): string | undefined;
}

export declare function createActor(
    canisterId: string,
    uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
    downloadFile: (bytes: Uint8Array) => Promise<ExternalBlob>,
    options?: CreateActorOptions,
): Promise<backendInterface>;
