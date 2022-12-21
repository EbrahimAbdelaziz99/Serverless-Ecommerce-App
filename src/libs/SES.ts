import { SESClient, SendEmailCommand, SendEmailCommandInput } from '@aws-sdk/client-ses';

const sesClient = new SESClient({});

export const sendEmail = async ({
  email,
  text,
  subject,
}: {
  email: string;
  text: string;
  subject: string;
}) => {
  const params: SendEmailCommandInput = {
    Source: 'ebrahim.abdelaziz@adzily.com',
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: text,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
  };

  const command = new SendEmailCommand(params);

  const res = await sesClient.send(command);
  
  return res.MessageId;
};

const SES = {
  sendEmail,
};

export default SES;