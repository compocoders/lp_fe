import React, { useEffect, useState } from 'react';
import { FileText, UploadCloud, Check, X } from 'lucide-react';
import {
  ModalBackdrop, ModalCard, ModalHeader, FormInput, FormTextarea,
  ModalFooter, ModalCancelButton, ModalPrimaryButton,
} from './ClassroomModal';
import Loading from '../common/Loading';
import { updateLearningMaterial } from '../../api/learningMaterials.api';

const UpdateLearningMaterialModal = ({ isOpen, onClose, classroom, material, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && material) {
      setTitle(material.title || '');
      setDescription(material.description || '');
      setFile(null);
      setFilePreview(null);
      setIsSubmitting(false);
      setSuccess(false);
      setError('');
    }
  }, [isOpen, material]);

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setFilePreview(selected.name);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Please provide a title for the material.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (file) formData.append('file', file);

      const response = await updateLearningMaterial(classroom.id, material.id, formData);
      setSuccess(true);
      onSuccess?.(response.learningMaterial);
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update learning material.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !material) return null;

  // Derive a short filename from the stored fileUrl
  const existingFileName = material.fileUrl
    ? material.fileUrl.split('/').pop()
    : null;

  return (
    <ModalBackdrop>
      <ModalCard>
        <ModalHeader
          title="Update Learning Material"
          subtitle="Replace or edit this material's information."
          onClose={isSubmitting ? null : handleClose}
          gradientHeader
        />
        {success ? (
          <div className="px-6 py-12 flex flex-col items-center justify-center bg-white dark:bg-[#1A211A] text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 mb-2">
              <Check size={36} strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Material Updated!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">The learning material has been successfully updated.</p>
          </div>
        ) : isSubmitting ? (
          <div className="px-6 py-12 flex items-center justify-center bg-white dark:bg-[#1A211A]">
            <Loading text="Updating material..." />
          </div>
        ) : (
          <>
            <div className="px-6 py-5 flex flex-col gap-5">
              {error && (
                <div className="px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium flex items-center gap-2">
                  <X size={15} className="shrink-0" /> {error}
                </div>
              )}
              <FormInput
                label="Material Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Week 1 Lecture Notes"
              />
              <FormTextarea
                label="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Briefly describe what this material covers (optional)"
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#5D7C59] dark:text-[#7A9A7B] uppercase tracking-widest">
                  Replace File <span className="normal-case font-normal text-gray-400">(optional — leave empty to keep current)</span>
                </label>
                <div className="w-full aspect-video bg-[#FAFCFA] dark:bg-[#232B23] rounded-2xl border-2 border-dashed border-[#5D7C59]/25 dark:border-white/10 hover:border-[#5D7C59] dark:hover:border-[#7A9A7B] hover:bg-[#5D7C59]/4 dark:hover:bg-[#5D7C59]/10 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange} />
                  {filePreview ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#5D7C59] dark:bg-[#7A9A7B] flex items-center justify-center">
                        <FileText size={24} className="text-white dark:text-[#1A211A]" />
                      </div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{filePreview}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Click to replace again</p>
                    </div>
                  ) : existingFileName ? (
                    <div className="flex flex-col items-center gap-2.5 p-6 text-center">
                      <div className="w-12 h-12 rounded-xl bg-[#5D7C59]/10 dark:bg-[#5D7C59]/20 flex items-center justify-center mb-1">
                        <FileText size={24} className="text-[#5D7C59] dark:text-[#7A9A7B]" />
                      </div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate max-w-[200px]">{existingFileName}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Current file · Click to replace</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2.5 p-6 text-center">
                      <div className="w-12 h-12 rounded-xl bg-[#5D7C59]/10 dark:bg-[#5D7C59]/20 flex items-center justify-center mb-1">
                        <UploadCloud size={24} className="text-[#5D7C59] dark:text-[#7A9A7B]" />
                      </div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Click to select a replacement file</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <ModalFooter>
              <ModalCancelButton onClick={handleClose} disabled={isSubmitting} />
              <ModalPrimaryButton onClick={handleSubmit} loading={isSubmitting} loadingText="Saving...">
                Save Changes
              </ModalPrimaryButton>
            </ModalFooter>
          </>
        )}
      </ModalCard>
    </ModalBackdrop>
  );
};

export default UpdateLearningMaterialModal;
