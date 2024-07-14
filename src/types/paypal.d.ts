//types créé par bastien vdb et non par paypal directement
export type paypalCustomIdType = {
  userId: string;
  formData: formData;
  employeeId: string;
  employeeName: string;
};

type formData = {
  q1?: string | undefined;
  q2?: string | undefined;
  q3?: string | undefined;
  q4?: string | undefined;
  q5?: string | undefined;
  q6?: string | undefined;
  q7?: string | undefined;
  employee?: string | undefined;
};

export type paypalDescriptionItemType = {
  startTime: Date;
  endTime: Date;
};

//exemple de type de retour de l'api de paypal
export type paypalCheckoutOrderApprovedType = typeof checkoutOrderApprouved;

const checkoutOrderApprouved = {
  id: "WH-2B439334FN987980C-85589662NE765253P",
  create_time: "2024-06-23T08:24:14.838Z",
  resource_type: "checkout-order",
  event_type: "CHECKOUT.ORDER.APPROVED",
  summary: "An order has been approved by buyer",
  resource: {
    update_time: "2024-06-23T08:24:13Z",
    create_time: "2024-06-23T08:24:06Z",
    purchase_units: [
      {
        reference_id: "default",
        amount: {
          currency_code: "USD",
          value: "70.00",
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: "70.00",
            },
          },
        },
        payee: {
          email_address: "sb-vkgos30062005@business.example.com",
          merchant_id: "5SGUYBLWY5KYJ",
        },
        description: "66732501f4c457014c0a490c",
        custom_id:
          '{"userId":"666019ccbdad1b184f160cb3","formData":{"q1":"","q2":"","q3":"","q4":"","q5":"","q6":"","q7":"","q8":true}}',
        items: [
          {
            name: "66732501f4c457014c0a490c",
            unit_amount: {
              currency_code: "USD",
              value: "50.00",
            },
            quantity: "1",
            description:
              '{"startTime":"2024-06-24T05:00:00.000Z","endTime":"2024-06-24T06:00:00.000Z"}',
          },
          {
            name: "66732501f4c457014c0a490c",
            unit_amount: {
              currency_code: "USD",
              value: "20.00",
            },
            quantity: "1",
            description:
              "Mon Jun 24 2024 07:00:00 GMT+0200 (heure d’été d’Europe centrale)",
          },
        ],
        shipping: {
          name: {
            full_name: "John Doe",
          },
          address: {
            address_line_1: "Av. de la Pelouse, 87648672 Mayet",
            admin_area_2: "Paris",
            admin_area_1: "Alsace",
            postal_code: "75002",
            country_code: "FR",
          },
        },
        payments: {
          captures: [
            {
              id: "56607432S2228941U",
              status: "COMPLETED",
              amount: {
                currency_code: "USD",
                value: "70.00",
              },
              final_capture: true,
              seller_protection: {
                status: "ELIGIBLE",
                dispute_categories: [
                  "ITEM_NOT_RECEIVED",
                  "UNAUTHORIZED_TRANSACTION",
                ],
              },
              seller_receivable_breakdown: {
                gross_amount: {
                  currency_code: "USD",
                  value: "70.00",
                },
                paypal_fee: {
                  currency_code: "USD",
                  value: "2.68",
                },
                net_amount: {
                  currency_code: "USD",
                  value: "67.32",
                },
                receivable_amount: {
                  currency_code: "EUR",
                  value: "61.23",
                },
                exchange_rate: {
                  source_currency: "USD",
                  target_currency: "EUR",
                  value: "0.90948",
                },
              },
              custom_id:
                '{"userId":"666019ccbdad1b184f160cb3","formData":{"q1":"","q2":"","q3":"","q4":"","q5":"","q6":"","q7":"","q8":true}}',
              links: [
                {
                  href: "https://api.sandbox.paypal.com/v2/payments/captures/56607432S2228941U",
                  rel: "self",
                  method: "GET",
                },
                {
                  href: "https://api.sandbox.paypal.com/v2/payments/captures/56607432S2228941U/refund",
                  rel: "refund",
                  method: "POST",
                },
                {
                  href: "https://api.sandbox.paypal.com/v2/checkout/orders/20X79841MC7124056",
                  rel: "up",
                  method: "GET",
                },
              ],
              create_time: "2024-06-23T08:24:13Z",
              update_time: "2024-06-23T08:24:13Z",
            },
          ],
        },
      },
    ],
    links: [
      {
        href: "https://api.sandbox.paypal.com/v2/checkout/orders/20X79841MC7124056",
        rel: "self",
        method: "GET",
      },
    ],
    id: "20X79841MC7124056",
    payment_source: {
      paypal: {
        email_address: "sb-0jcb530065991@personal.example.com",
        account_id: "2C9J925A583MJ",
        account_status: "VERIFIED",
        name: {
          given_name: "John",
          surname: "Doe",
        },
        address: {
          country_code: "FR",
        },
      },
    },
    intent: "CAPTURE",
    payer: {
      name: {
        given_name: "John",
        surname: "Doe",
      },
      email_address: "sb-0jcb530065991@personal.example.com",
      payer_id: "2C9J925A583MJ",
      address: {
        country_code: "FR",
      },
    },
    status: "COMPLETED",
  },
  status: "PENDING",
  transmissions: [
    {
      webhook_url:
        "https://services-git-master-bastienvdbs-projects.vercel.app/api/checkout/paymentdone_paypal",
      http_status: 400,
      reason_phrase: "HTTP/1.1 200 Connection established",
      response_headers: {
        "Strict-Transport-Security":
          "max-age=63072000; includeSubDomains; preload",
        Server: "Vercel",
        Etag: '"w5xa8r157cv"',
        "Cache-Control": "public, max-age=0, must-revalidate",
        Connection: "keep-alive",
        "X-Vercel-Cache": "MISS",
        "Content-Length": "31",
        "X-Matched-Path": "/api/checkout/paymentdone_paypal",
        "X-Vercel-Id": "sfo1::iad1::kqns9-1719131068290-b018faf170c2",
        Date: "Sun, 23 Jun 2024 08:24:31 GMT",
        "Content-Type": "text/plain; charset=utf-8",
      },
      transmission_id: "ff5ebb30-3139-11ef-ac3c-db71f122b195",
      status: "PENDING",
      timestamp: "2024-06-23T08:24:23Z",
    },
  ],
  links: [
    {
      href: "https://api.sandbox.paypal.com/v1/notifications/webhooks-events/WH-2B439334FN987980C-85589662NE765253P",
      rel: "self",
      method: "GET",
      encType: "application/json",
    },
    {
      href: "https://api.sandbox.paypal.com/v1/notifications/webhooks-events/WH-2B439334FN987980C-85589662NE765253P/resend",
      rel: "resend",
      method: "POST",
      encType: "application/json",
    },
  ],
  event_version: "1.0",
  resource_version: "2.0",
};
