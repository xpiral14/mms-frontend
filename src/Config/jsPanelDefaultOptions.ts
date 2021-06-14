/* eslint-disable @typescript-eslint/no-empty-function */
export default {
  ziBase: 4,
  theme: '#137cbd',
  headerTitle: 'Default Title',
  position: 'center-top 0 20%',
  onwindowresize: false,
  content: (panel: any) => {
    const div = document.createElement('div')
    const newId = `${panel.id}-node`
    div.id = newId
    div.classList.add('screen-container')
    panel.content.append(div)
  },
  onclosed: () => {},
  borderRadius: '3px',
  iconfont: 'material-icons',
}
