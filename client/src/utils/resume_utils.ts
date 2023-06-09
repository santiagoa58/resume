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

export const getEmailHrefWithTemplate = (
  email: string,
  name?: string,
  job_title?: string
) => {
  const firstName = name?.split(' ')[0];
  let title = job_title?.toLowerCase() ?? 'software engineer';
  //capitalize every first letter of title
  title = title.replace(/\b(\w)/g, (s) => s.toUpperCase());
  const subject = encodeURIComponent(
    `Interest in Your ${title ?? 'Software Engineer'} Profile`
  );
  const body = encodeURIComponent(
    `Hello ${
      firstName ?? 'there'
    },\n\nI came across your profile and am interested in your skills and experience. Would you be available for a discussion regarding potential opportunities at our company?\n\nKind regards,\n[Your Name]`
  );
  return `mailto:${email}?subject=${subject}&body=${body}`;
};
