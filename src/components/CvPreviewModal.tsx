import React, { useState, useEffect } from 'react';
import { X, Download, FileText, Loader2, ExternalLink, ZoomIn, ZoomOut, AlertCircle } from 'lucide-react';
import { fetchCvBlob } from '../utils/cvDownloader';

interface CvPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName?: string;
}

export const CvPreviewModal: React.FC<CvPreviewModalProps> = ({
  isOpen,
  onClose,
  fileName: propFileName,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>(propFileName || 'Noor_CV.pdf');
  const [fileSize, setFileSize] = useState<number | undefined>();
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    if (!isOpen) {
      if (blobUrl) {
        window.URL.revokeObjectURL(blobUrl);
        setBlobUrl(null);
      }
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchCvBlob()
      .then(({ blob, fileName: fetchedName, fileSize: fetchedSize }) => {
        if (!isMounted) return;
        const url = window.URL.createObjectURL(blob);
        setBlobUrl(url);
        setFileName(fetchedName || propFileName || 'Noor_CV.pdf');
        setFileSize(fetchedSize);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error opening CV preview:', err);
        setError(err.message || 'Could not load CV preview');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!blobUrl) return;
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleOpenInNewTab = () => {
    if (!blobUrl) return;
    window.open(blobUrl, '_blank');
  };

  function formatBytes(bytes?: number): string {
    if (!bytes || isNaN(bytes)) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div
      id="cv-preview-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="cv-preview-modal-container"
        className="bg-stone-900 text-stone-100 rounded-2xl w-full max-w-4xl h-[90vh] max-h-[850px] flex flex-col border border-stone-800 shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-stone-800 bg-stone-900/90 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-stone-100 truncate">{fileName}</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300">
                  PDF
                </span>
              </div>
              {fileSize && (
                <p className="text-[11px] text-stone-400">{formatBytes(fileSize)}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Zoom Controls (for desktop iframe) */}
            <div className="hidden md:flex items-center gap-1 mr-2 px-2 py-1 rounded-lg bg-stone-800/80 border border-stone-700/60 text-xs">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(75, z - 15))}
                className="p-1 text-stone-400 hover:text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-mono text-[11px] text-stone-300">
                {zoom}%
              </span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(150, z + 15))}
                className="p-1 text-stone-400 hover:text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Close Modal Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Viewer */}
        <div className="flex-1 bg-stone-950 relative overflow-hidden flex items-center justify-center p-2 sm:p-4">
          {loading && (
            <div className="flex flex-col items-center gap-3 text-stone-400">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
              <p className="text-xs font-medium tracking-wide">Loading CV document preview...</p>
            </div>
          )}

          {error && (
            <div className="max-w-md p-6 rounded-2xl bg-stone-900 border border-stone-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-stone-200">Failed to load preview</h4>
              <p className="text-xs text-stone-400">{error}</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium"
              >
                Close
              </button>
            </div>
          )}

          {!loading && !error && blobUrl && (
            <div
              className="w-full h-full flex items-center justify-center overflow-auto rounded-xl bg-stone-900/50"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
              }}
            >
              <object
                data={blobUrl}
                type="application/pdf"
                className="w-full h-full min-h-[500px] rounded-xl border border-stone-800"
              >
                <div className="flex flex-col items-center justify-center p-8 text-center text-stone-300 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{fileName}</h4>
                    <p className="text-xs text-stone-400 mt-1 max-w-sm">
                      Preview cannot be embedded in this browser. Use the download button below to view it.
                    </p>
                  </div>
                </div>
              </object>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar: Prominent Download Action at the Bottom */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-stone-800 bg-stone-900/95 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-400 min-w-0">
            <span className="font-medium text-stone-300 truncate max-w-[200px] sm:max-w-xs">{fileName}</span>
            {fileSize && (
              <span className="text-[11px] text-stone-500 font-mono">({formatBytes(fileSize)})</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {blobUrl && (
              <button
                type="button"
                onClick={handleOpenInNewTab}
                className="px-3.5 py-2.5 rounded-xl text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Open in new window"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Open in New Tab</span>
              </button>
            )}

            <button
              type="button"
              id="cv-modal-bottom-download-btn"
              onClick={handleDownload}
              disabled={loading || !!error}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download CV (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
