"use client";

import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Serve the PDF.js worker from our own bundle instead of a third-party CDN
// (keeps the version in sync with pdfjs-dist and avoids loading remote code).
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const PdfViewer = ({ url }: { url: string }) => {
  const [numPages, setNumPages] = React.useState(1);
  const [pageNumber, setPageNumber] = React.useState(1);

  // Callback to set number of pages when the document is loaded
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="w-full rounded-2xl bg-slate-100 p-4">
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        className="pdf-viewer flex justify-center"
      >
        <Page pageNumber={pageNumber} />
      </Document>

      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          className="rounded-lg bg-primary-green px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          onClick={() => setPageNumber(pageNumber - 1)}
          disabled={pageNumber <= 1}
        >
          Previous
        </button>
        <span className="text-sm font-medium text-slate-700">
          Page {pageNumber} of {numPages}
        </span>
        <button
          className="rounded-lg bg-primary-green px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          onClick={() => setPageNumber(pageNumber + 1)}
          disabled={pageNumber >= numPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PdfViewer;
