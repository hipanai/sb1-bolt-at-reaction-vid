import Airtable from 'airtable';

let airtableBase: any = null;

export function configureAirtable() {
  const token = localStorage.getItem('airtable_token');
  const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    return null;
  }

  if (!airtableBase) {
    Airtable.configure({
      endpointUrl: 'https://api.airtable.com',
      apiKey: token,
    });
    airtableBase = Airtable.base(baseId);
  }

  return airtableBase;
}

export function getBase() {
  return configureAirtable();
}