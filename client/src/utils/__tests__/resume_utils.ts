// test resume_utils.ts:
import { getResumeEmail, getEmailHrefWithTemplate } from '../resume_utils';
import { mockResume } from '../../test_utils/apiMocks';

describe('getResumeEmail', () => {
  it('should return undefined if resume is undefined', () => {
    const [email, index] = getResumeEmail(undefined);
    expect(email).toBeUndefined();
    expect(index).toBe(-1);
  });

  it('should return undefined if resume has no contacts', () => {
    const [email, index] = getResumeEmail({ ...mockResume, contacts: [] });
    expect(email).toBeUndefined();
    expect(index).toBe(-1);
  });

  it('should return the email and index if resume has contacts', () => {
    const [email, index] = getResumeEmail({
      ...mockResume,
      contacts: [
        'linkedin.com/in/abc',
        'github.com/abc',
        'email@me.com',
        '123-456-7890',
      ],
    });
    expect(email).toBe('email@me.com');
    expect(index).toBe(2);
  });
});

describe('getEmailHrefWithTemplate', () => {
  it('should return the email href with the default template', () => {
    const emailHref = getEmailHrefWithTemplate(
      'email@me.com',
      'John Doe',
      'Software Engineer'
    );
    expect(emailHref).toBe(
      'mailto:email@me.com' +
        '?subject=Interest%20in%20Your%20Software%20Engineer%20Profile' +
        '&body=Hello%20John%2C%0A%0AI%20came%20across%20your%20profile%20and%20am%20interested%20in%20your%20skills%20and%20experience.%20Would%20you%20be%20available%20for%20a%20discussion%20regarding%20potential%20opportunities%20at%20our%20company%3F%0A%0AKind%20regards%2C%0A%5BYour%20Name%5D'
    );
  });
});
