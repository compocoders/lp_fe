import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { updateClassroom } from '../../api/classroom.api';
import {
  ModalBackdrop, ModalCard, ModalHeader, FormInput, FormTextarea,
  ModalFooter, ModalCancelButton, ModalPrimaryButton,
} from './ClassroomModal';

const UpdateClassroomModal = ({ isOpen, onClose, classroom, onSuccess }) => {
  const [updateData, setUpdateData] = useState({ name: '', description: '', private: false, roomPassword: '', oldPassword: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    if (isOpen && classroom) {
      setUpdateData({
        name: classroom.name || '',
        description: classroom.description || '',
        private: classroom.private || false,
        roomPassword: '',
        oldPassword: '',
      });
      setUpdateError('');
    }
  }, [isOpen, classroom]);

  const handleSubmit = async () => {
    try {
      setIsUpdating(true);
      setUpdateError('');
      const payload = { name: updateData.name, description: updateData.description, private: updateData.private };
      if (updateData.private && updateData.roomPassword) {
        payload.roomPassword = updateData.roomPassword;
        if (classroom.private) payload.oldPassword = updateData.oldPassword;
      }
      const updated = await updateClassroom(classroom.id, payload);
      onSuccess?.(updated);
      onClose();
    } catch (err) {
      setUpdateError(err.response?.data?.message || err.message || 'Failed to update classroom');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen || !classroom) return null;

  return (
    <ModalBackdrop>
      <ModalCard>
        <ModalHeader title="Update Classroom" subtitle="Modify your classroom's information." onClose={onClose} gradientHeader />
        <div className="px-6 py-5 flex flex-col gap-4">
          {updateError && (
            <div className="px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
              <X size={15} className="shrink-0 text-red-550 dark:text-red-400" /> {updateError}
            </div>
          )}
          <FormInput label="Classroom Name" value={updateData.name} onChange={e => setUpdateData({ ...updateData, name: e.target.value })} placeholder="Classroom name" />
          <FormTextarea label="Description" value={updateData.description} onChange={e => setUpdateData({ ...updateData, description: e.target.value })} />
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-[#5D7C59] dark:text-[#7A9A7B] uppercase tracking-widest">Privacy</label>
            <select
              value={updateData.private ? 'private' : 'public'}
              onChange={e => setUpdateData({ ...updateData, private: e.target.value === 'private' })}
              className="w-full px-4 py-3 bg-[#FAFCFA] dark:bg-[#232B23] border-2 border-gray-200 dark:border-white/10 rounded-xl text-gray-805 dark:text-gray-200 text-sm font-medium outline-none focus:border-[#5D7C59] dark:focus:border-[#7A9A7B] transition-all cursor-pointer"
            >
              <option value="public">Public — Anyone can join</option>
              <option value="private">Private — Invite only</option>
            </select>
          </div>
          {updateData.private && (
            <div className="flex flex-col gap-3 p-4 bg-[#FAFCFA] dark:bg-[#232B23] rounded-xl border border-gray-100 dark:border-white/5 transition-colors">
              <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">
                {classroom.private ? 'To change the password, enter the old one below.' : 'Set a new password for your private classroom.'}
              </p>
              {classroom.private && (
                <FormInput label="Previous Password" type="password" value={updateData.oldPassword} onChange={e => setUpdateData({ ...updateData, oldPassword: e.target.value })} placeholder="Leave blank to keep current" />
              )}
              <FormInput
                label={classroom.private ? 'New Password' : 'Password'}
                type="password"
                value={updateData.roomPassword}
                onChange={e => setUpdateData({ ...updateData, roomPassword: e.target.value })}
                placeholder={classroom.private ? 'Leave blank to keep current' : 'Enter a secure password'}
              />
            </div>
          )}
        </div>
        <ModalFooter>
          <ModalCancelButton onClick={onClose} disabled={isUpdating} />
          <ModalPrimaryButton onClick={handleSubmit} loading={isUpdating} loadingText="Saving...">
            Save Changes
          </ModalPrimaryButton>
        </ModalFooter>
      </ModalCard>
    </ModalBackdrop>
  );
};

export default UpdateClassroomModal;
