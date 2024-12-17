export const AIRTABLE_CONFIG = {
  TABLES: {
    STYLES: 'Styles',
    VIDEOS: 'Reaction Videos',
  },
  VIEWS: {
    DEFAULT: 'Grid view',
    SELECT_STYLE: 'Select Style',
    RECORD_REACTION: 'Record Reaction',
    ALL_DATA: 'All Data & Fields',
  },
} as const;

export const ERROR_MESSAGES = {
  MISSING_TOKEN: 'Missing Airtable personal access token',
  MISSING_BASE_ID: 'Missing Airtable base ID',
  INVALID_TOKEN_FORMAT: 'Invalid personal access token format. Token should start with "pat."',
  FETCH_STYLES: 'Failed to fetch styles from Airtable. Please check your authentication credentials.',
  FETCH_VIDEOS: 'Failed to fetch videos from Airtable. Please check your authentication credentials.',
  CREATE_VIDEO: 'Failed to create video in Airtable',
  INVALID_RECORD: 'Invalid record data received from Airtable',
  AUTHENTICATION: 'Authentication failed. Please check your Airtable personal access token.',
  RID_NOT_FOUND: 'Could not find the video record ID',
  UPDATE_FAILED: 'Failed to update the reaction video',
} as const;