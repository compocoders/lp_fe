import React, { useEffect, useState } from 'react';
import { FileText, UploadCloud, Check, X } from 'lucide-react';
import {
  ModalBackdrop, ModalCard, ModalHeader, FormInput, FormTextarea,
  ModalFooter, ModalCancelButton, ModalPrimaryButton,
} from './ClassroomModal';
import Loading from '../common/Loading';
import { createLearningMaterial } from '../../api/learningMaterials.api';

const CreateLearningMaterialModal = ({ isOpen, onClose, classroom, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setFilePreview(null);
      setFile(null);
      setIsSubmitting(false);
      setSuccess(false);
      setError('');
    }
  }, [isOpen]);

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
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('file', file);

      const response = await createLearningMaterial(classroom.id, formData);
      setSuccess(true);
      onSuccess?.(response.learningMaterial);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload learning material');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalBackdrop>
      <ModalCard>
        <ModalHeader
          title="Create Learning Material"
          subtitle="Upload files for your classroom."
          onClose={isSubmitting ? null : handleClose}
          gradientHeader
        />
        {success ? (
          <div className="px-6 py-12 flex flex-col items-center justify-center bg-white dark:bg-[#1A211A] text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 mb-2">
              <Check size={36} strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Material Uploaded!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your learning material has been successfully uploaded to the classroom.</p>
          </div>
        ) : isSubmitting ? (
          <div className="px-6 py-12 flex items-center justify-center bg-white dark:bg-[#1A211A]">
            <Loading text="Uploading material..." />
          </div>
        ) : (
          <>
            <div className="px-4 md:px-6 py-4 md:py-5 flex flex-col gap-4 md:gap-5">
              {error && (
                <div className="px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
                  <X size={15} className="shrink-0 text-red-500 dark:text-red-450" /> {error}
                </div>
              )}
              <FormInput label="Material Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Week 1 Lecture Notes" />
              <FormTextarea
                label="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Briefly describe what this material covers (optional)"
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#5D7C59] dark:text-[#7A9A7B] uppercase tracking-widest">Upload File</label>
                <div className="w-full aspect-video bg-[#FAFCFA] dark:bg-[#232B23] rounded-2xl border-2 border-dashed border-[#5D7C59]/25 dark:border-white/10 hover:border-[#5D7C59] dark:hover:border-[#7A9A7B] hover:bg-[#5D7C59]/4 dark:hover:bg-[#5D7C59]/10 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange} />
                  {filePreview ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#5D7C59] dark:bg-[#7A9A7B] flex items-center justify-center">
                        <FileText size={24} className="text-white dark:text-[#1A211A]" />
                      </div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{filePreview}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-550">Click to replace file</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2.5 p-6 text-center">
                      <div className="w-12 h-12 rounded-xl bg-[#5D7C59]/10 dark:bg-[#5D7C59]/20 flex items-center justify-center mb-1">
                        <UploadCloud size={24} className="text-[#5D7C59] dark:text-[#7A9A7B]" />
                      </div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Drag and drop your file here</p>
                      <p className="text-xs text-gray-400 dark:text-gray-550">or click to browse from your computer</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <ModalFooter>
              <ModalCancelButton onClick={handleClose} disabled={isSubmitting} />
              <ModalPrimaryButton onClick={handleSubmit} disabled={isSubmitting}>
                Upload Material
              </ModalPrimaryButton>
            </ModalFooter>
          </>
        )}
      </ModalCard>
    </ModalBackdrop>
  );
};

export default CreateLearningMaterialModal;
