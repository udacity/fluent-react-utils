# Fluent-react-utils

## CLI for localization stuff

string extraction

### l10nrc file
`customElements` 
format: componentName: {attribute: true}

`shorthandName` - by default, this is 'Loc'

`filePattern` = './src/app/**/*.{js,jsx}';
`outputDir` = './public/locales/new-strings/';

#### future work:
message deduplication
no reference warnings (may indicate obsolete string)

## helper components
Loc wrapper for html components