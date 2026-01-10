export type NewsCsvHeader = string;

export type NewsRow = Record<NewsCsvHeader, string | number>;

export type RawNewsItem = {
  title: string;
  url: string;
  source: string;
  date: string;
  summary: string;
  company?: string;
};
