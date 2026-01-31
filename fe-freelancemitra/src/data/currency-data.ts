export interface Currency {
  code: string;
  name: string;
  symbol: string;
  region: string;
}

export const CURRENCIES: Currency[] = [
  // Major Global Currencies
  { code: 'USD', name: 'US Dollar', symbol: '$', region: 'Global' },
  { code: 'EUR', name: 'Euro', symbol: '€', region: 'Europe' },
  { code: 'GBP', name: 'British Pound', symbol: '£', region: 'Europe' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', region: 'Asia' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', region: 'North America' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', region: 'Oceania' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', region: 'Europe' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', region: 'Asia' },

  // European Currencies
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', region: 'Europe' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', region: 'Europe' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', region: 'Europe' },
  { code: 'PLN', name: 'Polish Złoty', symbol: 'zł', region: 'Europe' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', region: 'Europe' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', region: 'Europe' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', region: 'Europe' },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', region: 'Europe' },
  { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn', region: 'Europe' },
  { code: 'RSD', name: 'Serbian Dinar', symbol: 'дин', region: 'Europe' },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', region: 'Europe' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', region: 'Europe' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', region: 'Europe' },

  // Asian Currencies
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', region: 'Asia' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', region: 'Asia' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', region: 'Asia' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', region: 'Asia' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', region: 'Asia' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', region: 'Asia' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', region: 'Asia' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', region: 'Asia' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', region: 'Asia' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', region: 'Asia' },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: '₨', region: 'Asia' },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: '₨', region: 'Asia' },
  { code: 'MMK', name: 'Myanmar Kyat', symbol: 'K', region: 'Asia' },
  { code: 'KHR', name: 'Cambodian Riel', symbol: '៛', region: 'Asia' },
  { code: 'LAK', name: 'Lao Kip', symbol: '₭', region: 'Asia' },
  { code: 'MNT', name: 'Mongolian Tögrög', symbol: '₮', region: 'Asia' },
  { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸', region: 'Asia' },
  { code: 'UZS', name: 'Uzbekistani Som', symbol: 'som', region: 'Asia' },
  { code: 'KGS', name: 'Kyrgyzstani Som', symbol: 'с', region: 'Asia' },
  { code: 'TJS', name: 'Tajikistani Somoni', symbol: 'ЅМ', region: 'Asia' },
  { code: 'TMT', name: 'Turkmenistani Manat', symbol: 'T', region: 'Asia' },
  { code: 'AFN', name: 'Afghan Afghani', symbol: '؋', region: 'Asia' },
  { code: 'IRR', name: 'Iranian Rial', symbol: '﷼', region: 'Asia' },
  { code: 'IQD', name: 'Iraqi Dinar', symbol: 'ع.د', region: 'Asia' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س', region: 'Asia' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', region: 'Asia' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق', region: 'Asia' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', region: 'Asia' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: '.د.ب', region: 'Asia' },
  { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع.', region: 'Asia' },
  { code: 'YER', name: 'Yemeni Rial', symbol: '﷼', region: 'Asia' },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'د.ا', region: 'Asia' },
  { code: 'LBP', name: 'Lebanese Pound', symbol: 'ل.ل', region: 'Asia' },
  { code: 'SYP', name: 'Syrian Pound', symbol: 'ل.س', region: 'Asia' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', region: 'Asia' },
  { code: 'GEL', name: 'Georgian Lari', symbol: '₾', region: 'Asia' },
  { code: 'AMD', name: 'Armenian Dram', symbol: '֏', region: 'Asia' },
  { code: 'AZN', name: 'Azerbaijani Manat', symbol: '₼', region: 'Asia' },

  // North American Currencies
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', region: 'North America' },

  // South American Currencies
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', region: 'South America' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', region: 'South America' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', region: 'South America' },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', region: 'South America' },
  { code: 'VES', name: 'Venezuelan Bolívar', symbol: 'Bs.', region: 'South America' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$', region: 'South America' },
  { code: 'BOB', name: 'Bolivian Boliviano', symbol: 'Bs', region: 'South America' },
  { code: 'PYG', name: 'Paraguayan Guaraní', symbol: '₲', region: 'South America' },
  { code: 'UYU', name: 'Uruguayan Peso', symbol: '$', region: 'South America' },

  // African Currencies
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', region: 'Africa' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: '£', region: 'Africa' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', region: 'Africa' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', region: 'Africa' },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', region: 'Africa' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', region: 'Africa' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', region: 'Africa' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', region: 'Africa' },
  { code: 'MGA', name: 'Malagasy Ariary', symbol: 'Ar', region: 'Africa' },
  { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA', region: 'Africa' },
  { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA', region: 'Africa' },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م.', region: 'Africa' },
  { code: 'DZD', name: 'Algerian Dinar', symbol: 'د.ج', region: 'Africa' },
  { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت', region: 'Africa' },
  { code: 'LYD', name: 'Libyan Dinar', symbol: 'ل.د', region: 'Africa' },
  { code: 'SDG', name: 'Sudanese Pound', symbol: 'ج.س.', region: 'Africa' },
  { code: 'SSP', name: 'South Sudanese Pound', symbol: '£', region: 'Africa' },
  { code: 'DJF', name: 'Djiboutian Franc', symbol: 'Fdj', region: 'Africa' },
  { code: 'SOS', name: 'Somali Shilling', symbol: 'Sh.So.', region: 'Africa' },
  { code: 'KMF', name: 'Comorian Franc', symbol: 'CF', region: 'Africa' },
  { code: 'MUR', name: 'Mauritian Rupee', symbol: '₨', region: 'Africa' },
  { code: 'SCR', name: 'Seychellois Rupee', symbol: '₨', region: 'Africa' },
  { code: 'MVR', name: 'Maldivian Rufiyaa', symbol: 'Rf', region: 'Africa' },
  { code: 'BIF', name: 'Burundian Franc', symbol: 'FBu', region: 'Africa' },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'FRw', region: 'Africa' },
  { code: 'CDF', name: 'Congolese Franc', symbol: 'FC', region: 'Africa' },
  { code: 'GMD', name: 'Gambian Dalasi', symbol: 'D', region: 'Africa' },
  { code: 'GNF', name: 'Guinean Franc', symbol: 'FG', region: 'Africa' },
  { code: 'SLL', name: 'Sierra Leonean Leone', symbol: 'Le', region: 'Africa' },
  { code: 'LRD', name: 'Liberian Dollar', symbol: '$', region: 'Africa' },
  { code: 'CVE', name: 'Cape Verdean Escudo', symbol: 'Esc', region: 'Africa' },
  { code: 'AOA', name: 'Angolan Kwanza', symbol: 'Kz', region: 'Africa' },
  { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'K', region: 'Africa' },
  { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MK', region: 'Africa' },
  { code: 'BWP', name: 'Botswana Pula', symbol: 'P', region: 'Africa' },
  { code: 'NAD', name: 'Namibian Dollar', symbol: '$', region: 'Africa' },
  { code: 'SZL', name: 'Swazi Lilangeni', symbol: 'L', region: 'Africa' },
  { code: 'LSL', name: 'Lesotho Loti', symbol: 'L', region: 'Africa' },

  // Oceania Currencies
  { code: 'FJD', name: 'Fijian Dollar', symbol: '$', region: 'Oceania' },
  { code: 'PGK', name: 'Papua New Guinean Kina', symbol: 'K', region: 'Oceania' },
  { code: 'SBD', name: 'Solomon Islands Dollar', symbol: '$', region: 'Oceania' },
  { code: 'VUV', name: 'Vanuatu Vatu', symbol: 'VT', region: 'Oceania' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: '$', region: 'Oceania' },
  { code: 'XPF', name: 'CFP Franc', symbol: '₣', region: 'Oceania' },
  { code: 'TOP', name: 'Tongan Paʻanga', symbol: 'T$', region: 'Oceania' },
  { code: 'WST', name: 'Samoan Tālā', symbol: 'T', region: 'Oceania' },
  { code: 'KID', name: 'Kiribati Dollar', symbol: '$', region: 'Oceania' },
  { code: 'TVD', name: 'Tuvaluan Dollar', symbol: '$', region: 'Oceania' },

  // Additional North American Currencies
  { code: 'NIO', name: 'Nicaraguan Córdoba', symbol: 'C$', region: 'North America' },
  { code: 'HNL', name: 'Honduran Lempira', symbol: 'L', region: 'North America' },
  { code: 'GTQ', name: 'Guatemalan Quetzal', symbol: 'Q', region: 'North America' },
  { code: 'BZD', name: 'Belize Dollar', symbol: '$', region: 'North America' },
  { code: 'BBD', name: 'Barbadian Dollar', symbol: '$', region: 'North America' },
  { code: 'TTD', name: 'Trinidad and Tobago Dollar', symbol: '$', region: 'North America' },
  { code: 'JMD', name: 'Jamaican Dollar', symbol: '$', region: 'North America' },
  { code: 'HTG', name: 'Haitian Gourde', symbol: 'G', region: 'North America' },
  { code: 'DOP', name: 'Dominican Peso', symbol: '$', region: 'North America' },
  { code: 'XCD', name: 'East Caribbean Dollar', symbol: '$', region: 'North America' },
  { code: 'ANG', name: 'Netherlands Antillean Guilder', symbol: 'ƒ', region: 'North America' },
  { code: 'AWG', name: 'Aruban Florin', symbol: 'ƒ', region: 'North America' },
  { code: 'KYD', name: 'Cayman Islands Dollar', symbol: '$', region: 'North America' },
  { code: 'BMD', name: 'Bermudian Dollar', symbol: '$', region: 'North America' },

  // Additional South American Currencies
  { code: 'FKP', name: 'Falkland Islands Pound', symbol: '£', region: 'South America' },
  { code: 'GYD', name: 'Guyanese Dollar', symbol: '$', region: 'South America' },
  { code: 'SRD', name: 'Surinamese Dollar', symbol: '$', region: 'South America' },
];

export const CURRENCY_REGIONS = [
  'Global',
  'Europe',
  'Asia',
  'North America',
  'South America',
  'Africa',
  'Oceania'
];

export const getCurrenciesByRegion = (region: string) => {
  return CURRENCIES.filter(currency => currency.region === region);
};

export const getAllCurrencies = () => CURRENCIES;
