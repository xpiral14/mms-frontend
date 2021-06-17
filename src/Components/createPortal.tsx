import React from 'react'
import ReactDOM from 'react-dom'

class CreatePortal extends React.Component<any, any> {
  private el: any
  constructor(props: any) {
    super(props)
    this.el = document.createElement('div')
  }

  componentDidMount() {
    this.props.rootNode.appendChild(this.el)
  }

  componentWillUnmount() {
    this.props.rootNode.removeChild(this.el)
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el)
  }
}

export default CreatePortal
