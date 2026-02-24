// src/pages/register/Steps/StepTrainerDocuments.tsx
import React, { useState, useRef } from "react";
import type { RegisterFormData, Certificate } from "../types";
import FormLabel from "../../../components/FormLabel";
// import axios from "axios";

type Props = {
  formData: RegisterFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>;
  onNext: () => void;
  onBack: () => void;
};

async function fileToBase64(file: File | null): Promise<string> {
  if (!file) return "";
  return await new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(String(reader.result || ""));
    reader.onerror = () => rej(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function StepTrainerDocuments({
  formData,
  setFormData,
  onNext,
  onBack,
}: Props) {
  const [localCerts, setLocalCerts] = useState<Certificate[]>(
    formData.certificates || [],
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [resumeName, setResumeName] = useState<string>("");


  const addEmptyCert = () => {
    setLocalCerts((prev) => [
      ...prev,
      {
        name: "",
        issuer: "",
        issueYear: null,
        certificateLink: "",
        issuedDate: null,
        certificateImage: "",
      },
    ]);
  };

  const updateCert = (idx: number, field: keyof Certificate, value: any) => {
    setLocalCerts((prev) => {
      const copy = [...prev];
      const cert = { ...(copy[idx] || {}) };
      (cert as any)[field] = value;
      copy[idx] = cert;
      return copy;
    });
  };

  const removeCert = (idx: number) => {
    setLocalCerts((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleResumeFile = async (f: File) => {
    setResumeName(f.name);

    // store file locally only
    setFormData((prev) => ({
      ...prev,
      resume: f,
    }));
  };

  const handlePreview = () => {
    if (formData.resume instanceof File) {
      const url = URL.createObjectURL(formData.resume);
      window.open(url, "_blank");
    }
  };

  // const handleResumeFile = async (f: File) => {
  //   setUploading(true);
  //   setUploadProgress(0);
  //   try {
  //     //  Get the signed URL
  //     const { data } = await axios.post(
  //       `${API_BASE_URL}/api/upload/get-upload-url`,
  //       {
  //         fileName: f.name,
  //         fileType: f.type,
  //       },
  //     );

  //     //  Upload with progress tracking
  //     await axios.put(data.uploadUrl, f, {
  //       headers: { "Content-Type": f.type },
  //       onUploadProgress: (progressEvent) => {
  //         const percentCompleted = Math.round(
  //           (progressEvent.loaded * 100) / (progressEvent.total || f.size),
  //         );
  //         setUploadProgress(percentCompleted);
  //       },
  //     });

  //     setFormData((prev) => ({ ...prev, resume: data.key }));
  //     setResumeName(f.name);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Upload failed");
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  // const handlePreview = async () => {
  //   if (!formData.resume) return; // formData.resume is now the 'key'
  //   try {
  //     const { data } = await axios.post(
  //       `${API_BASE_URL}/api/upload/get-download-url`,
  //       {
  //         fileKey: formData.resume,
  //       },
  //     );
  //     window.open(data.signedUrl, "_blank");
  //   } catch (err) {
  //     alert("Could not generate preview link");
  //   }
  // };

  const handleCertImageFile = async (idx: number, f?: File | null) => {
    if (!f) return;
    const b64 = await fileToBase64(f);
    updateCert(idx, "certificateImage", b64);
  };

  const validateAndNext = () => {
    // if (
    //   !formData.resume ||
    //   typeof formData.resume !== "string" ||
    //   formData.resume.length === 0
    // )
    if (!formData.resume) {
      return alert("Please upload your resume (PDF or doc).");
    }

    for (let i = 0; i < localCerts.length; i++) {
      if (!localCerts[i].name || localCerts[i].name.trim() === "") {
        return alert(
          `Please provide a name for certificate #${i + 1} or remove it.`,
        );
      }
    }

    setFormData((prev) => ({ ...prev, certificates: localCerts }));
    onNext();
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="overflow-y-auto pr-1">
        <h3 className="text-2xl font-bold mb-3">Trainer documents</h3>
        <p className="text-sm text-gray-500 mb-4">
          Upload your resume and add certificates.
        </p>

        {/* Resume Upload */}
        <div className="mb-5">
          <FormLabel required>Resume (PDF / DOC)</FormLabel>

          {/* Hide the ugly default file input label */}
          <label className="inline-block px-3 py-2 border rounded cursor-pointer bg-white">
            Choose File
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (f) await handleResumeFile(f);
              }}
            />

            <div className="mt-2 text-sm text-gray-700">
              {resumeName ? (
                <span>Selected: {resumeName}</span>
              ) : (
                <span className="text-gray-500">No file chosen</span>
              )}

            </div>
          </label>

          {formData.resume && (
            <div className="mt-3 p-3 border rounded bg-gray-50 flex justify-between items-center">
              <span className="text-sm">File Selected</span>
              <div className="space-x-4">
                <button
                  onClick={handlePreview}
                  className="text-blue-600 text-sm underline"
                >
                  Preview
                </button>
                <button
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, resume: null }));
                    setResumeName("");
                    // fix for reselecting same resume
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="text-red-600 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Certificates */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Certificates</div>
            <button
              onClick={addEmptyCert}
              className="px-3 py-1 border rounded text-sm"
            >
              Add certificate
            </button>
          </div>

          {localCerts.length === 0 && (
            <div className="text-sm text-gray-500">
              No certificates added yet.
            </div>
          )}
          {/* cert list section */}
          <div className="space-y-4">
            {localCerts.map((cert, idx) => (
              <div key={idx} className="p-3 border rounded">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">Certificate #{idx + 1}</div>
                  <button
                    className="text-sm text-red-600"
                    onClick={() => removeCert(idx)}
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <input
                    placeholder="Certificate name (required)"
                    value={cert.name}
                    onChange={(e) => updateCert(idx, "name", e.target.value)}
                    className="p-2 border rounded"
                  />
                  <input
                    placeholder="Issuer (organization)"
                    value={cert.issuer || ""}
                    onChange={(e) => updateCert(idx, "issuer", e.target.value)}
                    className="p-2 border rounded"
                  />
                  <input
                    placeholder="Year (optional)"
                    value={cert.issueYear ?? ""}
                    onChange={(e) =>
                      updateCert(
                        idx,
                        "issueYear",
                        Number(e.target.value) || null,
                      )
                    }
                    className="p-2 border rounded"
                  />
                  <input
                    placeholder="Certificate link (optional)"
                    value={cert.certificateLink || ""}
                    onChange={(e) =>
                      updateCert(idx, "certificateLink", e.target.value)
                    }
                    className="p-2 border rounded"
                  />

                  <label className="text-sm">
                    Certificate image (optional)
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (f) await handleCertImageFile(idx, f);
                    }}
                  />

                  {cert.certificateImage && (
                    <div className="mt-2 p-2 border rounded bg-gray-50">
                      <img
                        src={
                          typeof cert.certificateImage === "string"
                            ? cert.certificateImage
                            : undefined
                        }
                        className="h-24 w-auto rounded border"
                        alt="certificate preview"
                      />

                      <div className="flex justify-between items-center mt-2">
                        <a
                          href={
                            typeof cert.certificateImage === "string"
                              ? cert.certificateImage
                              : undefined
                          }
                          target="_blank"
                          className="text-blue-600 text-xs underline"
                        >
                          View full image
                        </a>

                        <button
                          className="text-red-600 text-xs"
                          onClick={() =>
                            updateCert(idx, "certificateImage", "")
                          }
                        >
                          Remove Image
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button onClick={onBack} className="px-4 py-2 rounded-lg border">
          Back
        </button>
        <button
          onClick={validateAndNext}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
