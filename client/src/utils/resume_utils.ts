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
