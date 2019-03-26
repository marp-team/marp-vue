const containerStyle = {
  display: 'flex',
  position: 'absolute',
  left: '20px',
  right: '20px',
  top: '20px',
  bottom: '20px',
}

const editorStyle = {
  border: '3px solid #f0f0f0',
  display: 'block',
  flex: 1,
  fontFamily: 'sans-serif',
  fontSize: '16px',
  margin: 0,
  outline: 0,
  padding: '20px',
  resize: 'none',
}

const previewContainerStyle = {
  background: '#f0f0f0',
  flex: 1,
  overflowY: 'auto',
}

export default function editor(preview) {
  return {
    components: { PreviewPane: preview },
    props: preview.props,
    data: () => ({ containerStyle, editorStyle, previewContainerStyle }),
    template: `
      <div :style="containerStyle">
        <textarea v-model="markdown" :style="editorStyle" />
        <div :style="previewContainerStyle">
          <PreviewPane :markdown="markdown" style="margin:20px;" />
        </div>
      </div>
    `,
  }
}
