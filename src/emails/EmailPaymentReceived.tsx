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

interface EmailPaymentReceivedProps {
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

export const EmailPaymentReceived = ({
  customerName,
  bookingStartTime,
  serviceName,
  employeeName,
  businessPhysicalAddress,
  phone,
}: EmailPaymentReceivedProps) => {
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
      <Preview>Rendez-vous booké :</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/vendorImages/fineststudiologo.png`}
            width={48}
            height={48}
            alt="FinestLashStudio"
          />
          <Heading style={heading}>
            <Text style={paragraph}>🪄 Cher {employeeName},</Text>
            <Text style={paragraph}>
              Un rendez-vous pour le service {serviceName}, avec {customerName}{" "}
              à l&apos;adresse {businessPhysicalAddress}, prévu pour le{" "}
              {bookingStartTime && dateString} à{" "}
              {bookingStartTime && heureString}, est en attente de confirmation.
            </Text>
          </Heading>
          <Section style={heading}>
            <Text style={paragraph}>
              Vous pouvez confirmer le rendez-vous directement sur
              l'application.
            </Text>
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
          <Text className="text-xs" style={footer}>
            https://www.quickreserve.app
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailPaymentReceived;

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
