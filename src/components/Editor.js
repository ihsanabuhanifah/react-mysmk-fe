import React, { useCallback, useEffect, useRef, useState, useMemo, memo } from 'react';
import ReactQuill from 'react-quill';
import Resizer from 'react-image-file-resizer';
import { Dimmer, Loader, Message, MessageHeader } from 'semantic-ui-react';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import clsx from 'clsx';
import { debounce } from 'lodash';
import { uploadFile } from '../api/guru/upload';

// Global KaTeX configuration
window.katex = katex;

const Editor = memo(({ value, handleChange, error, ...props }) => {
  const reactQuillRef = useRef(null);
  const [localLoading, setLocalLoading] = useState(false);
  const lastValueRef = useRef(value);
  const isMounted = useRef(true);

  // Cleanup mount status
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Image upload handler
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (!input.files?.length || !isMounted.current) return;

      setLocalLoading(true);
      try {
        const file = input.files[0];
        const image = await resizeFile(file);
        const res = await uploadFile(image);
        
        if (isMounted.current && reactQuillRef.current) {
          const range = reactQuillRef.current.getEditorSelection();
          range && reactQuillRef.current.getEditor().insertEmbed(range.index, 'image', res.data.url);
        }
      } catch {
        alert('Upload gagal');
      } finally {
        if (isMounted.current) setLocalLoading(false);
      }
    };
  }, []);

  // Paste handler with image support
  const handlePaste = useCallback(async (event) => {
    const items = (event.clipboardData || window.clipboardData).items;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        event.preventDefault();
        setLocalLoading(true);
        
        try {
          const file = items[i].getAsFile();
          const resizedImage = await resizeFile(file);
          const res = await uploadFile(resizedImage);
          
          if (isMounted.current && reactQuillRef.current) {
            const range = reactQuillRef.current.getEditorSelection();
            range && reactQuillRef.current.getEditor().insertEmbed(range.index, 'image', res.data.url);
          }
        } catch {
          alert('Upload gagal');
        } finally {
          if (isMounted.current) setLocalLoading(false);
        }
        break;
      }
    }
  }, []);

  // Math rendering with debounce and cleanup
  const renderMath = useCallback(debounce(() => {
    if (!isMounted.current || !reactQuillRef.current) return;

    const editor = reactQuillRef.current.getEditor();
    const content = editor.root.innerHTML;
    const latexRegex = /\$(.*?)\$/g;
    const latexMatches = content.match(latexRegex);

    if (latexMatches) {
      let newContent = content;
      latexMatches.forEach((latex) => {
        try {
          const rendered = katex.renderToString(latex.replace(/\$/g, ''), {
            throwOnError: false,
          });
          newContent = newContent.replace(latex, rendered);
        } catch (error) {
          console.error('KaTeX render error:', error);
        }
      });

      const delta = editor.clipboard.convert(newContent);
      editor.setContents(delta, 'silent');
    }
  }, 1000), []);

  // Setup and cleanup event listeners
  useEffect(() => {
    const editor = reactQuillRef.current?.getEditor();
    if (!editor) return;

    const handleTextChange = () => renderMath();
    
    editor.root.addEventListener('paste', handlePaste);
    editor.on('text-change', handleTextChange);

    return () => {
      editor.root.removeEventListener('paste', handlePaste);
      editor.off('text-change', handleTextChange);
      renderMath.cancel();
    };
  }, [handlePaste, renderMath]);

  // Track value changes for math rendering
  useEffect(() => {
    if (value !== lastValueRef.current) {
      lastValueRef.current = value;
      renderMath();
    }
  }, [value, renderMath]);

  // Memoized Quill modules configuration
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { indent: '-1' },
          { indent: '+1' },
        ],
        ['link', 'image', 'video', 'formula'],
        ['code-block'],
      ],
      handlers: { image: imageHandler },
      clipboard: { matchVisual: false },
    },
    clipboard: { matchVisual: false },
  }), [imageHandler]);

  return (
    <div className="editor-container">
      {localLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dimmer active inverted style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
            <Loader size="large">Upload File Image</Loader>
          </Dimmer>
        </div>
      )}
      
      <ReactQuill
        ref={reactQuillRef}
        theme="snow"
        className={clsx('quill-editor', {
          'border border-[#E0B4B4]': error,
        })}
        placeholder="Start writing..."
        modules={modules}
        formats={[
          'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
          'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'video',
          'formula', 'color', 'background', 'align', 'code-block', 'script'
        ]}
        value={value}
        onChange={handleChange}
        {...props}
      />

      {error && (
        <Message negative>
          <MessageHeader>Wajib isi</MessageHeader>
        </Message>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if value or error changes
  return prevProps.value === nextProps.value && 
         prevProps.error === nextProps.error;
});

// Image resizing utility
export const resizeFile = (file, rotate = 0) => (
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1000,
      1200,
      'JPEG',
      50,
      rotate,
      (uri) => resolve(uri),
      'file'
    );
  })
);


const MemoizedEditor = React.memo(({ value, onChange }) => (
  <Editor value={value} handleChange={onChange} />
), (prev, next) => prev.value === next.value);

export default MemoizedEditor;