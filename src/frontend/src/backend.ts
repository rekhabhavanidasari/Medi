// Runtime stub for backend bindings.
// The real implementation is injected by the Caffeine platform build pipeline.
// This stub allows local dev builds to succeed.

export interface CreateActorOptions {
  agentOptions?: Record<string, unknown>;
}

export class ExternalBlob {
  private _url?: string;
  private _bytes?: Uint8Array;
  onProgress?: (progress: number) => void;

  static fromURL(url: string): ExternalBlob {
    const b = new ExternalBlob();
    b._url = url;
    return b;
  }

  async getBytes(): Promise<Uint8Array> {
    if (this._bytes) return this._bytes;
    if (this._url) {
      const res = await fetch(this._url);
      const buf = await res.arrayBuffer();
      return new Uint8Array(buf);
    }
    return new Uint8Array();
  }

  getURL(): string | undefined {
    return this._url;
  }
}

export interface backendInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export async function createActor(
  _canisterId: string,
  _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
  _downloadFile: (bytes: Uint8Array) => Promise<ExternalBlob>,
  _options?: CreateActorOptions,
): Promise<backendInterface> {
  return {};
}
