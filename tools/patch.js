const fs = require('fs-extra')
const path = require('path')

const file1Path = 'node_modules/react-native/React/Views/RCTFont.h'
const file1Text = fs.readFileSync(file1Path,'utf8')
if (file1Text.indexOf(`RCT_EXTERN BOOL RCTHasFontHandlerSet();`) !== -1) {
  const file1TextNew = file1Text.replace(`RCT_EXTERN BOOL RCTHasFontHandlerSet();`, `RCT_EXTERN BOOL RCTHasFontHandlerSet(void);`)

  fs.writeFile(file1Path, file1TextNew, (error) => {
    if (error) console.error(error)
    console.info(`${file1Path} updated!`)
  })
}

const file2Path = 'node_modules/react-native/Libraries/Text/TextInput/RCTBaseTextInputShadowView.m'
const file2Text = fs.readFileSync(file2Path,'utf8')
if (file2Text.indexOf(`if (isAttributedTextChanged) {`) !== -1) {
  const file2TextNew = file2Text
        .replace(`if (isAttributedTextChanged) {`, `NSString *currentText = baseTextInputView.attributedText.string;\n    BOOL hasFilteredText = ![currentText isEqualToString:attributedText.string];\n\n    if (isAttributedTextChanged || hasFilteredText) {`)
        .replace(`CGSize _previousContentSize;`, `CGSize _previousContentSize;\n\n  NSString *_text;`)
        .replace(`#pragma mark - RCTUIManagerObserver`, `- (NSString *)text\n{\n  return _text;\n}\n\n- (void)setText:(NSString *)text\n{\n  _text = text;\n  _previousAttributedText = _localAttributedText;\n}\n\n#pragma mark - RCTUIManagerObserver`)

  fs.writeFile(file2Path, file2TextNew, (error) => {
    if (error) console.error(error)
    console.info(`${file2Path} updated!`)
  })
}


const file3Path = 'node_modules/react-native/Libraries/Text/TextInput/RCTBaseTextInputView.m'
const file3Text = fs.readFileSync(file3Path,'utf8')
if (file3Text.indexOf(`if (_onChange) {`) !== -1) {
  const file3TextNew = file3Text.replace(`if (_onChange) {`, `if (_onChange && backedTextInputView.markedTextRange == nil) {`)

  fs.writeFile(file3Path, file3TextNew, (error) => {
    if (error) console.error(error)
    console.info(`${file3Path} updated!`)
  })
}
