export interface Subtitle {
  language: string;
  languageCode: string;
  url: string;
  format: string; // e.g., 'srt', 'vtt', 'json3'
}

export interface ExtractorResult {
  platform: string;
  title: string;
  subtitles: Subtitle[];
}

export interface Extractor {
  id: string;
  canHandle(url: string): boolean;
  extract(url: string): Promise<ExtractorResult>;
}
