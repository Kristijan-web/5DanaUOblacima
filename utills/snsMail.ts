import {
  SNSClient,
  PublishCommand,
  PublishCommandInput,
} from "@aws-sdk/client-sns";

// 1. Inicijalizacija SNS klijenta
// Klijent automatski preuzima akreditive sa IAM Role-a EC2 instance,
// a region uzima iz Environment varijable AWS_REGION (ako je setovana) ili default konfiguracije.
const snsClient = new SNSClient({ region: "eu-central-1" });

// Zamenite ovo vašim stvarnim ARN-om (Amazon Resource Name)
const CANCELLATION_TOPIC_ARN =
  "arn:aws:sns:eu-central-1:VAŠ_ACCOUNT_ID:canteen-reservation-cancellation";
// arn:aws:sns:eu-central-1:371290552230:canteen-reservation-cancellation:727135db-782f-4b54-8a1b-0e58fc36e769

interface NotificationData {
  studentEmail: string;
  canteenName: string;
  reservationTime: string; // npr. '2026-01-01 12:00'
}

/**
 * Šalje notifikaciju o otkazanoj rezervaciji na SNS Topic.
 * @param data Podaci o otkazanoj rezervaciji.
 */
export async function sendCancellationNotification(
  data: NotificationData
): Promise<void> {
  const { studentEmail, canteenName, reservationTime } = data;

  const subject = "Vaša rezervacija je otkazana!";
  const message = `Vaša rezervacija u menzi ${canteenName}, za termin ${reservationTime} je otkazana. Molimo vas potražite novi termin.`;

  const input: PublishCommandInput = {
    TopicArn: CANCELLATION_TOPIC_ARN,
    Subject: subject,
    Message: message,
    // Opcionalno, ako želite da koristite filtriranje:
    MessageAttributes: {
      // SNS ne koristi ovo polje, ali možete ga dodati za logovanje ili internu obradu
    },
  };

  try {
    const command = new PublishCommand(input);
    const response = await snsClient.send(command);
    console.log(`Uspešno poslato na SNS. Message ID: ${response.MessageId}`);
  } catch (error) {
    console.error("Greška pri slanju na SNS:", error);
    // U zavisnosti od logike, možete ovde baciti grešku ili samo logovati
    throw error;
  }
}
