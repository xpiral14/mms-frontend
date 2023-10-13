/* eslint-disable @typescript-eslint/no-empty-function */
export default {
  ziBase: 4,
  theme: '#137cbd',
  headerTitle: 'Default Title',
  position: 'center-top 0 20%',
  onwindowresize: false,
  content: (panel: any) => {
    const div = document.createElement('div')
    div.id = `${panel.id}-node`
    div.classList.add('screen-container')
    panel.content.append(div)
  },
  borderRadius: '3px',
  iconfont: ['flex-center bp5-icon bp5-icon-chevron-up', 'flex-center bp5-icon bp5-icon-minus','flex-center bp5-icon bp5-icon-maximize', 'flex-center bp5-icon bp5-icon-fullscreen', 'flex-center bp5-icon bp5-icon-cross'],
}
