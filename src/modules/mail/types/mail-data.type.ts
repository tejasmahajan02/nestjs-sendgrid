export type PlainMailData = {
  to: string;
  subject: string;
  body: string;
};

export type TemplateMailData<
  TTemplateData extends Record<string, unknown> = {},
> = {
  to: string | string[];
  subject: string;
  templateId: string;
  templateData: TTemplateData;
};

export type MailData = PlainMailData | TemplateMailData;
