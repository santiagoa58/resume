import { IResume } from '../types/api_types';

/**
 * Returns the email of the resume and the index of the email in the contacts array
 * @param resume the resume to get the email from
 * @returns a tuple of the email and the index of the email in the contacts array
 */
export const getResumeEmail = (
  resume: IResume | undefined
): [string | undefined, number] => {
  if (!resume?.contacts.length) {
    return [undefined, -1];
  }
  const resumeIndex = resume.contacts.findIndex((contact) =>
    contact.includes('@')
  );
  return [resume.contacts[resumeIndex], resumeIndex];
};
