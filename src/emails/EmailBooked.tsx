import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EmailRdvBookedProps {
  customerName?: string;
  bookingStartTime: string;
  serviceName: string;
  employeeName: string;
  businessPhysicalAddress: string;
  phone: string;
}

const baseUrl = process.env.NEXT_PUBLIC_HOST
  ? `${process.env.NEXT_PUBLIC_HOST}`
  : "";

export const EmailRdvBooked = ({
  customerName,
  bookingStartTime,
  serviceName,
  employeeName,
  businessPhysicalAddress,
  phone,
}: EmailRdvBookedProps) => {
  const bookingStartTimeFormatted = new Date(bookingStartTime);
  const optionsForDate: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const optionsForTime: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  const dateString = bookingStartTimeFormatted.toLocaleDateString(
    "fr-FR",
    optionsForDate
  );
  const heureString = bookingStartTimeFormatted.toLocaleTimeString(
    "fr-FR",
    optionsForTime
  );

  return (
    <Html>
      <Head />
      <Preview>Votre rendez-vous est en attente de confirmation</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/vendorImages/fineststudiologo.png`}
            width={48}
            height={48}
            alt="FinestLashStudio"
          />
          <Heading style={heading}>
            <Text style={paragraph}>🪄 Cher {customerName},</Text>
            <Text style={paragraph}>
              Le rendez-vous pour {serviceName}, avec {employeeName} au
              {businessPhysicalAddress}, le
              {bookingStartTime && dateString} à{" "}
              {bookingStartTime && heureString}, est actuellement en attente de
              confirmation.
            </Text>
          </Heading>
          <Section style={heading}>
            <Text style={paragraph}>
              Vous recevrez un email de confirmation dès qu’il aura été validé
              par l’un des membres de notre équipe. Si vous ne recevez pas cet
              email d’ici la fin de la journée, nous vous invitons à vérifier
              dans vos courriers indésirables ou spams.
            </Text>
            <Text style={paragraph}>
              Nous restons à votre disposition pour toute question.
            </Text>
            <Text style={paragraph}>Cordialement,</Text>
            <Text style={paragraph}>Your Finest Lash Artists,</Text>
          </Section>
          <Hr style={hr} />
          <Img
            src={`${baseUrl}/vendorImages/fineststudiologo.png`}
            width={32}
            height={32}
            style={{
              WebkitFilter: "grayscale(100%)",
              filter: "grayscale(100%)",
              margin: "20px 0",
            }}
          />
          <Text style={footer}>{businessPhysicalAddress}</Text>
          <Text style={footer}>{phone}</Text>
          <Text style={footer}>https://www.finestlash.studio</Text>
          <Text style={footer}>https://www.quickreserve.app</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailRdvBooked;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 25px 48px",
  backgroundImage: 'url("/assets/raycast-bg.png")',
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat, no-repeat",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "48px",
};

const body = {
  margin: "24px 0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const link = {
  color: "#FF6363",
};

const hr = {
  borderColor: "#dddddd",
  marginTop: "48px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  marginLeft: "4px",
};
