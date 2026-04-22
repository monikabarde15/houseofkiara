import React, { useState } from "react";
import "../../../../styles/LYP/wizard/formPanels.css";
import { Image } from 'lucide-react';

const Step3 = ({ onNext, onBack }) => {
    const [photos, setPhotos] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState("");

    const isValid = photos.length >= 3;

    const handleFiles = (files) => {
        let newFiles = Array.from(files);

        // reset error
        setError("");

        // ✅ filter only images
        newFiles = newFiles.filter(file => {
            if (!file.type.startsWith("image/")) {
                setError("Only image files are allowed");
                return false;
            }
            return true;
        });

        // ✅ file size check (20MB)
        newFiles = newFiles.filter(file => {
            if (file.size > 20 * 1024 * 1024) {
                setError("Each file must be under 20MB");
                return false;
            }
            return true;
        });

        // ✅ limit total = 15
        if (photos.length + newFiles.length > 15) {
            setError("Maximum 15 photos allowed");
            newFiles = newFiles.slice(0, 15 - photos.length);
        }

        const updated = [...photos, ...newFiles];
        setPhotos(updated);
    };

    const handleChange = (e) => {
        handleFiles(e.target.files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
    };

    const removePhoto = (index) => {
        const updated = photos.filter((_, i) => i !== index);
        setPhotos(updated);
    };

    const handleSubmit = () => {
        if (photos.length < 3) {
            setError("Please upload at least 3 photos to continue");
            return;
        }

        setError("");
        onNext(); // move to step 4
    };

    return (
        <div className="lyp-step">

            {/* HEADER (reuse your system) */}
            <div className="lyp-step__header">
                <div className="lyp-step__eyebrow">STEP 3 OF 4</div>

                <h2 className="lyp-step__title">
                    Photos of your piece
                </h2>

                <p className="lyp-step__subtitle">
                    Good photos mean faster approval. Natural daylight and a plain wall is all you need. Minimum 3, up to 15.
                </p>
            </div>

            {/* UPLOAD COUNTER */}
            {photos.length > 0 && (
                <div className="lyp-upload">

                    <div className="lyp-upload__top">
                        <span className="lyp-upload__text">
                            {photos.length} / 15 photos
                        </span>

                        {photos.length < 3 && (
                            <span className="lyp-upload__warning">
                                Min. 3 required
                            </span>
                        )}
                    </div>

                    <div className="lyp-upload__bar">
                        <div
                            className="lyp-upload__fill"
                            style={{ width: `${(photos.length / 15) * 100}%` }}
                        />
                    </div>

                </div>
            )}

            {/* GRID */}
            {photos.length > 0 && (
                <div className="lyp-photo-grid">

                    {photos.map((file, index) => (
                        <div key={index} className="lyp-photo-item">

                            <img
                                src={URL.createObjectURL(file)}
                                alt=""
                            />

                            <button
                                className="lyp-photo-remove"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removePhoto(index);
                                }}
                            >
                                ×
                            </button>

                        </div>
                    ))}

                </div>
            )}

            {/* DROPZONE */}
            <div
                className={`lyp-dropzone ${dragActive ? "drag" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                />

                <div className="lyp-dropzone__inner">

                    <div className="lyp-dropzone__icon-box">
                        <span className="lyp-dropzone__icon"><Image /></span>
                    </div>

                    <div className="lyp-dropzone__title">
                        Drop photos here
                    </div>

                    <div className="lyp-dropzone__subtitle">
                        JPG, PNG or HEIC · Max 20MB per photo
                    </div>

                    <button className="lyp-dropzone__select">
                        SELECT PHOTOS
                    </button>

                </div>
                
            </div>


            {/* TIPS */}
            <div className="lyp-photo-tips">

                <div className="lyp-photo-tips__title">
                    WHAT MAKES A GREAT SUBMISSION PHOTO
                </div>

                <ul className="lyp-photo-tips__list">
                    <li>Full-length front view — on a hanger, mannequin, or worn</li>
                    <li>Close-up of key embroidery or embellishments</li>
                    <li>Back view of the blouse or top</li>
                    <li>Any wear, alteration, or repair — photographed clearly</li>
                    <li>Dupatta and accessories if included in the set</li>
                </ul>

                {error && (
                    <div className="lyp-upload__error">
                        {error}
                    </div>
                )}

            </div>

            {/* CTA  */}
            <div className="lyp-step__cta">

                <button className="lyp-btn-back">
                    <span className="lyp-btn-back-icon">‹</span>
                    BACK
                </button>

                <div className="lyp-step__progress">
                    Step 3 of 4
                </div>

                <button className="lyp-btn-primary"
                    onClick={handleSubmit}
                >
                    REVIEW SUBMISSION
                    <span className="lyp-btn-arrow">›</span>
                </button>

            </div>

        </div>
    );
};

export default Step3;