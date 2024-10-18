import React from 'react';
import { Button, Dropdown, Input, Icon } from 'semantic-ui-react';

const toolbarOptions = [
  { key: 'H1', text: 'H1', value: 'h1' },
  { key: 'H2', text: 'H2', value: 'h2' },
  { key: 'Sans Serif', text: 'Sans Serif', value: 'sans-serif' },
  { key: 'Serif', text: 'Serif', value: 'serif' },
];

const textSizeOptions = [
  { key: 'Normal', text: 'Normal', value: 'normal' },
  { key: 'Small', text: 'Small', value: 'small' },
  { key: 'Large', text: 'Large', value: 'large' },
];

const TextEditorToolbar = () => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
      {/* Heading and Font Style */}
      <Dropdown
        placeholder='Select Style'
        selection
        options={toolbarOptions}
        style={{ marginRight: '10px' }}
      />
      {/* Font Size */}
      <Dropdown
        placeholder='Normal'
        selection
        options={textSizeOptions}
        style={{ marginRight: '10px' }}
      />
      
      {/* Bold, Italic, Underline */}
      <Button icon>
        <Icon name='bold' />
      </Button>
      <Button icon>
        <Icon name='italic' />
      </Button>
      <Button icon>
        <Icon name='underline' />
      </Button>
      
      {/* Blockquote */}
      <Button icon>
        <Icon name='quote left' />
      </Button>
      
      {/* List Items */}
      <Button icon>
        <Icon name='list ul' />
      </Button>
      <Button icon>
        <Icon name='list ol' />
      </Button>
      
      {/* Align Text */}
      <Button icon>
        <Icon name='align left' />
      </Button>
      <Button icon>
        <Icon name='align center' />
      </Button>
      <Button icon>
        <Icon name='align right' />
      </Button>
      
      {/* Insert Link, Image, and Code */}
      <Button icon>
        <Icon name='linkify' />
      </Button>
      <Button icon>
        <Icon name='image' />
      </Button>
      <Button icon>
        <Icon name='code' />
      </Button>

      {/* Input Field */}
      <Input placeholder='Start writing...' style={{ marginTop: '10px', width: '100%' }} />
    </div>
  );
};

export default TextEditorToolbar;
