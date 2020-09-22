import { globalConfig } from '../../config';

export function replaceTagsOnMailString(text: string, substitutes: any): string {
  substitutes['mailAssetsRoot'] = globalConfig.mailAssetsRoot;
  substitutes['companyName'] = globalConfig.companyName;
  substitutes['companyPhone'] = globalConfig.companyPhone;
  substitutes['adminJoeEmail'] = globalConfig.adminJoeEmail;
  substitutes['companyInstagramLink'] = globalConfig.companyInstagramLink;
  substitutes['companyFacebookLink'] = globalConfig.companyFacebookLink;
  substitutes['companyAddress'] = globalConfig.companyAddress;
  substitutes['companyType'] = globalConfig.companyType;
  substitutes['unsubscribeLink'] = process.env.UNSUBSCRIBE_LINK;
  const keys = Object.keys(substitutes);
  keys.forEach(key => {
    text = text.replace(new RegExp('{{' + key + '}}', 'g'), substitutes[key]);
  });
  return text;
}
