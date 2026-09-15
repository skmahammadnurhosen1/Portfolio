/**
 * Client-Side CV Helper for Seamless Downloads and Previews
 * Avoids browser navigation cookie check blocks (e.g. Cloud Run / AI Studio cookie check interstitial)
 * by fetching binary or base64 data over same-origin API and generating local in-memory Blob URLs.
 */

export interface CvDataResponse {
  success: boolean;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  base64?: string;
  remoteUrl?: string;
  error?: string;
}

/**
 * Fetches the CV as an in-memory Blob using same-origin authenticated API
 */
export async function fetchCvBlob(): Promise<{ blob: Blob; fileName: string; fileSize?: number }> {
  // First attempt: fetch JSON payload via /api/profile/cv/data (never triggers proxy cookie check)
  try {
    const res = await fetch('/api/profile/cv/data', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const data: CvDataResponse = await res.json();
      if (data.success && data.base64) {
        const byteCharacters = atob(data.base64);
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const blob = new Blob([byteNumbers], { type: data.mimeType || 'application/pdf' });
        return {
          blob,
          fileName: data.fileName || 'Noor_Resume_CV.pdf',
          fileSize: data.fileSize || byteNumbers.length,
        };
      } else if (data.remoteUrl) {
        // Fetch remote URL as blob
        const remoteRes = await fetch(data.remoteUrl);
        const blob = await remoteRes.blob();
        return {
          blob,
          fileName: data.fileName || 'Noor_Resume_CV.pdf',
        };
      }
    }
  } catch (err) {
    console.warn('JSON CV fetch failed, trying direct stream fetch:', err);
  }

  // Fallback: fetch directly from /api/profile/cv/download
  const streamRes = await fetch('/api/profile/cv/download', {
    method: 'GET',
    headers: {
      Accept: 'application/pdf, application/octet-stream',
    },
  });

  if (!streamRes.ok) {
    let errMsg = 'Could not download CV file.';
    try {
      const errJson = await streamRes.json();
      if (errJson.error) errMsg = errJson.error;
    } catch (_) {}
    throw new Error(errMsg);
  }

  const contentType = streamRes.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    throw new Error('Received unexpected HTML response while trying to download PDF.');
  }

  // Parse filename from Content-Disposition if present
  let fileName = 'Noor_Resume_CV.pdf';
  const disposition = streamRes.headers.get('content-disposition');
  if (disposition && disposition.includes('filename=')) {
    const match = disposition.match(/filename="?([^"]+)"?/);
    if (match && match[1]) {
      fileName = match[1];
    }
  }

  const blob = await streamRes.blob();
  return { blob, fileName };
}

/**
 * Triggers a direct, native browser download without page navigation or cookie issues
 */
export async function triggerCvDownload(defaultName = 'Noor_Resume_CV.pdf'): Promise<{ success: boolean; fileName?: string; error?: string }> {
  try {
    const { blob, fileName } = await fetchCvBlob();
    const finalName = fileName || defaultName;

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = finalName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Clean up memory after short delay
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 15000);

    return { success: true, fileName: finalName };
  } catch (err: any) {
    console.error('Failed to trigger CV download:', err);
    return { success: false, error: err.message || 'Download failed' };
  }
}
