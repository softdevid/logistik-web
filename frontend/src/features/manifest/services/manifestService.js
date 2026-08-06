import { apiRequest } from "@/api";
import { MANIFEST_ENDPOINT } from "../constants";
import { extractManifestList, normalizeManifestRow } from "../utils";

async function readBody(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function readError(body, fallback) {
  return body?.error || body?.message || fallback;
}

export async function listManifests() {
  const response = await apiRequest(MANIFEST_ENDPOINT);
  const body = await readBody(response);

  if (!response.ok) {
    throw new Error(readError(body, "Gagal memuat data manifest"));
  }

  return extractManifestList(body).map((row) => normalizeManifestRow(row));
}

export async function createManifest(payload) {
  const response = await apiRequest(MANIFEST_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const body = await readBody(response);

  if (!response.ok) {
    throw new Error(readError(body, "Gagal menyimpan manifest"));
  }

  return normalizeManifestRow(body.data ?? body ?? payload);
}

export async function updateManifest(id, payload) {
  const response = await apiRequest(`${MANIFEST_ENDPOINT}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  const body = await readBody(response);

  if (!response.ok) {
    throw new Error(readError(body, "Gagal memperbarui manifest"));
  }

  return normalizeManifestRow(body.data ?? body ?? payload);
}

export async function deleteManifest(id) {
  const response = await apiRequest(`${MANIFEST_ENDPOINT}/${id}`, {
    method: "DELETE",
  });
  const body = await readBody(response);

  if (!response.ok) {
    throw new Error(readError(body, "Gagal menghapus manifest"));
  }

  return true;
}
