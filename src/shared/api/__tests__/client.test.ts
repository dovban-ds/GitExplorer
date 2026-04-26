import {githubClient} from '../client';

describe('githubClient', () => {
  it('has the correct baseURL', () => {
    expect(githubClient.defaults.baseURL).toBe('https://api.github.com');
  });

  it('sets Content-Type to application/json', () => {
    expect(githubClient.defaults.headers['Content-Type']).toBe(
      'application/json',
    );
  });

  it('sets Accept to the GitHub JSON media type', () => {
    expect(githubClient.defaults.headers.Accept).toBe(
      'application/vnd.github+json',
    );
  });
});
