import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro"; // Utilisez 'micro' pour lire le corps brut de la requête

export const config = {
  api: {
    bodyParser: false, // Important pour pouvoir lire les streams
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Votre logique de traitement de webhook commence ici

  // Lire le corps de la requête
  const buf = await buffer(req);
  const rawBody = buf.toString("utf-8");

  // console.log("req ==>", req);

  console.log("buf ==>", buf);

  console.log("rawbody paypal ==>", rawBody);

  // Extraire l'en-tête de transmission PayPal pour la validation
  const paypalTransmissionId = req.headers["paypal-transmission-id"];

  console.log("paypal route ==>", paypalTransmissionId);

  // Assurez-vous que toutes les variables nécessaires sont présentes
  if (!paypalTransmissionId) {
    console.log("Requête invalide ==>", paypalTransmissionId);
    return res.status(400).send("Requête invalide");
  }

  // Ici, vous effectueriez la validation de la signature du webhook avec l'API PayPal
  // Cette étape est cruciale pour la sécurité et doit être implémentée selon la documentation officielle PayPal

  try {
    // Parsez le corps de la requête pour obtenir l'objet de l'événement
    const webhookEvent = JSON.parse(rawBody);
    console.log("webhookEvent ==>", webhookEvent);

    // Exemple de gestion d'un événement de paiement réussi
    if (webhookEvent.event_type === "PAYMENT.SALE.COMPLETED") {
      // Logique spécifique à l'événement, par exemple, mise à jour de la base de données
      console.log("Paiement réussi", webhookEvent);

      // Réponse au serveur PayPal
      return res.status(200).send("Webhook traité avec succès");
    }

    // Exemple de gestion d'un événement de paiement réussi
    if (webhookEvent.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      // Logique spécifique à l'événement, par exemple, mise à jour de la base de données
      console.log("Paiement réussi", webhookEvent);

      // Réponse au serveur PayPal
      return res.status(200).send("Webhook traité avec succès");
    }

    // Ajoutez d'autres cas selon les types d'événements que vous gérez
  } catch (error) {
    console.error("Erreur lors du traitement du webhook:", error);
    return res.status(400).send("Erreur de traitement du webhook");
  }
}
