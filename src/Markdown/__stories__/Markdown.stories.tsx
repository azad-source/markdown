import { Modal, SizeProp, THEME_2022 } from '@skbkontur/react-ui';
import { text, ValidationContainer } from '@skbkontur/react-ui-validations';
import { Meta, StoryFn } from '@storybook/react';
import React, { useState } from 'react';

import { a11yRules } from '../../../a11y/rules';
import { MarkdownViewer } from '../../MarkdownViewer';
import { MarkdownThemeProvider } from '../../styles/theme';
import { allVariantsMarkdownMock } from '../__mocks__/markdown.mock';
import { Markdown } from '../Markdown';
import { MarkdownApi, RefItem, User } from '../types';

export default {
  title: 'Markdown',
  component: Markdown,
  decorators: [story => <div style={{ width: 486, minHeight: 388 }}>{story()}</div>],
  parameters: {
    a11y: {
      config: {
        rules: [a11yRules.buttonName, a11yRules.linkName],
      },
    },
  },
} as Meta;

const apiMock: MarkdownApi = {
  fileDownloadApi: () => new Promise<File>(resolve => resolve(new File(['a'], 'test.txt'))),
  fileUploadApi: () => new Promise<RefItem>(resolve => resolve({ id: 'i', caption: 'test.txt' })),
  getUsersApi: () => new Promise<User[]>(resolve => resolve([{ id: '1', name: 'Максим', login: 'login', teams: [] }])),
};

export const WithoutActions = () => <Markdown hideMarkdownActions value={allVariantsMarkdownMock} />;

export const WithSizeControl: StoryFn<{ size: SizeProp }> = args => (
  <Markdown size={args.size} value={allVariantsMarkdownMock} />
);

WithSizeControl.args = {
  size: 'medium',
};

const sizeOptions: SizeProp[] = ['small', 'medium', 'large'];
WithSizeControl.argTypes = {
  size: {
    control: {
      type: 'select',
      options: sizeOptions,
    },
  },
};

export const WithPanel = () => <Markdown borderless value={allVariantsMarkdownMock} panelHorizontalPadding={28} />;
export const WithoutHeadersSelect = () => (
  <Markdown borderless hideHeadersSelect value={allVariantsMarkdownMock} panelHorizontalPadding={28} />
);

export const Editable = () => {
  const [value, setValue] = useState<string>('');

  return (
    <Markdown api={apiMock} fileApiUrl="/api/file/download" value={value} maxLength={50000} onValueChange={setValue} />
  );
};

export const WithValidation = () => {
  const [value, setValue] = useState<string>(allVariantsMarkdownMock);

  return (
    <ValidationContainer>
      <Markdown
        withValidationWrapper
        value={value}
        validationInfo={{ type: 'immediate', level: 'error', message: 'error' }}
        onValueChange={setValue}
      />
    </ValidationContainer>
  );
};

export const InModal: StoryFn = () => {
  const [value, setValue] = useState<string>('');

  return (
    <MarkdownThemeProvider
      value={{
        reactUiTheme: THEME_2022,
        themeMode: 'light',
        colors: {
          grayDefault: 'black',
          link: 'black',
          panelBg: 'black',
          disabledButton: 'black',
          white: 'white',
          brand: 'black',
        },
        elementsFontSize: '14px',
        elementsLineHeight: '20px',
      }}
    >
      <Modal width={600}>
        <Modal.Header>In Modal</Modal.Header>
        <Modal.Body>
          <Markdown api={apiMock} value={value} maxLength={50000} onValueChange={setValue} />
        </Modal.Body>
      </Modal>
    </MarkdownThemeProvider>
  );
};

InModal.parameters = { creevey: { captureElement: 'body > div.react-ui > div' } };

export const CustomWidth: StoryFn = () => {
  const [value, setValue] = useState<string>(allVariantsMarkdownMock);

  return <Markdown width="550px" fileApiUrl="/api/file" value={value} onValueChange={setValue} />;
};

CustomWidth.decorators = [];

export const CustomValidation: StoryFn = () => {
  const [value, setValue] = useState<string>(allVariantsMarkdownMock);

  return (
    <ValidationContainer>
      <Markdown
        withValidationWrapper
        width={444}
        value={value}
        validationInfo={{ type: 'immediate', level: 'error', message: 'Сообщение валидации об ошибке в текстарии' }}
        renderMessage={text('bottom')}
        onValueChange={setValue}
      />
    </ValidationContainer>
  );
};

export const WithoutHints: StoryFn = () => {
  return (
    <ValidationContainer>
      <Markdown
        withValidationWrapper
        showShotKeys={false}
        value={allVariantsMarkdownMock}
        validationInfo={{ type: 'immediate', level: 'error', message: 'Сообщение валидации об ошибке в текстарии' }}
        renderMessage={text('bottom')}
      />
    </ValidationContainer>
  );
};

export const Viewer: StoryFn = () => (
  <div style={{ width: 320 }}>
    <MarkdownViewer fileApiUrl="/api/file/download" source={allVariantsMarkdownMock} />
  </div>
);

Viewer.parameters = {
  creevey: { delay: 5000 },
};
