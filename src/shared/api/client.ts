import axios from 'axios';

import {GITHUB_BASE_URL} from '@shared/constants/api';

export const githubClient = axios.create({
  baseURL: GITHUB_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github+json',
  },
});