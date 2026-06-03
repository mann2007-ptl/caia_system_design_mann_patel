import React from 'react';

/**
 * Lightweight Markdown renderer — handles headings, bold, italic,
 * inline code, code blocks, ordered/unordered lists, and paragraphs.
 * No external dependencies.
 */
const MarkdownRenderer = ({ content }) => {
    if (!content) return null;

    // Tokenize the content into blocks
    const blocks = [];
    const lines = content.split('\n');
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // ── Code block ──
        if (line.trim().startsWith('```')) {
            const lang = line.trim().slice(3).trim();
            const codeLines = [];
            i++;
            while (i < lines.length && !lines[i].trim().startsWith('```')) {
                codeLines.push(lines[i]);
                i++;
            }
            blocks.push({ type: 'code', lang, content: codeLines.join('\n') });
            i++; // skip closing ```
            continue;
        }

        // ── Heading ──
        const headingMatch = line.match(/^(#{1,4})\s+(.*)/);
        if (headingMatch) {
            blocks.push({ type: 'heading', level: headingMatch[1].length, content: headingMatch[2] });
            i++;
            continue;
        }

        // ── Unordered list (- or *) ──
        if (/^\s*[-*]\s+/.test(line)) {
            const listItems = [];
            while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
                listItems.push(lines[i].replace(/^\s*[-*]\s+/, ''));
                i++;
            }
            blocks.push({ type: 'ul', items: listItems });
            continue;
        }

        // ── Ordered list ──
        if (/^\s*\d+[.)]\s+/.test(line)) {
            const listItems = [];
            while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
                listItems.push(lines[i].replace(/^\s*\d+[.)]\s+/, ''));
                i++;
            }
            blocks.push({ type: 'ol', items: listItems });
            continue;
        }

        // ── Horizontal rule ──
        if (/^---+$/.test(line.trim()) || /^\*\*\*+$/.test(line.trim())) {
            blocks.push({ type: 'hr' });
            i++;
            continue;
        }

        // ── Empty line ──
        if (line.trim() === '') {
            i++;
            continue;
        }

        // ── Paragraph — collect consecutive non-special lines ──
        const paraLines = [];
        while (
            i < lines.length &&
            lines[i].trim() !== '' &&
            !lines[i].trim().startsWith('```') &&
            !lines[i].match(/^#{1,4}\s+/) &&
            !/^\s*[-*]\s+/.test(lines[i]) &&
            !/^\s*\d+[.)]\s+/.test(lines[i]) &&
            !/^---+$/.test(lines[i].trim())
        ) {
            paraLines.push(lines[i]);
            i++;
        }
        blocks.push({ type: 'paragraph', content: paraLines.join('\n') });
    }

    // Inline formatting: **bold**, *italic*, `code`
    const renderInline = (text) => {
        if (!text) return '';
        const parts = [];
        // Split by inline code first to avoid processing inside code spans
        const codeSplit = text.split(/(`[^`]+`)/g);
        codeSplit.forEach((segment, idx) => {
            if (segment.startsWith('`') && segment.endsWith('`')) {
                parts.push(<code key={idx} className="md-inline-code">{segment.slice(1, -1)}</code>);
            } else {
                // Bold + Italic
                const html = segment
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>');
                parts.push(<span key={idx} dangerouslySetInnerHTML={{ __html: html }} />);
            }
        });
        return parts;
    };

    return (
        <div className="markdown-body">
            {blocks.map((block, idx) => {
                switch (block.type) {
                    case 'heading': {
                        const Tag = `h${Math.min(block.level, 4)}`;
                        return <Tag key={idx} className={`md-h${block.level}`}>{renderInline(block.content)}</Tag>;
                    }
                    case 'paragraph':
                        return <p key={idx} className="md-paragraph">{renderInline(block.content)}</p>;
                    case 'ul':
                        return (
                            <ul key={idx} className="md-ul">
                                {block.items.map((item, i) => (
                                    <li key={i}>{renderInline(item)}</li>
                                ))}
                            </ul>
                        );
                    case 'ol':
                        return (
                            <ol key={idx} className="md-ol">
                                {block.items.map((item, i) => (
                                    <li key={i}>{renderInline(item)}</li>
                                ))}
                            </ol>
                        );
                    case 'code':
                        return (
                            <div key={idx} className="md-code-block">
                                {block.lang && <div className="md-code-lang">{block.lang}</div>}
                                <pre><code>{block.content}</code></pre>
                            </div>
                        );
                    case 'hr':
                        return <hr key={idx} className="md-hr" />;
                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default MarkdownRenderer;
