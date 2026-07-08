"use client";

import React, { useEffect, useMemo, useState } from "react";
import * as faceapi from "face-api.js";

export default function FaceMatch({ eventKey, galleryImages: initialGalleryImages }: { eventKey: string; galleryImages: string[] }) {
  const [galleryImages] = useState<string[]>(initialGalleryImages);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  // Threshold: 0.45-0.60 typical
  // If too strict you miss matches, if too loose you get wrong matches
  const threshold = 0.55;

  // ✅ Backend URL (must serve /uploads)
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // ✅ Convert relative URLs to full backend URLs
  const galleryUrls = useMemo(() => {
    return galleryImages.map((url) => (url.startsWith("http") ? url : `${API_BASE}${url}`));
  }, [galleryImages, API_BASE]);

  /* ✅ Load face-api models once */
  useEffect(() => {
    const loadModels = async () => {
      try {
        setStatus("Loading face models...");

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);

        setModelsLoaded(true);

        if (galleryUrls.length > 0) {
          setStatus("Models loaded. Upload your selfie.");
        } else {
          setStatus("No gallery images found for this event.");
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load face models. Check /models path.");
        setStatus("");
      }
    };

    loadModels();
  }, [galleryUrls.length]);

  /* ---------- Upload handler ---------- */
  const handleSelfie = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!modelsLoaded) {
      setError("Models not loaded yet. Please wait...");
      return;
    }

    if (!galleryUrls.length) {
      setError("No gallery images found for this event.");
      return;
    }

    setLoading(true);
    setError("");
    setMatches([]);
    setStatus("");
    setProgress({ current: 0, total: galleryUrls.length });

    try {
      /* 1) Preview */
      const previewUrl = URL.createObjectURL(file);
      setSelfiePreview(previewUrl);

      /* 2) Convert selfie file -> image */
      const selfieImg = await faceapi.bufferToImage(file);

      /* 3) Detect selfie face */
      setStatus("Detecting face in selfie...");

      const selfieDetection = await faceapi
        .detectSingleFace(
          selfieImg,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 512,
            scoreThreshold: 0.5,
          }),
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!selfieDetection) {
        setError("No face detected in selfie. Try a clearer photo.");
        setLoading(false);
        setStatus("");
        return;
      }

      /* 4) Create matcher */
      const labeledDescriptor = new faceapi.LabeledFaceDescriptors("SELFIE", [selfieDetection.descriptor]);

      const matcher = new faceapi.FaceMatcher(labeledDescriptor, threshold);

      /* 5) Match with gallery */
      setStatus("Matching with gallery photos...");

      const matched: string[] = [];

      for (let i = 0; i < galleryUrls.length; i++) {
        const src = galleryUrls[i];

        setProgress({ current: i + 1, total: galleryUrls.length });

        const img = await loadImageSafe(src);
        if (!img) continue;

        // ✅ IMPORTANT CHANGE:
        // Detect ALL faces in the gallery image (couple photo etc.)
        const detections = await faceapi
          .detectAllFaces(
            img,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 512,
              scoreThreshold: 0.5,
            }),
          )
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (!detections.length) continue;

        // If ANY face matches, include the image
        const hasMatch = detections.some((d) => {
          const bestMatch = matcher.findBestMatch(d.descriptor);
          return bestMatch.label === "SELFIE";
        });

        if (hasMatch) matched.push(src);
      }

      setMatches(matched);

      if (matched.length === 0) {
        setStatus("No matching photos found.");
      } else {
        setStatus(`Found ${matched.length} matching photos.`);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Face matching failed. Check console.");
      setStatus("");
      setLoading(false);
    }
  };

  const clearAll = () => {
    setSelfiePreview(null);
    setMatches([]);
    setError("");
    setStatus(modelsLoaded ? "Upload your selfie." : "");
    setProgress({ current: 0, total: 0 });
  };

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h2 style={{ fontSize: 26, fontWeight: 700 }}>Find My Photos</h2>

      <p style={{ marginTop: 6, color: "#6b7280" }}>
        Event: <b>{eventKey}</b>
      </p>

      <p style={{ marginTop: 6, color: "#6b7280" }}>
        Total Gallery Images: <b>{galleryUrls.length}</b>
      </p>

      {/* Upload Box */}
      <div
        style={{
          marginTop: 18,
          padding: 16,
          borderRadius: 14,
          border: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ minWidth: 260 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Upload OR Camera</h3>

            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleSelfie}
              disabled={!modelsLoaded || loading}
              style={{ marginTop: 10 }}
            />

            <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
              <button
                onClick={clearAll}
                disabled={loading}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                  background: "#f9fafb",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                Clear
              </button>
            </div>

            {/* Status */}
            <div style={{ marginTop: 14 }}>
              {loading && (
                <p style={{ color: "#111827" }}>
                  Matching... {progress.current}/{progress.total}
                </p>
              )}

              {status && <p style={{ color: "#111827", marginTop: 6 }}>{status}</p>}

              {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
            </div>
          </div>

          {/* Selfie Preview */}
          <div style={{ flex: 1, minWidth: 260 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Selfie Preview</h3>

            <div
              style={{
                marginTop: 10,
                height: 220,
                borderRadius: 14,
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                background: "#fafafa",
              }}
            >
              {selfiePreview ? (
                <img src={selfiePreview} alt="Selfie Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <p style={{ color: "#6b7280" }}>No selfie uploaded</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Matched Gallery */}
      <div style={{ marginTop: 22 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700 }}>Matched Photos ({matches.length})</h3>

        <div
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          {matches.map((src) => (
            <div
              key={src}
              style={{
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid #e5e7eb",
                background: "#fff",
              }}
            >
              <img
                src={src}
                alt=""
                style={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          ))}
        </div>

        {!loading && matches.length === 0 && !error && modelsLoaded && (
          <p style={{ marginTop: 12, color: "#6b7280" }}>No matching photos found.</p>
        )}
      </div>
    </div>
  );
}

/* ---------- SAFE IMAGE LOADER ---------- */
function loadImageSafe(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
  });
}
