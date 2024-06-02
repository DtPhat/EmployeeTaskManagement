const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
// const serviceAccount = require('./serviceAccountKey.json');

const serviceAccountKey = {
  "type": "service_account",
  "project_id": "skipli-cf6b8",
  "private_key_id": "929ef5ccf3110fbde83ea476324122f684bbbae6",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDP8CqyYAQPcKdz\nc4yMa4nib6iP7D7wcCBzqkaYJPsmcIQT2F26zhZfPz5miovPiNHjBSEIuClTPrl5\nR9Xlsy4/Wvx4Mdb6ot1zKlUsrWNxlNlcp2flSK0YP1P48Yx6kqpMRAJf1tk8XUjU\nWAyvEmnU3ShDxyXZ/8dI3pSwRWbfy3xGZfW0ttHjBFOrPCN6mYi9KBELI44ydnaR\nwYganklbsYWj9dqm/LGpGQldp4fsJpxb93HlYJAy3z9kVk9OyBegcnwow5S0PDt9\nSljEuGM6KSifFNBLDN/avwqZxhvHmNDqt2sXDcgW/Swu8ylFQfYZfpS4BBKzExVq\naz0DmaFfAgMBAAECggEAAeaJDV5RSy7VaPm6ZCIrfXVVzhLztFDiCwyYXpWf8gb/\nPgsxOB7gF3jFgjxr8LaobHHEjobYYdll6pTcgJ/1oUCcpCCYfWv1qDLP2nuvN/+L\nSQyCp5bVdi5F/zV9+jTS96V7fBLDo4iavM4dN5BshTSMRKpSTz7GPIVESKQpv4vh\nWSJln99RQwJrzxC015nrY0lVqScXx17omluIbeapeJvhg8s4hfn+C07CPwL6+J1S\nUyUYVIYZqZ63HgLJGnv2zvTTTckq06SHTAiv4hAx6Xvoxb22s5Khgw4rPtoWasUZ\naZVKUYWouoU2oRIuHUaK0ecOoYmivWaYNBPXMTntuQKBgQD4x7p/LWM0Lk0qIrxf\n9xZgBZbyQMliDzgO6bJyJuZyADgUYnIWwvdhhXd/UigJVODXd1pJXLYsDVzb/gQk\n3fMYOwi4MWqAnj+1RAIPOqAZj027R0G0v01/PbCHcNG7ecaht9sy2q3P1dIq9PJ7\nLzk+bm4JaAOSK3GVP160C3MfMwKBgQDV+QJS8On/AjTjqZ1K3IJPF9iD3vjCYH4Y\nekV0N6Hix+DQs099SfGlDzN3Vp6zVOdYI6/CjZw1QSChfJYR9wAJr+7/HFQdkcZF\n4GT1Bm3GLAB/3qssF1vDC3T0aBB33ujB7OWp/7JYw/iCmdEpZ2H/tIT9mIrasPGW\n9ZuXeL1lJQKBgG0b8+BpQJQXJoKvX1zbWnXcnbo7zdbzA8wOlNPZ2cHv9KiEELOI\n6MRdq+4sUyDcmAwH7ZI1VjR1298kRh8BNOfQpF9cVPB590kBvcF+Hc93+UiE1P13\n1X5TyQNt6J5Hp2Uv5LQmEosPpTBv45VBPeLyvdHkS4SlBxjFBT0DtIbfAoGARALt\nIS3gQqUR6Jc+HtBuPvOmZ2wVB7uh+OfMcb9JHotHwy5rgrhhLYTiZ/lJYlkHW7Wk\nJSPb1fWIiKvQC4/GHE4mmkIH3oo6SnWjwVo0xDuyQPKm19Ho4dsfZpw5N9DLjPBe\no6VZq+tGb0Sy/gUVWjCn4O9+mzqI3+Hbfc7r7F0CgYEA500qIJLh4t1F6ehcrEkI\n8LjtEZ4gE5mRB0HMsvLF6tqzofYHg/450zQq3GbH1q36D0VDCtc/KJF7UDB3MwIH\n/2Gfwl6ThcXIxDT2v9xA3AGRcRGP0ssdX5JJBZoXjZAawpBFgzvrFZ2a0YCbXJ9a\nuIZbhxxu2imtdApo1hDoh94=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-wshgg@skipli-cf6b8.iam.gserviceaccount.com",
  "client_id": "102278485697135755586",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-wshgg%40skipli-cf6b8.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

initializeApp({
  credential: cert(serviceAccountKey)
});

const db = getFirestore();

module.exports = {
  db
}
