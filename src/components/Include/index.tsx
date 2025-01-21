import React, { useEffect, useState } from 'react';

export default function Include({ file }) {
  const [content, setContent] = useState('');

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch(`/api/includes/${file}`);
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error('Error fetching content:', error);
        setContent('Error loading content');
      }
    }
    fetchContent();
  }, [file]);

  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
