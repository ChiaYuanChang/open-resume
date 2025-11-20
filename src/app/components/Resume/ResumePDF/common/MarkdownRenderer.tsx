import { Text, View, Link } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { ResumePDFText } from "components/Resume/ResumePDF/common";

interface MarkdownRendererProps {
  content: string;
  style?: Style;
}

// Simple markdown parser for PDF rendering
export const MarkdownRenderer = ({ content, style = {} }: MarkdownRendererProps) => {
  if (!content.trim()) {
    return null;
  }

  const lines = content.split('\n'); // Don't filter out empty lines to preserve spacing
  const elements: React.ReactNode[] = [];

  let currentListItems: string[] = [];
  let inList = false;

  const flushList = () => {
    if (currentListItems.length > 0) {
      elements.push(
        <View key={`list-${elements.length}`} style={{ marginBottom: spacing["1"] }}>
          {currentListItems.map((item, idx) => (
            <View key={idx} style={{ ...styles.flexRow, marginBottom: spacing["0.5"] }}>
              <ResumePDFText style={{ paddingRight: spacing["2"] }}>•</ResumePDFText>
              <ResumePDFText style={{ flexGrow: 1, flexBasis: 0 }}>
                {parseInlineMarkdown(item)}
              </ResumePDFText>
            </View>
          ))}
        </View>
      );
      currentListItems = [];
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Handle empty lines - add spacing between paragraphs
    if (trimmedLine === '') {
      if (inList) {
        flushList();
      }
      // Add a small spacing element for empty lines
      if (elements.length > 0) {
        elements.push(
          <View key={`space-${index}`} style={{ height: spacing["0.5"] }} />
        );
      }
      return;
    }
    
    // Handle headers
    if (trimmedLine.startsWith('# ')) {
      flushList();
      const headerText = trimmedLine.substring(2);
      elements.push(
        <ResumePDFText 
          key={`h1-${index}`} 
          bold={true} 
          style={{ 
            fontSize: "11pt", 
            marginBottom: spacing["1"],
            marginTop: elements.length > 0 ? spacing["1.5"] : 0
          }}
        >
          {parseInlineMarkdown(headerText)}
        </ResumePDFText>
      );
    } else if (trimmedLine.startsWith('## ')) {
      flushList();
      const headerText = trimmedLine.substring(3);
      elements.push(
        <ResumePDFText 
          key={`h2-${index}`} 
          bold={true} 
          style={{ 
            fontSize: "10pt", 
            marginBottom: spacing["0.5"],
            marginTop: elements.length > 0 ? spacing["1"] : 0
          }}
        >
          {parseInlineMarkdown(headerText)}
        </ResumePDFText>
      );
    } else if (trimmedLine.startsWith('### ')) {
      flushList();
      const headerText = trimmedLine.substring(4);
      elements.push(
        <ResumePDFText 
          key={`h3-${index}`} 
          bold={true} 
          style={{ 
            fontSize: "9pt", 
            marginBottom: spacing["0.5"],
            marginTop: elements.length > 0 ? spacing["0.5"] : 0
          }}
        >
          {parseInlineMarkdown(headerText)}
        </ResumePDFText>
      );
    }
    // Handle unordered lists
    else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      const listItem = trimmedLine.substring(2);
      currentListItems.push(listItem);
      inList = true;
    }
    // Handle ordered lists
    else if (/^\d+\.\s/.test(trimmedLine)) {
      const listItem = trimmedLine.replace(/^\d+\.\s/, '');
      currentListItems.push(listItem);
      inList = true;
    }
    // Handle regular paragraphs
    else if (trimmedLine.length > 0) {
      flushList();
      elements.push(
        <ResumePDFText 
          key={`p-${index}`} 
          style={{ 
            marginBottom: spacing["0.5"], // Reduced margin for better paragraph spacing
            lineHeight: "1.3"
          }}
        >
          {parseInlineMarkdown(trimmedLine)}
        </ResumePDFText>
      );
    }
  });

  // Flush any remaining list items
  flushList();

  return (
    <View style={style}>
      {elements}
    </View>
  );
};

// Parse inline markdown (bold, italic, links, code)
const parseInlineMarkdown = (text: string): React.ReactNode => {
  // Handle hard line breaks (two spaces at end of line) first
  const textWithLineBreaks = text.replace(/ {2}\n/g, '\n'); // Fixed: removed consecutive spaces warning
  
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  let partIndex = 0;

  // Regular expressions for inline markdown
  const patterns = [
    { regex: /\*\*(.*?)\*\*/g, type: 'bold' },
    { regex: /\*(.*?)\*/g, type: 'italic' },
    { regex: /\[([^]]+)]\(([^)]+)\)/g, type: 'link' },
    { regex: /`([^`]+)`/g, type: 'code' },
  ];

  // Find all matches
  const matches: Array<{
    index: number;
    length: number;
    content: string;
    type: string;
    url?: string;
  }> = [];

  patterns.forEach(({ regex, type }) => {
    let match;
    const tempRegex = new RegExp(regex.source, regex.flags);
    while ((match = tempRegex.exec(textWithLineBreaks)) !== null) {
      matches.push({
        index: match.index,
        length: match[0].length,
        content: match[1],
        type,
        url: type === 'link' ? match[2] : undefined,
      });
    }
  });

  // Sort matches by index
  matches.sort((a, b) => a.index - b.index);

  // Process matches
  matches.forEach((match) => {
    // Add text before match
    if (match.index > currentIndex) {
      const beforeText = textWithLineBreaks.substring(currentIndex, match.index);
      if (beforeText) {
        parts.push(
          <Text key={`text-${partIndex++}`}>
            {beforeText}
          </Text>
        );
      }
    }

    // Add formatted match
    switch (match.type) {
      case 'bold':
        parts.push(
          <Text key={`bold-${partIndex++}`} style={{ fontWeight: 'bold' }}>
            {match.content}
          </Text>
        );
        break;
      case 'italic':
        parts.push(
          <Text key={`italic-${partIndex++}`} style={{ fontStyle: 'italic' }}>
            {match.content}
          </Text>
        );
        break;
      case 'link':
        parts.push(
          <Link key={`link-${partIndex++}`} src={match.url || '#'} style={{ color: '#0066cc' }}>
            {match.content}
          </Link>
        );
        break;
      case 'code':
        parts.push(
          <Text key={`code-${partIndex++}`} style={{ 
            fontFamily: 'Courier',
            backgroundColor: '#f5f5f5',
            fontSize: '8pt'
          }}>
            {match.content}
          </Text>
        );
        break;
    }

    currentIndex = match.index + match.length;
  });

  // Add remaining text
  if (currentIndex < textWithLineBreaks.length) {
    const remainingText = textWithLineBreaks.substring(currentIndex);
    if (remainingText) {
      parts.push(
        <Text key={`text-${partIndex++}`}>
          {remainingText}
        </Text>
      );
    }
  }

  return parts.length > 0 ? <>{parts}</> : textWithLineBreaks;
};
