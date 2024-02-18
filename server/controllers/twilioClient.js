require('dotenv').config(); 
import twilio from 'twilio';
import { MessagingResponse } from 'twilio/lib/twiml/MessagingResponse';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);
const { MessagingResponse } = require('twilio').twiml;


export { client, twilioNumber , messagingResponse};