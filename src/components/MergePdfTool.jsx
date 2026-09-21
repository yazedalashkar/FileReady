import React, { useState, useRef, useEffect } from 'react';
import Link from './Link.jsx';
import AlertBanner from './AlertBanner.jsx';
import { mergePdfFiles, isPdfFile, getPdfPageCount } from '../utils/pdfMerger.js';
import { formatBytes } from '../utils/fileUtils.js';
import { UI_TRANSLATIONS } from '../data/translations.js';

export default function MergePdfTool({ lang = 'en' }) {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
  const fileInputRef = useRef(null);
  const appendInputRef = useRef(null);

  const [filesWithMeta, setFilesWithMeta] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState(null);

  // Clean up object URL on unmount or when result changes
  useEffect(() => {
    return () => {
      if (result?.downloadUrl) {
        URL.revokeObjectURL(result.downloadUrl);
      }
    };
  }, [result]);

  // Helper to get localized error message
  const getErrorMessage = (err) => {
    const code = err?.code || '';
    if (code === 'PLEASE_SELECT_AT_LEAST_TWO') {
      return t.errMergeSelectTwo;
    }
    if (code === 'INVALID_FILE_TYPE') {
      return t.errMergeOnlyPdf;
    }
    if (code === 'PASSWORD_PROTECTED') {
      return t.errMergePassword;
    }
    if (code === 'CORRUPTED_FILE' || code === 'CANT_READ_FILE') {
      return t.errMergeCorrupted;
    }
    if (code === 'EMPTY_DOCUMENT') {
      return t.errMergeEmpty;
    }
    if (code === 'MEMORY_LIMIT') {
      return t.errMergeMemory;
    }
    return t.errMergeGeneric;
  };

  const handleFilesAdded = async (fileList) => {
    setErrorMessage('');
    if (!fileList || fileList.length === 0) return;

    const newFiles = Array.from(fileList);
    const nonPdfs = newFiles.filter((f) => !isPdfFile(f));
    if (nonPdfs.length > 0) {
      setErrorMessage(t.errMergeOnlyPdf);
      return;
    }

    // Inspect page count for newly added files
    const enriched = await Promise.all(
      newFiles.map(async (file, idx) => {
        const pageCount = await getPdfPageCount(file);
        return {
          id: `${file.name}-${file.size}-${Date.now()}-${idx}`,
          file,
          name: file.name,
          size: file.size,
          pageCount,
        };
      })
    );

    setFilesWithMeta((prev) => [...prev, ...enriched]);
  };

  const handleInitialDrop = (e) => {
    e.preventDefault();
    if (isProcessing) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const handleRemove = (idToRemove) => {
    if (isProcessing) return;
    setFilesWithMeta((prev) => prev.filter((item) => item.id !== idToRemove));
    setErrorMessage('');
  };

  const handleMoveUp = (index) => {
    if (isProcessing || index <= 0) return;
    setFilesWithMeta((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleMoveDown = (index) => {
    if (isProcessing || index >= filesWithMeta.length - 1) return;
    setFilesWithMeta((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleMerge = async () => {
    if (filesWithMeta.length < 2) {
      setErrorMessage(t.errMergeSelectTwo);
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);
    setProcessingStage(t.mergingStagePreparing);

    try {
      const rawFiles = filesWithMeta.map((item) => item.file);
      const mergeResult = await mergePdfFiles(rawFiles, (info) => {
        if (info.stage === 'READING') {
          setProcessingStage(
            t.mergingStageReading
              .replace('{current}', info.current)
              .replace('{total}', info.total)
          );
        } else if (info.stage === 'SAVING') {
          setProcessingStage(t.mergingStageSaving);
        }
      });

      setResult(mergeResult);

      // Trigger auto-download
      if (mergeResult.downloadUrl) {
        const downloadLink = document.createElement('a');
        downloadLink.href = mergeResult.downloadUrl;
        downloadLink.download = mergeResult.fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    } catch (err) {
      console.error('Merge PDF error:', err);
      setErrorMessage(getErrorMessage(err));
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  const handleReset = () => {
    if (result?.downloadUrl) {
      URL.revokeObjectURL(result.downloadUrl);
    }
    setResult(null);
    setFilesWithMeta([]);
    setErrorMessage('');
    setIsProcessing(false);
  };

  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-200">
      {/* Alert Banner for errors */}
      <AlertBanner message={errorMessage} onDismiss={() => setErrorMessage('')} />

      {/* Header */}
      <div className="text-center sm:text-start space-y-1.5 pt-1">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
            {t.mergePdfBadge}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0B1220] dark:text-white tracking-tight">
          {t.mergePdfTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {t.mergePdfSubtitle}
        </p>
      </div>

      {/* State A: File Dropzone (when no files chosen and no result yet) */}
      {filesWithMeta.length === 0 && !result && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleInitialDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-900/70 hover:border-blue-500/80 dark:hover:border-blue-500/70 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 shadow-xs"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            multiple
            onChange={(e) => {
              handleFilesAdded(e.target.files);
              e.target.value = '';
            }}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3.5">
            <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl shadow-2xs">
              📑
            </div>

            <div className="space-y-1">
              <p className="text-sm sm:text-base font-bold text-[#0B1220] dark:text-white">
                <span className="text-blue-600 dark:text-blue-400 hover:underline">
                  {t.selectPdfFiles}
                </span>{' '}
                <span className="text-slate-600 dark:text-slate-400 font-normal">
                  {t.orDragDropPdfs}
                </span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {t.selectTwoOrMorePdfs}
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300">
              <span className="text-emerald-500 dark:text-emerald-400">🔒</span>
              {t.clientSideNotice}
            </div>
          </div>
        </div>
      )}

      {/* State B: Selected Files List & Controls */}
      {filesWithMeta.length > 0 && !result && (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-[#0B1220] dark:text-white">
                {t.selectedFilesCount.replace('{count}', filesWithMeta.length)}
              </h2>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {t.reorderHint}
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              disabled={isProcessing}
              className="text-xs font-semibold text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors px-2 py-1 cursor-pointer disabled:opacity-50"
            >
              {t.clearAll}
            </button>
          </div>

          {/* Files List */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto pe-1">
            {filesWithMeta.map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === filesWithMeta.length - 1;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 p-3 bg-slate-50/80 dark:bg-slate-950/80 rounded-2xl border border-slate-200/70 dark:border-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="h-6 w-6 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-base shrink-0">📄</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-bold text-[#0B1220] dark:text-white truncate" title={item.name}>
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500">
                        <span>{formatBytes(item.size)}</span>
                        {item.pageCount !== null && (
                          <>
                            <span>•</span>
                            <span>
                              {item.pageCount === 1
                                ? t.pageCountSingle.replace('{count}', item.pageCount)
                                : t.pageCountMultiple.replace('{count}', item.pageCount)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Reorder and Remove buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      disabled={isFirst || isProcessing}
                      className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                      title={t.moveUp}
                      aria-label={t.ariaMoveUp}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(index)}
                      disabled={isLast || isProcessing}
                      className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                      title={t.moveDown}
                      aria-label={t.ariaMoveDown}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      disabled={isProcessing}
                      className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-xs transition-colors cursor-pointer ms-0.5"
                      title={t.remove}
                      aria-label={t.ariaRemoveFile}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Append more files input */}
          <div className="pt-1 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => appendInputRef.current?.click()}
              disabled={isProcessing}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>+</span> {t.addMorePdfs}
            </button>
            <input
              ref={appendInputRef}
              type="file"
              accept=".pdf,application/pdf"
              multiple
              onChange={(e) => {
                handleFilesAdded(e.target.files);
                e.target.value = '';
              }}
              className="hidden"
            />
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="p-4 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 rounded-2xl space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-xs text-blue-950 dark:text-blue-200 font-bold">
                <span className="animate-spin inline-block h-4 w-4 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full"></span>
                <span>{processingStage || t.mergingPdfs}</span>
              </div>
            </div>
          )}

          {/* Merge Action Button */}
          {!isProcessing && (
            <button
              type="button"
              onClick={handleMerge}
              disabled={filesWithMeta.length < 2 || isProcessing}
              className="w-full h-12 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white shadow-sm shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>📑</span>
              <span>{t.mergePdfs}</span>
            </button>
          )}
        </div>
      )}

      {/* State C: Merge Success Card */}
      {!isProcessing && result && (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 sm:space-y-5 transition-colors animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-base">✓</span>
              <h2 className="text-sm font-bold">
                {t.filesMergedSuccessfully}
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed ps-6">
              {t.filesMergedDesc.replace('{count}', result.fileCount)}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
            <div className="bg-slate-50/90 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t.filesLabel}
              </span>
              <span className="text-sm sm:text-base font-bold text-[#0B1220] dark:text-slate-100 mt-0.5 block">
                {result.fileCount}
              </span>
            </div>
            <div className="bg-slate-50/90 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t.pagesLabel}
              </span>
              <span className="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">
                {result.totalPages}
              </span>
            </div>
            <div className="bg-slate-50/90 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t.finalSize}
              </span>
              <span className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                {formatBytes(result.finalSizeBytes)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <a
              href={result.downloadUrl}
              download={result.fileName}
              className="w-full h-12 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>⬇</span>
              <span>{t.downloadMergedPdf} ({formatBytes(result.finalSizeBytes)})</span>
            </a>

            <button
              type="button"
              onClick={handleReset}
              className="w-full h-11 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {t.mergeAnotherSet}
            </button>
          </div>
        </div>
      )}

      {/* Navigation link to Tools Hub */}
      <div className="pt-2 text-center">
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>←</span>
          <span>{t.exploreAllTools}</span>
        </Link>
      </div>
    </div>
  );
}
