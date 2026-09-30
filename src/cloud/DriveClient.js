import { CONFIG } from "../config.js";

export default class DriveClient {
  static API = "https://www.googleapis.com/drive/v3/files";
  static UPLOAD = "https://www.googleapis.com/upload/drive/v3/files";

  #auth = null;

  constructor(auth) {
    this.#auth = auth;
  }

  letolt() {
    return this.#fajlKereses().then((fajl) => {
      if (!fajl) {
        return null;
      }

      return this.#keres(`${DriveClient.API}/${fajl.id}?alt=media`)
        .then((valasz) => valasz.json())
        .then((tartalom) => ({ tartalom, modositva: fajl.modifiedTime }));
    });
  }

  feltolt(dokumentum) {
    const tartalom = JSON.stringify(dokumentum);

    return this.#fajlKereses().then((fajl) =>
      fajl ? this.#frissit(fajl.id, tartalom) : this.#letrehoz(tartalom)
    );
  }

  #frissit(id, tartalom) {
    return this.#keres(`${DriveClient.UPLOAD}/${id}?uploadType=media&fields=id,modifiedTime`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: tartalom,
    }).then((valasz) => valasz.json());
  }

  #letrehoz(tartalom) {
    const hatar = `hatar_${Date.now()}`;
    const meta = {
      name: CONFIG.DRIVE_FAJL,
      parents: ["appDataFolder"],
      mimeType: "application/json",
    };

    const test =
      `--${hatar}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
      `${JSON.stringify(meta)}\r\n` +
      `--${hatar}\r\nContent-Type: application/json\r\n\r\n` +
      `${tartalom}\r\n--${hatar}--`;

    return this.#keres(`${DriveClient.UPLOAD}?uploadType=multipart&fields=id,modifiedTime`, {
      method: "POST",
      headers: { "Content-Type": `multipart/related; boundary=${hatar}` },
      body: test,
    }).then((valasz) => valasz.json());
  }

  #fajlKereses() {
    const parameterek = new URLSearchParams({
      spaces: "appDataFolder",
      q: `name = '${CONFIG.DRIVE_FAJL}' and trashed = false`,
      fields: "files(id,name,modifiedTime)",
      pageSize: "10",
    });

    return this.#keres(`${DriveClient.API}?${parameterek}`)
      .then((valasz) => valasz.json())
      .then((eredmeny) => eredmeny.files?.[0] ?? null);
  }

  #keres(url, beallitasok = {}, ujra = true) {
    return this.#auth
      .token()
      .then((token) =>
        fetch(url, {
          ...beallitasok,
          headers: { ...beallitasok.headers, Authorization: `Bearer ${token}` },
        })
      )
      .then((valasz) => {
        if (valasz.status === 401 && ujra) {
          this.#auth.tokenElvetes();
          return this.#keres(url, beallitasok, false);
        }

        if (!valasz.ok) {
          return this.#hiba(valasz);
        }

        return valasz;
      });
  }

  #hiba(valasz) {
    return valasz
      .json()
      .catch(() => null)
      .then((tartalom) => {
        throw new Error(
          tartalom?.error?.message ??
            `A Google Drive hibát adott vissza (${valasz.status}).`
        );
      });
  }
}
