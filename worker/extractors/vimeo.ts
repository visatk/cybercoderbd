import { Extractor, ExtractorResult } from './base';

export const vimeoExtractor: Extractor = {
  id: 'vimeo',
  canHandle: (url) => /vimeo\.com/.test(url),
  
  extract: async (url): Promise<ExtractorResult> => {
    const idMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (!idMatch) throw new Error('Invalid Vimeo Video ID');
    
    const videoId = idMatch[1];
    
    // Fetch Vimeo's internal player config
    const response = await fetch(`https://player.vimeo.com/video/${videoId}/config`);
    if (!response.ok) throw new Error('Failed to fetch Vimeo metadata');
    
    const data = await response.json();
    const tracks = data?.request?.text_tracks;

    if (!tracks || tracks.length === 0) {
      throw new Error('No subtitles found for this Vimeo video.');
    }

    const subtitles = tracks.map((track: any) => ({
      language: track.lang,
      languageCode: track.lang,
      url: `https://vimeo.com${track.url}`,
      format: 'vtt'
    }));

    return {
      platform: 'Vimeo',
      title: data?.video?.title || 'Vimeo Video',
      subtitles
    };
  }
};
