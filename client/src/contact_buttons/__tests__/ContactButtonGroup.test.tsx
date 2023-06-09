// test ContactButtonGroup.tsx
import { render, screen } from '@testing-library/react';
import ContactButtonGroup from '../ContactButtonGroup';
import { useGetSelectedResume } from '../../hooks/useResume';
import { mockResume } from '../../test_utils/apiMocks';

//mock the useGetSelectedResume hook
jest.mock('../../hooks/useResume');

// tests that the ContactButtonGroup renders the correct buttons based on the contacts in the mockResume
describe('ContactButtonGroup', () => {
  const mockContacts = [
    'linkedin.com/in/john-doe',
    'github.com/john-doe',
    'john-doe@email.com',
    'instagram.com/john-doe',
  ];
  beforeEach(() => {
    (useGetSelectedResume as jest.Mock).mockReturnValue({
      ...mockResume,
      contacts: mockContacts,
    });
  });

  it('renders the correct buttons', () => {
    render(<ContactButtonGroup />);
    // get all the contact button links
    const links = screen.getAllByRole('link');
    // contact buttons does not include the email button
    expect(links).toHaveLength(3);
    // each contact button has the correct icon and the correct href
    expect(links[0]).toHaveAttribute(
      'href',
      'https://linkedin.com/in/john-doe'
    );
    expect(links[0]).toContainHTML('LinkedInIcon');
    expect(links[1]).toHaveAttribute('href', 'https://github.com/john-doe');
    expect(links[1]).toContainHTML('GitHubIcon');
    expect(links[2]).toHaveAttribute('href', 'https://instagram.com/john-doe');
    expect(links[2]).toContainHTML('InstagramIcon');
  });
});
