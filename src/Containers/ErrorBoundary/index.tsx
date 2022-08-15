import React from 'react'

export default class ErrorBoundary extends React.Component<{}, {hasError:boolean}> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    // Atualiza o state para que a próxima renderização mostre a UI alternativa.
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI alternativa
      return <h1>Algo deu errado.</h1>
    }

    return this.props.children 
  }
}
