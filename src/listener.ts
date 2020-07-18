import { SNSHandler } from 'aws-lambda';
import 'source-map-support/register';


export const listen: SNSHandler = async (event, _context) => {
  console.log('****************Message received****************');
  console.log(event);
};
